import { prisma, logger, config } from '../config';
import { emailService } from './email.service';
import { IssuanceType, IssuanceStatus } from '@prisma/client';

export class IssuanceService {
  /**
   * Helper to check if a user is an admin or manager
   */
  private isAdminOrManager(user: any): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some((r: string) => {
      const up = r.toUpperCase();
      return up === 'ADMIN' || up === 'SUPER_ADMIN' || up === 'SUPERADMIN' || up === 'MANAGER';
    });
  }

  /**
   * Retrieve all tickets with calculated SLA metrics and search/filtering
   */
  async findAll(user: any, query: { type?: string; search?: string }) {
    const { type, search } = query;

    const where: any = {};
    if (type && type !== 'ALL') {
      where.type = type as IssuanceType;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { ticketNumber: { contains: q, mode: 'insensitive' } },
        { leadGuestName: { contains: q, mode: 'insensitive' } },
        { airline: { contains: q, mode: 'insensitive' } },
        { hotelName: { contains: q, mode: 'insensitive' } },
        { bookingReference: { contains: q, mode: 'insensitive' } },
        { pnrTicketNumber: { contains: q, mode: 'insensitive' } },
        { hotelReservationNo: { contains: q, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.issuanceTicket.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        booking: {
          select: {
            id: true,
            bookingReference: true,
            totalPrice: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = Date.now();
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

    return tickets.map((t) => {
      const timeInStatusMs = now - new Date(t.statusChangedAt).getTime();
      const isSlaBreached =
        (t.status === IssuanceStatus.TO_DO || t.status === IssuanceStatus.PENDING) &&
        timeInStatusMs > TWO_HOURS_MS;

      const creatorName = t.createdBy
        ? `${t.createdBy.firstName} ${t.createdBy.lastName}`.trim()
        : 'System';
      const assigneeName = t.assignedTo
        ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}`.trim()
        : null;

      return {
        ...t,
        isSlaBreached,
        elapsedMinutes: Math.floor(timeInStatusMs / (60 * 1000)),
        creatorName,
        assigneeName,
      };
    });
  }

  /**
   * Find single ticket by ID
   */
  async findOne(id: string) {
    const ticket = await prisma.issuanceTicket.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        booking: true,
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      throw new Error('Issuance ticket not found');
    }

    return ticket;
  }

  /**
   * Create an issuance ticket manually
   */
  async create(userId: string, data: any) {
    const count = await prisma.issuanceTicket.count();
    const year = new Date().getFullYear();
    const ticketNumber = `ISS-${year}-${String(count + 1).padStart(4, '0')}`;

    const newTicket = await prisma.issuanceTicket.create({
      data: {
        ticketNumber,
        type: data.type as IssuanceType,
        status: IssuanceStatus.TO_DO,
        paymentStatus: data.paymentStatus || 'PENDING',
        leadGuestName: data.leadGuestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        travelStartDate: new Date(data.travelStartDate),
        travelEndDate: data.travelEndDate ? new Date(data.travelEndDate) : null,
        totalCost: Number(data.totalCost) || 0.0,
        currency: data.currency || 'GBP',
        airline: data.airline,
        flightNumbers: data.flightNumbers,
        routing: data.routing,
        pnrTicketNumber: data.pnrTicketNumber,
        hotelName: data.hotelName,
        destination: data.destination,
        roomCategory: data.roomCategory,
        boardBasis: data.boardBasis,
        hotelReservationNo: data.hotelReservationNo,
        bookingId: data.bookingId,
        bookingReference: data.bookingReference,
        serviceId: data.serviceId,
        createdById: userId,
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Record initial audit log
    await prisma.issuanceTicketAuditLog.create({
      data: {
        ticketId: newTicket.id,
        userId,
        userName: newTicket.createdBy ? `${newTicket.createdBy.firstName} ${newTicket.createdBy.lastName}` : 'Agent',
        toStatus: IssuanceStatus.TO_DO,
        action: 'CREATED',
        notes: 'Ticket created and entered To Do queue.',
      },
    });

    // Dispatch webhook email to Admin Team
    this.sendIssuanceEmailNotification('TICKET_CREATED_TO_DO', newTicket).catch((err) =>
      logger.error('Failed to send issuance creation email notification', err)
    );

    return newTicket;
  }

  /**
   * 1-Click creation of an Issuance Ticket directly from an existing Booking
   */
  async createFromBooking(userId: string, bookingId: string, payload: { type: IssuanceType; serviceId?: string }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        passengers: true,
        flightServices: true,
        accommodations: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const leadPassenger =
      booking.passengers.find((p) => p.role === 'Leader') || booking.passengers[0];
    const guestName = leadPassenger
      ? `${leadPassenger.title ? leadPassenger.title + ' ' : ''}${leadPassenger.firstName} ${leadPassenger.lastName}`.trim()
      : 'Valued Guest';

    const count = await prisma.issuanceTicket.count();
    const year = new Date().getFullYear();
    const ticketNumber = `ISS-${year}-${String(count + 1).padStart(4, '0')}`;

    let ticketData: any = {
      ticketNumber,
      type: payload.type,
      status: IssuanceStatus.TO_DO,
      paymentStatus: booking.paymentStatus || 'PENDING',
      leadGuestName: guestName,
      guestEmail: leadPassenger?.email || undefined,
      guestPhone: leadPassenger?.phoneNumber || undefined,
      travelStartDate: booking.departureDate || new Date(),
      totalCost: booking.totalPrice || 0.0,
      currency: 'GBP',
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      serviceId: payload.serviceId,
      createdById: userId,
    };

    if (payload.type === IssuanceType.FLIGHT) {
      const flight = payload.serviceId
        ? booking.flightServices.find((f) => f.id === payload.serviceId)
        : booking.flightServices[0];

      if (flight) {
        ticketData.airline = flight.flightNo?.substring(0, 2) || 'Flight Partner';
        ticketData.flightNumbers = flight.flightNo;
        ticketData.routing = `${flight.departedFrom} -> ${flight.arrivedAt}`;
        ticketData.travelStartDate = flight.date;
        ticketData.pnrTicketNumber = flight.pnr || undefined;
      }
    } else {
      const hotel = payload.serviceId
        ? booking.accommodations.find((h) => h.id === payload.serviceId)
        : booking.accommodations[0];

      if (hotel) {
        ticketData.hotelName = hotel.hotelName;
        ticketData.destination = hotel.city || 'Destination';
        ticketData.roomCategory = hotel.roomType;
        ticketData.boardBasis = hotel.mealType;
        ticketData.travelStartDate = hotel.checkInDate;
        ticketData.travelEndDate = hotel.checkOutDate;
        ticketData.hotelReservationNo = hotel.reservationNumber || hotel.hotelConfirmationNumber || undefined;
      }
    }

    const ticket = await prisma.issuanceTicket.create({
      data: ticketData,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    await prisma.issuanceTicketAuditLog.create({
      data: {
        ticketId: ticket.id,
        userId,
        toStatus: IssuanceStatus.TO_DO,
        action: 'CREATED_FROM_BOOKING',
        notes: `Issuance ticket automatically generated from Booking ${booking.bookingReference}.`,
      },
    });

    this.sendIssuanceEmailNotification('TICKET_CREATED_TO_DO', ticket).catch((err) =>
      logger.error('Failed to send issuance creation email notification', err)
    );

    return ticket;
  }

  /**
   * Handle Kanban Drag-and-Drop Status Transitions
   */
  async updateStatus(
    ticketId: string,
    user: any,
    payload: {
      newStatus: IssuanceStatus;
      outputConfirmation?: string;
      holdReason?: string;
    }
  ) {
    const ticket = await prisma.issuanceTicket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: true,
        assignedTo: true,
      },
    });

    if (!ticket) {
      throw new Error('Issuance ticket not found');
    }

    const { newStatus, outputConfirmation, holdReason } = payload;

    // RULE 1: Agents cannot move cards to "ISSUED"
    if (newStatus === IssuanceStatus.ISSUED && !this.isAdminOrManager(user)) {
      throw new Error('Forbidden: Only Issuance Admins & Managers can finalize bookings to Issued status.');
    }

    // RULE 2: Mandatory Output Validation for ISSUED status
    const confirmation: string =
      (outputConfirmation?.trim() ||
        (ticket.type === IssuanceType.FLIGHT ? ticket.pnrTicketNumber : ticket.hotelReservationNo) ||
        '').trim();

    if (newStatus === IssuanceStatus.ISSUED && !confirmation) {
      const missingField = ticket.type === IssuanceType.FLIGHT ? 'Airline PNR / Ticket Number' : 'Hotel Reservation Number';
      throw new Error(`Validation Error: ${missingField} is mandatory before moving card to Issued.`);
    }

    const updateData: any = {
      status: newStatus,
      statusChangedAt: new Date(),
    };

    // Auto-assignment if an Admin moves to PENDING
    if (newStatus === IssuanceStatus.PENDING && !ticket.assignedToId) {
      updateData.assignedToId = user.id;
    }

    // On-Hold reason tracking
    if (newStatus === IssuanceStatus.ON_HOLD) {
      updateData.holdReason = holdReason?.trim() || 'Missing information / agent clarification required.';
    }

    // If moving to ISSUED, apply output field, set locked to true
    if (newStatus === IssuanceStatus.ISSUED) {
      if (ticket.type === IssuanceType.FLIGHT) {
        updateData.pnrTicketNumber = confirmation.toUpperCase();
      } else {
        updateData.hotelReservationNo = confirmation.toUpperCase();
      }
      updateData.isLocked = true;
      updateData.lockedAt = new Date();

      // Deep Sync: Synchronize back to associated Booking and its services
      if (ticket.bookingId) {
        try {
          if (ticket.type === IssuanceType.FLIGHT) {
            if (ticket.serviceId) {
              await prisma.flightService.update({
                where: { id: ticket.serviceId },
                data: {
                  pnr: confirmation.toUpperCase(),
                  status: 'TICKET_ISSUED',
                  confirmationNumber: confirmation.toUpperCase(),
                },
              });
            } else {
              // Update all flights on this booking
              await prisma.flightService.updateMany({
                where: { bookingId: ticket.bookingId },
                data: {
                  pnr: confirmation.toUpperCase(),
                  status: 'TICKET_ISSUED',
                  confirmationNumber: confirmation.toUpperCase(),
                },
              });
            }
          } else if (ticket.type === IssuanceType.HOTEL) {
            if (ticket.serviceId) {
              await prisma.accommodationService.update({
                where: { id: ticket.serviceId },
                data: {
                  reservationNumber: confirmation.toUpperCase(),
                  hotelConfirmationNumber: confirmation.toUpperCase(),
                },
              });
            } else {
              await prisma.accommodationService.updateMany({
                where: { bookingId: ticket.bookingId },
                data: {
                  reservationNumber: confirmation.toUpperCase(),
                  hotelConfirmationNumber: confirmation.toUpperCase(),
                },
              });
            }
          }
        } catch (syncErr) {
          logger.error('Failed to sync issuance confirmation to underlying booking service', syncErr);
        }
      }
    }

    const updated = await prisma.issuanceTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Audit Log
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    await prisma.issuanceTicketAuditLog.create({
      data: {
        ticketId: updated.id,
        userId: user.id,
        userName,
        fromStatus: ticket.status,
        toStatus: newStatus,
        action: `STATUS_CHANGED_TO_${newStatus}`,
        notes:
          newStatus === IssuanceStatus.ON_HOLD
            ? `Hold Reason: ${holdReason}`
            : newStatus === IssuanceStatus.ISSUED
              ? `Output Conf: ${confirmation}`
              : undefined,
      },
    });

    // EMAIL AUTOMATIONS
    if (newStatus === IssuanceStatus.ON_HOLD) {
      this.sendIssuanceEmailNotification('TICKET_MOVED_ON_HOLD', updated, holdReason).catch((err) =>
        logger.error('Failed to send ON_HOLD email notification', err)
      );
    } else if (newStatus === IssuanceStatus.ISSUED) {
      this.sendIssuanceEmailNotification('TICKET_ISSUED_CONFIRMED', updated).catch((err) =>
        logger.error('Failed to send ISSUED email notification', err)
      );
    }

    return updated;
  }

  /**
   * Update details of an issuance ticket with Auto-Locking protection
   */
  async update(ticketId: string, user: any, data: any) {
    const ticket = await prisma.issuanceTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error('Issuance ticket not found');
    }

    // Auto-Locking: If locked, financial and date fields cannot be edited without Manager/Admin role
    const isSensitiveEdited =
      data.totalCost !== undefined ||
      data.travelStartDate !== undefined ||
      data.travelEndDate !== undefined;

    if (ticket.isLocked && isSensitiveEdited && !this.isAdminOrManager(user)) {
      throw new Error('Locked Record: Financial and travel dates are finalized and locked. Requires Manager override.');
    }

    const updatePayload: any = { ...data };
    if (data.travelStartDate) updatePayload.travelStartDate = new Date(data.travelStartDate);
    if (data.travelEndDate) updatePayload.travelEndDate = new Date(data.travelEndDate);

    return prisma.issuanceTicket.update({
      where: { id: ticketId },
      data: updatePayload,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  /**
   * Automated Email Notification Dispatcher
   */
  private async sendIssuanceEmailNotification(
    event: 'TICKET_CREATED_TO_DO' | 'TICKET_MOVED_ON_HOLD' | 'TICKET_ISSUED_CONFIRMED',
    ticket: any,
    notes?: string
  ) {
    const confirmationText =
      ticket.type === IssuanceType.FLIGHT
        ? `PNR / Ticket: ${ticket.pnrTicketNumber || 'N/A'}`
        : `Hotel Confirmation: ${ticket.hotelReservationNo || 'N/A'}`;

    let subject = '';
    let htmlContent = '';
    let toEmails: string[] = [];

    const brandHeader = `
      <div style="background-color: #0F172A; padding: 18px 24px; border-radius: 8px 8px 0 0; text-align: left;">
        <h2 style="color: #FFFFFF; margin: 0; font-family: 'Outfit', Arial, sans-serif; font-size: 18px;">
          Terrific Travel &amp; Tours — Operations Desk
        </h2>
      </div>
    `;

    if (event === 'TICKET_CREATED_TO_DO') {
      subject = `[Issuance Request] New ${ticket.type} Ticket ${ticket.ticketNumber} - ${ticket.leadGuestName}`;
      toEmails = ['office@terrifictravel.co.uk'];
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 8px;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: #0284C7; margin-top: 0;">New Issuance Request in Queue</h3>
            <p>A new issuance request has been logged into the <strong>To Do</strong> queue:</p>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 14px; margin: 16px 0; font-size: 13px;">
              <p style="margin: 4px 0;"><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
              <p style="margin: 4px 0;"><strong>Type:</strong> ${ticket.type}</p>
              <p style="margin: 4px 0;"><strong>Lead Guest:</strong> ${ticket.leadGuestName}</p>
              <p style="margin: 4px 0;"><strong>Travel Date:</strong> ${new Date(ticket.travelStartDate).toLocaleDateString()}</p>
              ${ticket.bookingReference ? `<p style="margin: 4px 0;"><strong>Booking Ref:</strong> ${ticket.bookingReference}</p>` : ''}
              ${ticket.flightNumbers ? `<p style="margin: 4px 0;"><strong>Flight(s):</strong> ${ticket.flightNumbers} (${ticket.routing || ''})</p>` : ''}
              ${ticket.hotelName ? `<p style="margin: 4px 0;"><strong>Hotel:</strong> ${ticket.hotelName} (${ticket.destination || ''})</p>` : ''}
            </div>
            <p style="font-size: 12px; color: #64748B;">Please assign and process this request within the 2-hour SLA window.</p>
          </div>
        </div>
      `;
    } else if (event === 'TICKET_MOVED_ON_HOLD') {
      subject = `[Action Required] Issuance Ticket ${ticket.ticketNumber} Placed ON HOLD`;
      if (ticket.createdBy?.email) toEmails.push(ticket.createdBy.email);
      toEmails.push('office@terrifictravel.co.uk');
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 8px;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: #D97706; margin-top: 0;">Ticket Placed On Hold</h3>
            <p>Your issuance ticket <strong>${ticket.ticketNumber}</strong> (${ticket.leadGuestName}) has been placed on hold by the operations desk.</p>
            <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 14px; margin: 16px 0; font-size: 13px; color: #92400E;">
              <strong>Clarification Needed:</strong><br/>
              ${notes || 'Missing customer details, payment clearance, or flight schedule clarification needed.'}
            </div>
            <p style="font-size: 12px; color: #64748B;">Please review and reply to the issuance desk or update the booking directly.</p>
          </div>
        </div>
      `;
    } else if (event === 'TICKET_ISSUED_CONFIRMED') {
      subject = `[Booking Confirmed] ${ticket.type} Finalized: ${ticket.ticketNumber} - ${confirmationText}`;
      if (ticket.createdBy?.email) toEmails.push(ticket.createdBy.email);
      if (ticket.guestEmail) toEmails.push(ticket.guestEmail);
      toEmails.push('office@terrifictravel.co.uk');
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 600px; border: 1px solid #E2E8F0; border-radius: 8px;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: #059669; margin-top: 0;">Booking Finalized &amp; Issued</h3>
            <p>The issuance team has finalized the reservation for <strong>${ticket.leadGuestName}</strong>.</p>
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <p style="font-size: 15px; font-weight: bold; color: #065F46; margin: 0 0 6px 0;">
                ${confirmationText}
              </p>
              <p style="margin: 0; font-size: 12px; color: #047857;">
                Total Cost: ${ticket.currency} ${Number(ticket.totalCost).toFixed(2)} | Status: Finalized &amp; Locked
              </p>
            </div>
            <p style="font-size: 12px; color: #64748B;">This service is now locked. Financial and schedule modifications require manager authorization.</p>
          </div>
        </div>
      `;
    }

    try {
      await (emailService as any).transporter.sendMail({
        from: config.smtp.from || 'office@terrifictravel.co.uk',
        to: toEmails.join(', '),
        subject,
        html: htmlContent,
      });
      logger.info(`Dispatched issuance notification email for ticket ${ticket.ticketNumber} (${event}) to ${toEmails.join(', ')}`);
    } catch (err) {
      logger.warn(`Could not send issuance notification email (${event}):`, err);
    }
  }
}

export const issuanceService = new IssuanceService();

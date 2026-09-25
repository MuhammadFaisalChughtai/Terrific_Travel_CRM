import { prisma, logger, config } from '../config';
import { emailService } from './email.service';
import { IssuanceType, IssuanceStatus } from '@prisma/client';

export class IssuanceService {
  /**
   * Helper to check if a user is a System Administrator (Admin or SuperAdmin)
   */
  private isSystemAdmin(user: any): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some((r: string) => {
      const up = r.toUpperCase().replace(/[\s_-]+/g, '');
      return up === 'ADMIN' || up === 'SUPERADMIN';
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

    return tickets.map((t) => {
      const creatorName = t.createdBy
        ? `${t.createdBy.firstName} ${t.createdBy.lastName}`.trim()
        : 'System';
      const assigneeName = t.assignedTo
        ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}`.trim()
        : null;

      return {
        ...t,
        isLocked: t.status === IssuanceStatus.ISSUED && t.isLocked,
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
        accommodations: {
          include: { vendor: true },
        },
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
        ticketData.totalCost = Number(flight.price) || 0.0;
        ticketData.currency = flight.currency || 'GBP';
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
        // Specifically set hotel cost to Agent Quoted Price (or purchase price if quoted not set)
        ticketData.totalCost = Number(hotel.agentQuotedPrice ?? hotel.price) || 0.0;
        ticketData.currency = hotel.currency || 'GBP';
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

    // STRICT RULE: Only System Administrators can move cards or change status on the Issuance Board
    if (!this.isSystemAdmin(user)) {
      throw new Error('Forbidden: Only System Administrators can move cards or change status on the Issuance Board.');
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

    // If a System Admin moves a ticket out of ISSUED, unlock it
    if (ticket.status === IssuanceStatus.ISSUED && newStatus !== IssuanceStatus.ISSUED) {
      updateData.isLocked = false;
      updateData.lockedAt = null;
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

    if (ticket.isLocked && isSensitiveEdited && !this.isSystemAdmin(user)) {
      throw new Error('Locked Record: Financial and travel dates are finalized and locked. Requires System Admin override.');
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
   * Delete / Remove an issuance ticket
   */
  async delete(ticketId: string, user: any) {
    const ticket = await prisma.issuanceTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new Error('Issuance ticket not found');
    }

    return prisma.issuanceTicket.delete({
      where: { id: ticketId },
    });
  }

  /**
   * Automated Email Notification Dispatcher
   * Strictly delivers to Hotel + Admin email only for HOTEL requests.
   * Displays formatted Check-In and Check-Out dates, duration (nights), room type, and board basis.
   */
  private async sendIssuanceEmailNotification(
    event: 'TICKET_CREATED_TO_DO' | 'TICKET_MOVED_ON_HOLD' | 'TICKET_ISSUED_CONFIRMED',
    ticket: any,
    notes?: string
  ) {
    // 1. Retrieve full ticket record with associated booking & accommodations
    let fullTicket: any = ticket;
    if (ticket?.id) {
      try {
        const found = await prisma.issuanceTicket.findUnique({
          where: { id: ticket.id },
          include: {
            createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
            assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
            booking: {
              include: {
                passengers: true,
                accommodations: { include: { vendor: true } },
                flightServices: { include: { vendor: true } },
              },
            },
          },
        });
        if (found) fullTicket = found;
      } catch (err) {
        logger.warn('Failed to load full issuance ticket for email dispatch:', err);
      }
    }

    const isHotel = fullTicket.type === IssuanceType.HOTEL || String(fullTicket.type).toUpperCase() === 'HOTEL';
    const adminEmail = 'office@terrifictravel.co.uk';

    const formatEmailDate = (d: any) => {
      if (!d) return 'N/A';
      try {
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return 'N/A';
        return dt.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return 'N/A';
      }
    };

    let checkInDate = fullTicket.travelStartDate;
    let checkOutDate = fullTicket.travelEndDate;
    let hotelName = fullTicket.hotelName || '';
    let destination = fullTicket.destination || '';
    let roomCategory = fullTicket.roomCategory || '';
    let boardBasis = fullTicket.boardBasis || '';
    let hotelEmail: string | null = null;
    let guestNamesList = '';
    let guestCount = 1;

    if (isHotel) {
      // Find matching accommodation service
      let matchingAcc: any = null;
      if (fullTicket.serviceId && fullTicket.booking?.accommodations) {
        matchingAcc = fullTicket.booking.accommodations.find((a: any) => a.id === fullTicket.serviceId);
      }
      if (!matchingAcc && fullTicket.booking?.accommodations?.length > 0) {
        matchingAcc = fullTicket.booking.accommodations.find((a: any) =>
          hotelName && a.hotelName && a.hotelName.toLowerCase().trim() === hotelName.toLowerCase().trim()
        ) || fullTicket.booking.accommodations[0];
      }

      if (matchingAcc) {
        if (!checkInDate && matchingAcc.checkInDate) checkInDate = matchingAcc.checkInDate;
        if (!checkOutDate && matchingAcc.checkOutDate) checkOutDate = matchingAcc.checkOutDate;
        if (!hotelName && matchingAcc.hotelName) hotelName = matchingAcc.hotelName;
        if (!destination && matchingAcc.city) destination = matchingAcc.city;
        if (!roomCategory && matchingAcc.roomType) roomCategory = matchingAcc.roomType;
        if (!boardBasis && matchingAcc.mealType) boardBasis = matchingAcc.mealType;
        if (matchingAcc.vendor?.supportEmail?.trim()) {
          hotelEmail = matchingAcc.vendor.supportEmail.trim();
        }
      }

      // Check direct accommodationService if serviceId exists
      if (!hotelEmail && fullTicket.serviceId) {
        try {
          const directAcc = await prisma.accommodationService.findUnique({
            where: { id: fullTicket.serviceId },
            include: { vendor: true },
          });
          if (directAcc) {
            if (!checkInDate && directAcc.checkInDate) checkInDate = directAcc.checkInDate;
            if (!checkOutDate && directAcc.checkOutDate) checkOutDate = directAcc.checkOutDate;
            if (!hotelName && directAcc.hotelName) hotelName = directAcc.hotelName;
            if (!destination && directAcc.city) destination = directAcc.city;
            if (!roomCategory && directAcc.roomType) roomCategory = directAcc.roomType;
            if (!boardBasis && directAcc.mealType) boardBasis = directAcc.mealType;
            if (directAcc.vendor?.supportEmail?.trim()) {
              hotelEmail = directAcc.vendor.supportEmail.trim();
            }
          }
        } catch (e) {
          logger.warn('Failed to query direct accommodation service for hotel email:', e);
        }
      }

      // Search Vendor by hotelName if still not found
      if (!hotelEmail && hotelName) {
        try {
          const matchingVendor = await prisma.vendor.findFirst({
            where: {
              name: { contains: hotelName.trim(), mode: 'insensitive' },
              supportEmail: { not: null },
            },
          });
          if (matchingVendor?.supportEmail?.trim()) {
            hotelEmail = matchingVendor.supportEmail.trim();
          }
        } catch (e) {
          logger.warn('Failed to query vendor for hotel email:', e);
        }
      }

      // If fullTicket.guestEmail is set and contains @, check if it's a hotel contact email
      if (!hotelEmail && fullTicket.guestEmail && fullTicket.guestEmail.includes('@')) {
        const isPaxEmail = fullTicket.booking?.passengers?.some((p: any) =>
          p.email && p.email.toLowerCase().trim() === fullTicket.guestEmail.toLowerCase().trim()
        );
        if (!isPaxEmail) {
          hotelEmail = fullTicket.guestEmail.trim();
        }
      }

      // Passenger / guest list
      if (fullTicket.booking?.passengers && fullTicket.booking.passengers.length > 0) {
        guestCount = fullTicket.booking.passengers.length;
        guestNamesList = fullTicket.booking.passengers
          .map((p: any) => `${p.title ? p.title + ' ' : ''}${p.firstName || ''} ${p.lastName || ''}`.trim())
          .filter(Boolean)
          .join(', ');
      }
    }

    // Calculate total duration in nights
    let nights: number | null = null;
    if (checkInDate && checkOutDate) {
      const dIn = new Date(checkInDate);
      const dOut = new Date(checkOutDate);
      if (!isNaN(dIn.getTime()) && !isNaN(dOut.getTime())) {
        const diffDays = Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0) nights = diffDays;
      }
    }

    // Determine Recipients:
    // STRICT REQUIREMENT: Never send internal issuance emails to customer/passenger!
    // For HOTEL requests: send strictly to hotels email and admin email only.
    let toEmails: string[] = [];
    if (isHotel) {
      const recipients: string[] = [adminEmail];
      if (hotelEmail && hotelEmail.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
        recipients.push(hotelEmail.trim());
      }
      toEmails = Array.from(new Set(recipients));
    } else {
      // Flight request: sent strictly to admin desk and creator agent (never to customer/passenger)
      toEmails = [adminEmail];
      if (fullTicket.createdBy?.email && fullTicket.createdBy.email.toLowerCase() !== adminEmail.toLowerCase()) {
        toEmails.push(fullTicket.createdBy.email);
      }
      toEmails = Array.from(new Set(toEmails.filter(Boolean)));
    }

    const confirmationText = isHotel
      ? (fullTicket.hotelReservationNo || 'N/A')
      : (fullTicket.pnrTicketNumber || 'N/A');

    let subject = '';
    let htmlContent = '';

    const brandHeader = `
      <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: left; border-bottom: 3px solid ${isHotel ? '#10B981' : '#0284C7'};">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <h2 style="color: #FFFFFF; margin: 0; font-family: 'Outfit', Arial, sans-serif; font-size: 18px; font-weight: 700;">
                Terrific Travel &amp; Tours — Operations Desk
              </h2>
              <p style="color: #94A3B8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                ${isHotel ? 'Hotel Reservations &amp; Issuance Desk' : 'Flight Ticketing &amp; Issuance Desk'}
              </p>
            </td>
            <td align="right">
              <span style="display: inline-block; background-color: ${isHotel ? 'rgba(16, 185, 129, 0.2)' : 'rgba(2, 132, 199, 0.2)'}; color: ${isHotel ? '#34D399' : '#38BDF8'}; padding: 5px 12px; border-radius: 16px; font-size: 11px; font-weight: 700; border: 1px solid ${isHotel ? 'rgba(16, 185, 129, 0.4)' : 'rgba(2, 132, 199, 0.4)'}; text-transform: uppercase;">
                ${fullTicket.type} ISSUANCE
              </span>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Render Hotel Details Block
    const hotelDetailsHtml = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin: 16px 0;">
        <div style="background: #F1F5F9; padding: 10px 16px; border-bottom: 1px solid #E2E8F0; font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
          Hotel Reservation Schedule &amp; Guest Details
        </div>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; width: 34%; font-weight: 600;">Hotel Name:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">${hotelName || 'N/A'}</td>
          </tr>
          ${destination ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">City / Destination:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A;">${destination}</td>
          </tr>` : ''}
          <tr style="background-color: #ECFDF5;">
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #065F46; font-weight: 700;">Check-In Date:</td>
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #065F46; font-weight: 800; font-size: 14px;">
              ${formatEmailDate(checkInDate)}
            </td>
          </tr>
          <tr style="background-color: #FEF2F2;">
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #991B1B; font-weight: 700;">Check-Out Date:</td>
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #991B1B; font-weight: 800; font-size: 14px;">
              ${formatEmailDate(checkOutDate)}
            </td>
          </tr>
          ${nights !== null ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Total Duration:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">
              <span style="background: #E0F2FE; color: #0369A1; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px;">
                ${nights} Night${nights > 1 ? 's' : ''}
              </span>
            </td>
          </tr>` : ''}
          ${roomCategory ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Room Category:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 600;">${roomCategory}</td>
          </tr>` : ''}
          ${boardBasis ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Board Basis / Meal Plan:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A;">${boardBasis}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Agent Quoted Price:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #059669; font-weight: 800; font-size: 14px;">
              ${fullTicket.currency || 'GBP'} ${Number(fullTicket.totalCost).toFixed(2)}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Lead Guest Name:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">${fullTicket.leadGuestName}</td>
          </tr>
          ${guestNamesList ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">All Guests (${guestCount}):</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A;">${guestNamesList}</td>
          </tr>` : ''}
          ${fullTicket.bookingReference ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Booking Reference:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #D97706; font-weight: 800; font-family: monospace;">${fullTicket.bookingReference}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 16px; color: #64748B; font-weight: 600;">Ticket Number:</td>
            <td style="padding: 10px 16px; color: #0F172A; font-weight: 700; font-family: monospace;">${fullTicket.ticketNumber}</td>
          </tr>
        </table>
      </div>
    `;

    // Render Flight Details Block
    const flightDetailsHtml = `
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin: 16px 0;">
        <div style="background: #F1F5F9; padding: 10px 16px; border-bottom: 1px solid #E2E8F0; font-size: 11px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
          Flight Segment &amp; Schedule Details
        </div>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; width: 34%; font-weight: 600;">Flight Number(s):</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">${fullTicket.flightNumbers || 'N/A'}</td>
          </tr>
          ${fullTicket.routing ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Routing:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A;">${fullTicket.routing}</td>
          </tr>` : ''}
          <tr style="background-color: #F0F9FF;">
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #0369A1; font-weight: 700;">Departure Date:</td>
            <td style="padding: 11px 16px; border-bottom: 1px solid #E2E8F0; color: #0369A1; font-weight: 800; font-size: 14px;">
              ${formatEmailDate(fullTicket.travelStartDate)}
            </td>
          </tr>
          ${fullTicket.travelEndDate ? `
          <tr style="background-color: #F8FAFC;">
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Return Date:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">
              ${formatEmailDate(fullTicket.travelEndDate)}
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Lead Passenger:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-weight: 700;">${fullTicket.leadGuestName}</td>
          </tr>
          ${fullTicket.bookingReference ? `
          <tr>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #64748B; font-weight: 600;">Booking Reference:</td>
            <td style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9; color: #D97706; font-weight: 800; font-family: monospace;">${fullTicket.bookingReference}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 10px 16px; color: #64748B; font-weight: 600;">Ticket Number:</td>
            <td style="padding: 10px 16px; color: #0F172A; font-weight: 700; font-family: monospace;">${fullTicket.ticketNumber}</td>
          </tr>
        </table>
      </div>
    `;

    const detailsBlock = isHotel ? hotelDetailsHtml : flightDetailsHtml;

    if (event === 'TICKET_CREATED_TO_DO') {
      subject = isHotel
        ? `[Hotel Issuance Request] ${hotelName ? hotelName + ' - ' : ''}${fullTicket.leadGuestName} - Ticket ${fullTicket.ticketNumber} (Ref: ${fullTicket.bookingReference || 'N/A'})`
        : `[Flight Issuance Request] ${fullTicket.ticketNumber} - ${fullTicket.leadGuestName} (Ref: ${fullTicket.bookingReference || 'N/A'})`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 620px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: ${isHotel ? '#059669' : '#0284C7'}; margin-top: 0; font-size: 16px;">
              New ${isHotel ? 'Hotel Reservation &amp; Issuance' : 'Flight Issuance'} Request in Queue
            </h3>
            <p style="font-size: 13px; color: #475569; margin: 0 0 14px 0;">
              A new ${fullTicket.type} issuance request has been logged into the <strong>To Do</strong> queue for processing:
            </p>
            ${detailsBlock}
            <div style="background: #F8FAFC; border-left: 4px solid ${isHotel ? '#10B981' : '#0284C7'}; padding: 12px 16px; border-radius: 4px; margin-top: 16px;">
              <p style="margin: 0; font-size: 12px; color: #64748B;">
                <strong>Notice:</strong> Please process this reservation request and confirm reservation details.
              </p>
            </div>
            <p style="font-size: 11px; color: #94A3B8; margin: 20px 0 0 0; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px;">
              Terrific Travel Ltd &bull; Office: office@terrifictravel.co.uk &bull; Direct: 01215 291 670
            </p>
          </div>
        </div>
      `;
    } else if (event === 'TICKET_MOVED_ON_HOLD') {
      subject = isHotel
        ? `[Action Required] Hotel Ticket ${fullTicket.ticketNumber} Placed ON HOLD - ${hotelName || ''}`
        : `[Action Required] Flight Ticket ${fullTicket.ticketNumber} Placed ON HOLD`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 620px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: #D97706; margin-top: 0; font-size: 16px;">
              ${isHotel ? 'Hotel Reservation Request' : 'Issuance Ticket'} Placed On Hold
            </h3>
            <p style="font-size: 13px; color: #475569; margin: 0 0 14px 0;">
              The issuance ticket <strong>${fullTicket.ticketNumber}</strong> (${fullTicket.leadGuestName}) has been placed on hold by the operations desk.
            </p>
            <div style="background: #FFFBEB; border-left: 4px solid #F59E0B; padding: 14px 16px; margin: 16px 0; font-size: 13px; color: #92400E; border-radius: 4px;">
              <strong>Clarification Needed:</strong><br/>
              ${notes || fullTicket.holdReason || 'Missing guest details, room confirmation, or schedule clarification required.'}
            </div>
            ${detailsBlock}
            <p style="font-size: 12px; color: #64748B; margin-top: 14px;">
              Please review and reply to this email or update the booking directly.
            </p>
            <p style="font-size: 11px; color: #94A3B8; margin: 20px 0 0 0; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px;">
              Terrific Travel Ltd &bull; Office: office@terrifictravel.co.uk &bull; Direct: 01215 291 670
            </p>
          </div>
        </div>
      `;
    } else if (event === 'TICKET_ISSUED_CONFIRMED') {
      subject = isHotel
        ? `[Booking Confirmed] Hotel Finalized: ${hotelName || 'Hotel'} - ${fullTicket.leadGuestName} (Conf #${confirmationText})`
        : `[Booking Confirmed] Flight Finalized: ${fullTicket.ticketNumber} - PNR: ${confirmationText}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 620px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background-color: #FFFFFF;">
          ${brandHeader}
          <div style="padding: 24px;">
            <h3 style="color: #059669; margin-top: 0; font-size: 16px;">
              ${isHotel ? 'Hotel Reservation Confirmed &amp; Finalized' : 'Flight Ticket Issued &amp; Confirmed'}
            </h3>
            <p style="font-size: 13px; color: #475569; margin: 0 0 14px 0;">
              The operations desk has finalized the ${fullTicket.type} reservation for <strong>${fullTicket.leadGuestName}</strong>:
            </p>
            <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 6px; padding: 14px 16px; margin: 14px 0;">
              <p style="font-size: 15px; font-weight: bold; color: #065F46; margin: 0 0 4px 0;">
                ${isHotel ? 'Hotel Confirmation / Res No:' : 'PNR / Ticket Number:'} ${confirmationText}
              </p>
              <p style="margin: 0; font-size: 12px; color: #047857;">
                ${isHotel ? 'Agent Quoted Price' : 'Total Cost'}: <strong>${fullTicket.currency || 'GBP'} ${Number(fullTicket.totalCost).toFixed(2)}</strong> | Status: Finalized &amp; Locked
              </p>
            </div>
            ${detailsBlock}
            <p style="font-size: 12px; color: #64748B; margin-top: 14px;">
              This reservation record is now locked in the TMS system.
            </p>
            <p style="font-size: 11px; color: #94A3B8; margin: 20px 0 0 0; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px;">
              Terrific Travel Ltd &bull; Office: office@terrifictravel.co.uk &bull; Direct: 01215 291 670
            </p>
          </div>
        </div>
      `;
    }

    try {
      if (toEmails.length === 0) {
        toEmails = [adminEmail];
      }
      await (emailService as any).transporter.sendMail({
        from: config.smtp.from || 'office@terrifictravel.co.uk',
        to: toEmails.join(', '),
        subject,
        html: htmlContent,
      });
      logger.info(`Dispatched issuance notification email for ticket ${fullTicket.ticketNumber} (${event}) to: ${toEmails.join(', ')}`);
    } catch (err) {
      logger.warn(`Could not send issuance notification email (${event}):`, err);
    }
  }
}

export const issuanceService = new IssuanceService();

import { prisma, logger } from '../config';
import { rabbitMQService } from './rabbitmq.service';
import { BookingStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '../middleware/error.middleware';
import { emailService } from './email.service';
import { randomUUID } from 'crypto';
import { minioService } from './minio.service';
import { vendorsService } from './vendors.service';
import { auditLogService } from './audit.service';

export class BookingsService {
  async create(userId: string, data: any) {
    // Generate sequential bookingReference (e.g. TT1101)
    const lastBooking = await prisma.booking.findFirst({
      where: {
        bookingReference: {
          startsWith: 'TT',
        },
      },
      orderBy: {
        bookingReference: 'desc',
      },
      select: {
        bookingReference: true,
      },
    });

    let nextRef = 'TT1101';
    if (lastBooking && lastBooking.bookingReference) {
      const numStr = lastBooking.bookingReference.replace('TT', '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        nextRef = `TT${num + 1}`;
      }
    }

    const booking = await prisma.booking.create({
      data: {
        bookingReference: nextRef,
        userId,
        createdById: userId,
        assignedToId: data.assignedToId || userId,
        totalPrice: Number(data.totalPrice) || 0,
        status: data.status || BookingStatus.PENDING,
        agentId: data.agentId || null,
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        paidAmount: Number(data.paidAmount) || 0,
        refundAmount: Number(data.refundAmount) || 0,
        cardPaymentCharges: Number(data.cardPaymentCharges) || 0,
        cancellationCharges: Number(data.cancellationCharges) || 0,
        remainingAmount: Math.max(0, (Number(data.totalPrice) || 0) - (Number(data.paidAmount) || 0)),
        paymentStatus: data.paymentStatus || 'UNPAID',
        lockedStatus: data.lockedStatus || 'UNLOCKED',
        
        // Handle optional old bookingItems logic if provided
        ...(Array.isArray(data.items) && data.items.length > 0 ? {
          bookingItems: {
            create: data.items.map((item: any) => ({
              itemType: item.itemType,
              price: Number(item.price),
              flightId: item.flightId,
              roomId: item.roomId,
              tourId: item.tourId,
              details: item.details || {},
            })),
          }
        } : {}),

        // New CRM relations
        ...(Array.isArray(data.transactions) && data.transactions.length > 0 ? {
          transactions: {
            create: data.transactions.map((tx: any) => ({
              amount: Number(tx.amount),
              paymentMethod: tx.paymentMethod,
              paidOn: tx.paidOn ? new Date(tx.paidOn) : new Date(),
              notes: tx.notes,
            })),
          }
        } : {}),

        ...(Array.isArray(data.passengers) && data.passengers.length > 0 ? {
          passengers: {
            create: data.passengers.map((p: any, idx: number) => ({
              title: p.title,
              firstName: p.firstName,
              lastName: p.lastName,
              age: p.age,
              email: p.email,
              phoneNumber: p.phoneNumber,
              passportExpiryDate: p.passportExpiryDate ? new Date(p.passportExpiryDate) : null,
              agentId: p.agentId || null,
              role: idx === 0 ? 'Leader' : (p.role || 'Passenger'),
            })),
          }
        } : {}),



        ...(Array.isArray(data.accommodations) && data.accommodations.length > 0 ? {
          accommodations: {
            create: data.accommodations.map((acc: any) => ({
              vendorId: acc.vendorId,
              hotelName: acc.hotelName,
              roomType: acc.roomType,
              checkInDate: new Date(acc.checkInDate),
              checkOutDate: new Date(acc.checkOutDate),
              checkInTime: acc.checkInTime !== undefined ? acc.checkInTime : "16:00",
              checkOutTime: acc.checkOutTime !== undefined ? acc.checkOutTime : "12:00",
              city: acc.city || null,
              mealType: acc.mealType,
              reservationNumber: acc.reservationNumber,
              qty: Number(acc.qty) || 1,
              price: Number(acc.price),
              currency: acc.currency,
              otherCurrency: acc.otherCurrency,
              conversionRate: acc.conversionRate ? Number(acc.conversionRate) : null,
              issueDate: acc.issueDate ? new Date(acc.issueDate) : null,
              refundAmount: Number(acc.refundAmount) || 0,
              fineAmount: Number(acc.fineAmount) || 0,
              hotelConfirmationNumber: acc.hotelConfirmationNumber,
              hotelAddress: acc.hotelAddress,
            })),
          }
        } : {}),

        ...(Array.isArray(data.flightServices) && data.flightServices.length > 0 ? {
          flightServices: {
            create: data.flightServices.map((fs: any) => ({
              date: new Date(fs.date),
              vendorId: fs.vendorId,
              flightNo: fs.flightNo,
              pnr: fs.pnr,
              departedFrom: fs.departedFrom,
              arrivedAt: fs.arrivedAt,
              departTime: fs.departTime,
              arrivalTime: fs.arrivalTime,
              price: Number(fs.price),
              currency: fs.currency,
              issueDate: fs.issueDate ? new Date(fs.issueDate) : null,
              refundAmount: Number(fs.refundAmount) || 0,
              fineAmount: Number(fs.fineAmount) || 0,
              baggage: fs.baggage,
              carryOnBaggage: fs.carryOnBaggage,
              checkedBaggage: fs.checkedBaggage,
              flightClass: fs.flightClass,
            })),
          }
        } : {}),

        ...(Array.isArray(data.transportServices) && data.transportServices.length > 0 ? {
          transportServices: {
            create: data.transportServices.map((ts: any) => ({
              vendorId: ts.vendorId,
              vehicleType: ts.vehicleType,
              departureDestination: ts.departureDestination,
              arrivalDestination: ts.arrivalDestination,
              date: new Date(ts.date),
              departureTime: ts.departureTime,
              arrivalTime: ts.arrivalTime,
              flightNo: ts.flightNo,
              price: Number(ts.price),
              currency: ts.currency,
              otherCurrency: ts.otherCurrency,
              conversionRate: ts.conversionRate ? Number(ts.conversionRate) : null,
              issueDate: ts.issueDate ? new Date(ts.issueDate) : null,
              refundAmount: Number(ts.refundAmount) || 0,
              fineAmount: Number(ts.fineAmount) || 0,
            })),
          }
        } : {}),

        ...(Array.isArray(data.visaServices) && data.visaServices.length > 0 ? {
          visaServices: {
            create: data.visaServices.map((vs: any) => ({
              vendorId: vs.vendorId,
              passportNumber: vs.passportNumber,
              visaType: vs.visaType,
              visaNumber: vs.visaNumber,
              issueDate: vs.issueDate ? new Date(vs.issueDate) : null,
              expiryDate: vs.expiryDate ? new Date(vs.expiryDate) : null,
              price: Number(vs.price),
              currency: vs.currency,
              otherCurrency: vs.otherCurrency,
              conversionRate: vs.conversionRate ? Number(vs.conversionRate) : null,
              refundAmount: Number(vs.refundAmount) || 0,
              fineAmount: Number(vs.fineAmount) || 0,
            })),
          }
        } : {}),
      },
      include: {
        bookingItems: true,
        transactions: true,
        passengers: true,
        bookingVendorPayments: { include: { vendor: true } },
        vendorPaymentAllocations: { include: { vendorPayment: { include: { createdBy: true } } } },
        accommodations: true,
        flightServices: true,
        transportServices: true,
        visaServices: true,
      },
    });

    await vendorsService.syncBookingVendorPayments(booking.id);

    await rabbitMQService.publish('booking.created', {
      bookingId: booking.id,
      userId,
      totalPrice: booking.totalPrice,
    });

    // Write structured audit log
    await auditLogService.log({
      userId,
      action: 'Create',
      module: 'Bookings',
      recordId: booking.id,
      newValue: booking,
    });

    return booking;
  }
  async findAll(user: any, query: any) {
    const limit = Number(query.limit) || 1000;
    const offset = Number(query.offset) || 0;
    const where: any = {};
    
    const isOperator = user.roles.some((role: string) => 
      ['SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT', 'Admin', 'Manager', 'Agent'].includes(role)
    );
    if (!isOperator) {
      where.userId = user.id;
    }

    // 1. ID Filter
    if (query.id) {
      if (query.idOp === 'equals') {
        where.id = query.id;
      } else {
        where.id = { contains: query.id, mode: 'insensitive' };
      }
    }

    // 2. Booking Date Range (createdAt) - supports both dateFrom/dateTo and createdAtFrom/createdAtTo
    const createdAtFrom = query.dateFrom || query.createdAtFrom;
    const createdAtTo = query.dateTo || query.createdAtTo;
    if (createdAtFrom || createdAtTo) {
      where.createdAt = {};
      if (createdAtFrom) {
        where.createdAt.gte = new Date(createdAtFrom);
      }
      if (createdAtTo) {
        const toDate = new Date(createdAtTo);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    // 3. Departure Date Range (departureDate)
    if (query.departureDateFrom || query.departureDateTo) {
      where.departureDate = {};
      if (query.departureDateFrom) {
        where.departureDate.gte = new Date(query.departureDateFrom);
      }
      if (query.departureDateTo) {
        const toDate = new Date(query.departureDateTo);
        toDate.setHours(23, 59, 59, 999);
        where.departureDate.lte = toDate;
      }
    }

    // 4. Booking Reference Filter
    if (query.bookingReference) {
      if (query.bookingReferenceOp === 'equals') {
        where.bookingReference = { equals: query.bookingReference, mode: 'insensitive' };
      } else {
        where.bookingReference = { contains: query.bookingReference, mode: 'insensitive' };
      }
    }

    // 5. Agent Filter
    if (query.agentId && query.agentId !== 'Any') {
      where.agentId = query.agentId;
    }

    // 6. Status Filters
    if (query.status && query.status !== 'Any') {
      where.status = query.status;
    }
    if (query.lockedStatus && query.lockedStatus !== 'Any') {
      where.lockedStatus = query.lockedStatus;
    }
    if (query.paymentStatus && query.paymentStatus !== 'Any') {
      where.paymentStatus = query.paymentStatus;
    }

    // 7. Customer Name, Email, and Phone Filters
    const andFilters: any[] = [];

    if (query.customerName) {
      const nameTerm = query.customerName.trim();
      andFilters.push({
        OR: [
          // Match passenger firstName
          {
            passengers: {
              some: {
                firstName: { contains: nameTerm, mode: 'insensitive' }
              }
            }
          },
          // Match passenger lastName
          {
            passengers: {
              some: {
                lastName: { contains: nameTerm, mode: 'insensitive' }
              }
            }
          },
          // Match booking creator (user) firstName
          {
            user: {
              firstName: { contains: nameTerm, mode: 'insensitive' }
            }
          },
          // Match booking creator (user) lastName
          {
            user: {
              lastName: { contains: nameTerm, mode: 'insensitive' }
            }
          },
        ]
      });
    }

    if (query.customerEmail) {
      andFilters.push({
        OR: [
          {
            passengers: {
              some: {
                email: { contains: query.customerEmail, mode: 'insensitive' }
              }
            }
          },
          {
            user: {
              email: { contains: query.customerEmail, mode: 'insensitive' }
            }
          }
        ]
      });
    }

    if (query.customerPhone) {
      andFilters.push({
        OR: [
          {
            passengers: {
              some: {
                phoneNumber: { contains: query.customerPhone, mode: 'insensitive' }
              }
            }
          }
        ]
      });
    }

    if (andFilters.length > 0) {
      where.AND = andFilters;
    }
    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          bookingItems: {
            include: {
              flight: { include: { airline: true } },
              room: { include: { hotel: true } },
              tour: { include: { destination: true } },
            },
          },
          payments: true,
          invoices: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          agent: { include: { slabs: { orderBy: { minSales: 'asc' } } } },
          transactions: true,
          passengers: { include: { agent: true } },
          bookingVendorPayments: { include: { vendor: true } },
          vendorPaymentAllocations: { include: { vendorPayment: { include: { createdBy: true } } } },
          accommodations: { include: { vendor: true } },
          flightServices: { include: { vendor: true } },
          transportServices: { include: { vendor: true } },
          visaServices: { include: { vendor: true } },
          additionalServices: { include: { vendor: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    for (const item of items) {
      if (item.passengers && item.passengers.length > 0) {
        item.passengers.sort((a, b) => {
          if (a.role === 'Leader' && b.role !== 'Leader') return -1;
          if (a.role !== 'Leader' && b.role === 'Leader') return 1;
          return a.id.localeCompare(b.id);
        });
      }
    }

    return { total, limit, offset, items };
  }

  async findOne(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingItems: {
          include: {
            flight: { include: { airline: true } },
            room: { include: { hotel: true } },
            tour: { include: { destination: true } },
          },
        },
        payments: true,
        invoices: true,
        agent: { include: { slabs: { orderBy: { minSales: 'asc' } } } },
        transactions: true,
        passengers: { include: { agent: true, documents: true } },
        bookingVendorPayments: { include: { vendor: true } },
        vendorPaymentAllocations: { include: { vendorPayment: { include: { createdBy: true } } } },
        accommodations: { include: { vendor: true } },
        flightServices: { include: { vendor: true } },
        transportServices: { include: { vendor: true } },
        visaServices: { include: { vendor: true } },
        additionalServices: { include: { vendor: true } },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.passengers && booking.passengers.length > 0) {
      booking.passengers.sort((a, b) => {
        if (a.role === 'Leader' && b.role !== 'Leader') return -1;
        if (a.role !== 'Leader' && b.role === 'Leader') return 1;
        return a.id.localeCompare(b.id);
      });
    }

    return booking;
  }

  async updateBookingDetails(id: string, data: { totalPrice?: number; agentId?: string | null; departureDate?: string | null }, actorId?: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const updateData: any = {};

    if (data.totalPrice !== undefined && data.totalPrice !== null) {
      const newTotal = Number(data.totalPrice);
      if (isNaN(newTotal) || newTotal < 0) {
        throw new BadRequestException('Invalid total price value');
      }
      updateData.totalPrice = newTotal;
      // Recalculate remaining amount based on what has already been paid
      const paidAmount = booking.paidAmount || 0;
      updateData.remainingAmount = Math.max(0, newTotal - paidAmount);
    }

    if (data.agentId !== undefined) {
      updateData.agentId = data.agentId || null;
    }

    if (data.departureDate !== undefined) {
      updateData.departureDate = data.departureDate ? new Date(data.departureDate) : null;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    await rabbitMQService.publish('booking.updated', {
      bookingId: updated.id,
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Bookings',
      recordId: id,
      oldValue: booking,
      newValue: updated,
    });

    return updated;
  }

  async updateStatus(id: string, status: BookingStatus, actorId?: string) {
    const bookingBefore = await prisma.booking.findUnique({ where: { id } });
    if (!bookingBefore) throw new NotFoundException('Booking not found');

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
      status: booking.status,
    });

    await auditLogService.log({
      userId: actorId || null,
      action: status === BookingStatus.CANCELLED ? 'Archive' : 'Update',
      module: 'Bookings',
      recordId: id,
      oldValue: bookingBefore,
      newValue: booking,
    });

    return booking;
  }

  async toggleLock(id: string, actorId?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const nextStatus = booking.lockedStatus === 'LOCKED' ? 'UNLOCKED' : 'LOCKED';

    const updated = await prisma.booking.update({
      where: { id },
      data: { lockedStatus: nextStatus },
    });

    await rabbitMQService.publish('booking.updated', {
      bookingId: updated.id,
      lockedStatus: updated.lockedStatus,
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Bookings',
      recordId: id,
      oldValue: booking,
      newValue: updated,
    });

    return updated;
  }

  async delete(id: string, actorId?: string) {
    const bookingBefore = await prisma.booking.findUnique({ where: { id } });
    if (!bookingBefore) throw new NotFoundException('Booking not found');

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });

    await rabbitMQService.publish('booking.cancelled', {
      bookingId: booking.id,
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Archive',
      module: 'Bookings',
      recordId: id,
      oldValue: bookingBefore,
      newValue: booking,
    });

    return { success: true };
  }

  async finalizeMargin(bookingId: string, agentId: string) {
    // 1. Fetch booking with its cost-affecting relations
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        accommodations: true,
        flightServices: true,
        transportServices: true,
        visaServices: true,
        additionalServices: true,
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.agentId) {
      throw new BadRequestException('Margin has already been finalized for this booking');
    }

    // 2. Fetch agent with slabs
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        slabs: {
          orderBy: { minSales: 'asc' },
        },
      },
    });
    if (!agent) throw new NotFoundException('Agent not found');

    // 3. Compute raw profit and potential commission rate based on slabs matching the booking's totalPrice
    const price = booking.totalPrice;
    
    const accommodationsCost = booking.accommodations?.reduce((sum, item) => sum + item.price, 0) || 0;
    const flightsCost = booking.flightServices?.reduce((sum, item) => sum + item.price, 0) || 0;
    const transportsCost = booking.transportServices?.reduce((sum, item) => sum + item.price, 0) || 0;
    const visasCost = booking.visaServices?.reduce((sum, item) => sum + item.price, 0) || 0;
    const additionalCost = booking.additionalServices?.reduce((sum, item) => sum + item.servicePrice, 0) || 0;
    
    const totalVendorCost = accommodationsCost + flightsCost + transportsCost + visasCost + additionalCost;
    const rawProfit = price - totalVendorCost;

    let slab = agent.slabs.find(
      (s) => price >= s.minSales && (s.maxSales === null || price <= s.maxSales)
    );
    if (!slab && agent.slabs.length > 0) {
      const highestSlab = agent.slabs.reduce((prev, current) => (prev.minSales > current.minSales) ? prev : current);
      if (price > highestSlab.minSales) {
        slab = highestSlab;
      }
    }
    const rate = slab ? slab.commissionRate : 0.0;
    const potentialMargin = rawProfit * (rate / 100.0);

    // Apply rule: if raw profit <= 0 or if deducting commission would make profit negative, then commission is 0
    let margin = 0.0;
    if (rawProfit > 0) {
      if (rawProfit - potentialMargin <= 0) {
        margin = 0.0;
      } else {
        margin = potentialMargin;
      }
    }

    // 4. Update booking and agent in a transaction
    const [updatedBooking, updatedAgent] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { agentId },
      }),
      prisma.agent.update({
        where: { id: agentId },
        data: {
          walletBalance: {
            increment: margin,
          },
        },
      }),
    ]);

    return {
      booking: updatedBooking,
      agent: updatedAgent,
      calculatedMargin: margin,
      commissionRate: rate,
    };
  }

  async addFlightService(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const flight = await prisma.flightService.create({
      data: {
        bookingId,
        date: new Date(data.date),
        vendorId: data.vendorId,
        flightNo: data.flightNo,
        pnr: data.pnr,
        departedFrom: data.departedFrom,
        arrivedAt: data.arrivedAt,
        departTime: data.departTime,
        arrivalTime: data.arrivalTime,
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        flightClass: data.flightClass || null,
        baggage: data.baggage || null,
        carryOnBaggage: data.carryOnBaggage || null,
        checkedBaggage: data.checkedBaggage || null,
        notes: data.notes || null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return flight;
  }

  async updateFlightService(bookingId: string, flightServiceId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const flight = await prisma.flightService.update({
      where: { id: flightServiceId, bookingId },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        vendorId: data.vendorId !== undefined ? data.vendorId : undefined,
        flightNo: data.flightNo !== undefined ? data.flightNo : undefined,
        pnr: data.pnr !== undefined ? data.pnr : undefined,
        departedFrom: data.departedFrom !== undefined ? data.departedFrom : undefined,
        arrivedAt: data.arrivedAt !== undefined ? data.arrivedAt : undefined,
        departTime: data.departTime !== undefined ? data.departTime : undefined,
        arrivalTime: data.arrivalTime !== undefined ? data.arrivalTime : undefined,
        price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        flightClass: data.flightClass !== undefined ? data.flightClass : undefined,
        baggage: data.baggage !== undefined ? data.baggage : undefined,
        carryOnBaggage: data.carryOnBaggage !== undefined ? data.carryOnBaggage : undefined,
        checkedBaggage: data.checkedBaggage !== undefined ? data.checkedBaggage : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return flight;
  }

  async deleteFlightService(bookingId: string, flightServiceId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await prisma.flightService.delete({
      where: { id: flightServiceId, bookingId }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true };
  }

  async addAccommodationService(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const accommodation = await prisma.accommodationService.create({
      data: {
        bookingId,
        vendorId: data.vendorId,
        hotelName: data.hotelName,
        roomType: data.roomType,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        checkInTime: data.checkInTime !== undefined ? data.checkInTime : "16:00",
        checkOutTime: data.checkOutTime !== undefined ? data.checkOutTime : "12:00",
        city: data.city || null,
        mealType: data.mealType,
        reservationNumber: data.reservationNumber || null,
        qty: Number(data.qty) || 1,
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        otherCurrency: data.otherCurrency || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
        hotelConfirmationNumber: data.hotelConfirmationNumber || null,
        hotelAddress: data.hotelAddress || null,
        lastCancellationDate: data.lastCancellationDate ? new Date(data.lastCancellationDate) : null,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return accommodation;
  }

  async updateAccommodationService(bookingId: string, accommodationId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const accommodation = await prisma.accommodationService.update({
      where: { id: accommodationId, bookingId },
      data: {
        vendorId: data.vendorId !== undefined ? data.vendorId : undefined,
        hotelName: data.hotelName !== undefined ? data.hotelName : undefined,
        roomType: data.roomType !== undefined ? data.roomType : undefined,
        checkInDate: data.checkInDate !== undefined ? new Date(data.checkInDate) : undefined,
        checkOutDate: data.checkOutDate !== undefined ? new Date(data.checkOutDate) : undefined,
        checkInTime: data.checkInTime !== undefined ? data.checkInTime : undefined,
        checkOutTime: data.checkOutTime !== undefined ? data.checkOutTime : undefined,
        city: data.city !== undefined ? data.city : undefined,
        mealType: data.mealType !== undefined ? data.mealType : undefined,
        reservationNumber: data.reservationNumber !== undefined ? data.reservationNumber : undefined,
        qty: data.qty !== undefined ? (Number(data.qty) || 1) : undefined,
        price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        otherCurrency: data.otherCurrency !== undefined ? data.otherCurrency : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
        hotelConfirmationNumber: data.hotelConfirmationNumber !== undefined ? data.hotelConfirmationNumber : undefined,
        hotelAddress: data.hotelAddress !== undefined ? data.hotelAddress : undefined,
        lastCancellationDate: data.lastCancellationDate !== undefined ? (data.lastCancellationDate ? new Date(data.lastCancellationDate) : null) : undefined,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return accommodation;
  }

  async deleteAccommodationService(bookingId: string, accommodationId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await prisma.accommodationService.delete({
      where: { id: accommodationId, bookingId }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true };
  }

  async addTransportService(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const transport = await prisma.transportService.create({
      data: {
        bookingId,
        vendorId: data.vendorId,
        vehicleType: data.vehicleType,
        departureDestination: data.departureDestination,
        arrivalDestination: data.arrivalDestination,
        date: new Date(data.date),
        departureTime: data.departureTime || '',
        arrivalTime: data.arrivalTime || '',
        flightNo: data.flightNo || null,
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        otherCurrency: data.otherCurrency || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return transport;
  }

  async updateTransportService(bookingId: string, transportServiceId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const transport = await prisma.transportService.update({
      where: { id: transportServiceId, bookingId },
      data: {
        vendorId: data.vendorId !== undefined ? data.vendorId : undefined,
        vehicleType: data.vehicleType !== undefined ? data.vehicleType : undefined,
        departureDestination: data.departureDestination !== undefined ? data.departureDestination : undefined,
        arrivalDestination: data.arrivalDestination !== undefined ? data.arrivalDestination : undefined,
        date: data.date !== undefined ? new Date(data.date) : undefined,
        departureTime: data.departureTime !== undefined ? data.departureTime : undefined,
        arrivalTime: data.arrivalTime !== undefined ? data.arrivalTime : undefined,
        flightNo: data.flightNo !== undefined ? data.flightNo : undefined,
        price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        otherCurrency: data.otherCurrency !== undefined ? data.otherCurrency : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return transport;
  }

  async deleteTransportService(bookingId: string, transportServiceId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await prisma.transportService.delete({
      where: { id: transportServiceId, bookingId }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true };
  }

  // ─── Passenger helpers ──────────────────────────────────────────────────────

  private deriveAgeCategory(dateOfBirth: Date | null | undefined): string {
    if (!dateOfBirth) return 'Adult';
    const today = new Date();
    let years = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) years--;
    if (years < 2)  return 'Infant';
    if (years < 13) return 'Child';
    if (years < 15) return 'Youth';
    return 'Adult';
  }

  async addPassenger(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { passengers: true }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    const age = this.deriveAgeCategory(dob);

    const isFirst = (booking.passengers || []).length === 0;

    const passenger = await prisma.passenger.create({
      data: {
        bookingId,
        title:              data.title || 'Mr',
        firstName:          data.firstName,
        lastName:           data.lastName,
        dateOfBirth:        dob,
        age,
        email:              data.email || null,
        phoneNumber:        data.phoneNumber || null,
        nationality:        data.nationality || null,
        passportNumber:     data.passportNumber || null,
        passportExpiryDate: data.passportExpiryDate ? new Date(data.passportExpiryDate) : null,
        passportIssuingCountry: data.passportIssuingCountry || null,
        agentId:            data.agentId || null,
        role:               isFirst ? 'Leader' : (data.role || 'Passenger'),
        collectPassport:    data.collectPassport !== undefined ? Boolean(data.collectPassport) : true,
        collectAdditional:  data.collectAdditional !== undefined ? Boolean(data.collectAdditional) : false,
      },
      include: { agent: true },
    });
    return passenger;
  }

  async updatePassenger(bookingId: string, passengerId: string, data: any) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const dob = data.dateOfBirth !== undefined
      ? (data.dateOfBirth ? new Date(data.dateOfBirth) : null)
      : undefined;
    const age = dob !== undefined ? this.deriveAgeCategory(dob) : undefined;

    const passenger = await prisma.passenger.update({
      where:  { id: passengerId, bookingId },
      data: {
        title:              data.title              !== undefined ? data.title              : undefined,
        firstName:          data.firstName          !== undefined ? data.firstName          : undefined,
        lastName:           data.lastName           !== undefined ? data.lastName           : undefined,
        dateOfBirth:        dob,
        age:                age,
        email:              data.email              !== undefined ? data.email              : undefined,
        phoneNumber:        data.phoneNumber        !== undefined ? data.phoneNumber        : undefined,
        nationality:        data.nationality        !== undefined ? data.nationality        : undefined,
        passportNumber:     data.passportNumber     !== undefined ? data.passportNumber     : undefined,
        passportExpiryDate: data.passportExpiryDate !== undefined
          ? (data.passportExpiryDate ? new Date(data.passportExpiryDate) : null)
          : undefined,
        passportIssuingCountry: data.passportIssuingCountry !== undefined ? data.passportIssuingCountry : undefined,
        agentId:            data.agentId            !== undefined ? data.agentId            : undefined,
        role:               data.role               !== undefined ? data.role               : undefined,
        collectPassport:    data.collectPassport    !== undefined ? Boolean(data.collectPassport) : undefined,
        collectAdditional:  data.collectAdditional  !== undefined ? Boolean(data.collectAdditional) : undefined,
      },
      include: { agent: true },
    });
    return passenger;
  }

  async deletePassenger(bookingId: string, passengerId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    await prisma.passenger.delete({ where: { id: passengerId, bookingId } });
    return { success: true };
  }

  // ─── Admin passport scan (authenticated) ────────────────────────────────────

  async adminUploadPassportScan(bookingId: string, passengerId: string, file: any) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== bookingId) throw new NotFoundException('Passenger not found');
    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMime.includes(file.mimetype)) throw new BadRequestException('MIME type not allowed. Please upload JPEG, PNG, or PDF.');
    if (file.size > 5 * 1024 * 1024) throw new BadRequestException('File size exceeds 5MB limit');

    if (passenger.passportScanKey) {
      try { await minioService.deleteFile('documents', passenger.passportScanKey); } catch {}
    }

    const key = `passport-${passengerId}-${Date.now()}-${file.originalname}`;
    await minioService.uploadFile('documents', key, file.buffer, file.size, file.mimetype);

    const updated = await prisma.passenger.update({
      where: { id: passengerId },
      data: { passportScanKey: key },
    });
    return { passengerId: updated.id, passportScanKey: key };
  }

  async adminGetPassportScan(bookingId: string, passengerId: string) {
    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== bookingId) throw new NotFoundException('Passenger not found');
    if (!passenger.passportScanKey) throw new NotFoundException('No passport scan uploaded');
    return { bucket: 'documents', key: passenger.passportScanKey };
  }

  async adminDeletePassportScan(bookingId: string, passengerId: string) {
    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== bookingId) throw new NotFoundException('Passenger not found');
    if (passenger.passportScanKey) {
      try { await minioService.deleteFile('documents', passenger.passportScanKey); } catch {}
    }
    await prisma.passenger.update({ where: { id: passengerId }, data: { passportScanKey: null } });
    return { success: true };
  }

  // ─── Admin additional documents (authenticated) ──────────────────────────────

  async adminAddPassengerDocument(bookingId: string, passengerId: string, title: string, description?: string, file?: any) {
    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== bookingId) throw new NotFoundException('Passenger not found');
    if (!title || title.trim() === '') throw new BadRequestException('Document title is required');

    let fileKey: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedMime.includes(file.mimetype)) throw new BadRequestException('MIME type not allowed.');
      if (file.size > 5 * 1024 * 1024) throw new BadRequestException('File size exceeds 5MB limit');
      fileKey = `additional-${passengerId}-${Date.now()}-${file.originalname}`;
      fileName = file.originalname;
      await minioService.uploadFile('documents', fileKey, file.buffer, file.size, file.mimetype);
    }

    const document = await prisma.passengerDocument.create({
      data: { passengerId, title: title.trim(), description: description ? description.trim() : null, fileKey, fileName },
    });
    return document;
  }

  async adminGetPassengerDocumentFile(bookingId: string, documentId: string) {
    const document = await prisma.passengerDocument.findUnique({ where: { id: documentId }, include: { passenger: true } });
    if (!document || document.passenger.bookingId !== bookingId) throw new NotFoundException('Document not found');
    if (!document.fileKey) throw new NotFoundException('No file for this document');
    return { bucket: 'documents', key: document.fileKey };
  }

  async adminDeletePassengerDocument(bookingId: string, documentId: string) {
    const document = await prisma.passengerDocument.findUnique({ where: { id: documentId }, include: { passenger: true } });
    if (!document || document.passenger.bookingId !== bookingId) throw new NotFoundException('Document not found');
    if (document.fileKey) {
      try { await minioService.deleteFile('documents', document.fileKey); } catch {}
    }
    await prisma.passengerDocument.delete({ where: { id: documentId } });
    return { success: true };
  }

  /** Public — no auth. Lookup passenger by formToken. */
  async getPassengerByToken(token: string) {
    const passenger = await prisma.passenger.findUnique({
      where: { formToken: token },
      include: { documents: true }
    });
    if (!passenger) throw new NotFoundException('Form link is invalid or has expired');

    const booking = await prisma.booking.findUnique({
      where: { id: passenger.bookingId },
      include: {
        passengers: {
          orderBy: { id: 'asc' },
          include: { documents: true }
        },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.passengers && booking.passengers.length > 0) {
      booking.passengers.sort((a, b) => {
        if (a.role === 'Leader' && b.role !== 'Leader') return -1;
        if (a.role !== 'Leader' && b.role === 'Leader') return 1;
        return a.id.localeCompare(b.id);
      });
    }

    return {
      passenger,
      booking: {
        bookingReference: booking.bookingReference,
        departureDate: booking.departureDate,
      },
      passengers: booking.passengers,
    };
  }

  /** Public — no auth. Customer submits details (single or multiple) via formToken. */
  async submitPassengerForm(token: string, data: any) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    if (data.passengers && Array.isArray(data.passengers)) {
      const updatedPassengers = [];
      for (const pData of data.passengers) {
        if (!pData.id) continue;
        const dbPassenger = await prisma.passenger.findUnique({ where: { id: pData.id } });
        if (!dbPassenger || dbPassenger.bookingId !== tokenPassenger.bookingId) {
          continue; // security check: must belong to the same booking
        }
        const dob = pData.dateOfBirth ? new Date(pData.dateOfBirth) : dbPassenger.dateOfBirth;
        const age = this.deriveAgeCategory(dob);

        const updated = await prisma.passenger.update({
          where: { id: pData.id },
          data: {
            title:                  pData.title              !== undefined ? pData.title              : dbPassenger.title,
            firstName:              pData.firstName          !== undefined ? pData.firstName          : dbPassenger.firstName,
            lastName:               pData.lastName           !== undefined ? pData.lastName           : dbPassenger.lastName,
            dateOfBirth:            pData.dateOfBirth        !== undefined ? (pData.dateOfBirth ? new Date(pData.dateOfBirth) : null) : dbPassenger.dateOfBirth,
            age,
            email:                  pData.email              !== undefined ? pData.email              : dbPassenger.email,
            phoneNumber:            pData.phoneNumber        !== undefined ? pData.phoneNumber        : dbPassenger.phoneNumber,
            nationality:            pData.nationality        !== undefined ? pData.nationality        : dbPassenger.nationality,
            passportNumber:         pData.passportNumber     !== undefined ? pData.passportNumber     : dbPassenger.passportNumber,
            passportExpiryDate:     pData.passportExpiryDate !== undefined ? (pData.passportExpiryDate ? new Date(pData.passportExpiryDate) : null) : dbPassenger.passportExpiryDate,
            passportIssuingCountry: pData.passportIssuingCountry !== undefined ? pData.passportIssuingCountry : dbPassenger.passportIssuingCountry,
            formSubmittedAt:        new Date(),
          },
        });
        updatedPassengers.push(updated);
      }
      return updatedPassengers;
    }

    // Fallback: single passenger submit (backwards compatibility)
    const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : tokenPassenger.dateOfBirth;
    const age = this.deriveAgeCategory(dob);

    return prisma.passenger.update({
      where: { formToken: token },
      data: {
        title:              data.title              || tokenPassenger.title,
        firstName:          data.firstName          || tokenPassenger.firstName,
        lastName:           data.lastName           || tokenPassenger.lastName,
        dateOfBirth:        dob,
        age,
        email:              data.email              || tokenPassenger.email,
        phoneNumber:        data.phoneNumber        || tokenPassenger.phoneNumber,
        nationality:        data.nationality        || tokenPassenger.nationality,
        passportNumber:     data.passportNumber     || tokenPassenger.passportNumber,
        passportExpiryDate: data.passportExpiryDate ? new Date(data.passportExpiryDate) : tokenPassenger.passportExpiryDate,
        passportIssuingCountry: data.passportIssuingCountry || tokenPassenger.passportIssuingCountry,
        formSubmittedAt: new Date(),
      },
    });
  }

  async addPassengerByFormToken(token: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.create({
      data: {
        bookingId: tokenPassenger.bookingId,
        title: 'Mr',
        firstName: '',
        lastName: '',
        role: 'Passenger',
        age: 'Adult',
        collectPassport: tokenPassenger.collectPassport,
        collectAdditional: tokenPassenger.collectAdditional,
      },
      include: {
        documents: true
      }
    });

    return passenger;
  }

  async deletePassengerByFormToken(token: string, passengerId: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Passenger not found in this booking');
    }

    if (passenger.role === 'Leader') {
      throw new BadRequestException('The lead passenger cannot be removed from the booking');
    }

    await prisma.passenger.delete({ where: { id: passengerId } });

    return { success: true };
  }

  /** Send email link to specific passenger */
  async sendPassengerLink(bookingId: string, passengerId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { passengers: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const passenger = booking.passengers.find((p) => p.id === passengerId);
    if (!passenger) throw new NotFoundException('Passenger not found');
    if (passenger.role !== 'Leader') {
      throw new BadRequestException('Request links can only be sent to the Lead Passenger');
    }
    if (!passenger.email) throw new BadRequestException('Passenger email is required to send link');

    let token = passenger.formToken;
    if (!token) {
      token = randomUUID();
      await prisma.passenger.update({
        where: { id: passenger.id },
        data: { formToken: token },
      });
    }

    const otherPassengers = booking.passengers.filter((p) => p.id !== passengerId);

    await emailService.sendPassengerFormLink(
      passenger.email,
      `${passenger.firstName} ${passenger.lastName}`,
      booking.bookingReference,
      token,
      otherPassengers
    );

    return { success: true };
  }

  async uploadPassengerPassportScan(token: string, passengerId: string, file: any) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Passenger not found in this booking');
    }

    if (!file) throw new BadRequestException('No file uploaded');

    const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMime.includes(file.mimetype)) {
      throw new BadRequestException('MIME type not allowed. Please upload JPEG, PNG, or PDF.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    // Delete old file if exists
    if (passenger.passportScanKey) {
      try {
        await minioService.deleteFile('documents', passenger.passportScanKey);
      } catch (err) {
        logger.error('Failed to delete old passport scan:', err);
      }
    }

    const key = `passport-${passengerId}-${Date.now()}-${file.originalname}`;
    const fileUrl = await minioService.uploadFile(
      'documents',
      key,
      file.buffer,
      file.size,
      file.mimetype
    );

    const updated = await prisma.passenger.update({
      where: { id: passengerId },
      data: {
        passportScanKey: key,
      },
    });

    return {
      passengerId: updated.id,
      passportScanKey: key,
      url: fileUrl,
    };
  }

  async getPassengerPassportScan(token: string, passengerId: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Passenger not found in this booking');
    }

    if (!passenger.passportScanKey) {
      throw new NotFoundException('No passport scan uploaded for this passenger');
    }

    return { bucket: 'documents', key: passenger.passportScanKey };
  }

  async deletePassengerPassportScan(token: string, passengerId: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Passenger not found in this booking');
    }

    if (passenger.passportScanKey) {
      try {
        await minioService.deleteFile('documents', passenger.passportScanKey);
      } catch (err) {
        logger.error('Failed to delete passport scan file from MinIO:', err);
      }
    }

    await prisma.passenger.update({
      where: { id: passengerId },
      data: { passportScanKey: null },
    });

    return { success: true };
  }

  async addPassengerDocument(token: string, passengerId: string, title: string, description?: string, file?: any) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const passenger = await prisma.passenger.findUnique({ where: { id: passengerId } });
    if (!passenger || passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Passenger not found in this booking');
    }

    if (!title || title.trim() === '') {
      throw new BadRequestException('Document title is required');
    }

    let fileKey: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const allowedMime = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedMime.includes(file.mimetype)) {
        throw new BadRequestException('MIME type not allowed. Please upload JPEG, PNG, or PDF.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 5MB limit');
      }

      fileKey = `additional-${passengerId}-${Date.now()}-${file.originalname}`;
      fileName = file.originalname;

      await minioService.uploadFile(
        'documents',
        fileKey,
        file.buffer,
        file.size,
        file.mimetype
      );
    }

    const document = await prisma.passengerDocument.create({
      data: {
        passengerId,
        title: title.trim(),
        description: description ? description.trim() : null,
        fileKey,
        fileName,
      },
    });

    return document;
  }

  async getPassengerDocumentFile(token: string, documentId: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const document = await prisma.passengerDocument.findUnique({
      where: { id: documentId },
      include: { passenger: true },
    });

    if (!document || document.passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Document not found in this booking');
    }

    if (!document.fileKey) {
      throw new NotFoundException('No file uploaded for this document');
    }

    return { bucket: 'documents', key: document.fileKey };
  }

  async deletePassengerDocument(token: string, documentId: string) {
    const tokenPassenger = await prisma.passenger.findUnique({ where: { formToken: token } });
    if (!tokenPassenger) throw new NotFoundException('Form link is invalid or has expired');

    const document = await prisma.passengerDocument.findUnique({
      where: { id: documentId },
      include: { passenger: true },
    });

    if (!document || document.passenger.bookingId !== tokenPassenger.bookingId) {
      throw new NotFoundException('Document not found in this booking');
    }

    if (document.fileKey) {
      try {
        await minioService.deleteFile('documents', document.fileKey);
      } catch (err) {
        logger.error('Failed to delete document file from MinIO:', err);
      }
    }

    await prisma.passengerDocument.delete({
      where: { id: documentId },
    });

    return { success: true };
  }

  async addVisaService(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const visa = await prisma.visaService.create({
      data: {
        bookingId,
        vendorId: data.vendorId,
        passportNumber: data.passportNumber,
        visaType: data.visaType,
        visaNumber: data.visaNumber || '',
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        otherCurrency: data.otherCurrency || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return visa;
  }

  async updateVisaService(bookingId: string, visaServiceId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const visa = await prisma.visaService.update({
      where: { id: visaServiceId, bookingId },
      data: {
        vendorId: data.vendorId !== undefined ? data.vendorId : undefined,
        passportNumber: data.passportNumber !== undefined ? data.passportNumber : undefined,
        visaType: data.visaType !== undefined ? data.visaType : undefined,
        visaNumber: data.visaNumber !== undefined ? data.visaNumber : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        expiryDate: data.expiryDate !== undefined ? (data.expiryDate ? new Date(data.expiryDate) : null) : undefined,
        price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        otherCurrency: data.otherCurrency !== undefined ? data.otherCurrency : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return visa;
  }

  async deleteVisaService(bookingId: string, visaServiceId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await prisma.visaService.delete({
      where: { id: visaServiceId, bookingId }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true };
  }

  async searchAllPassengers(query: string) {
    const q = query.trim();
    if (!q) return [];
    return prisma.passenger.findMany({
      where: {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { passportNumber: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        title: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        nationality: true,
        passportNumber: true,
        passportExpiryDate: true,
        passportIssuingCountry: true,
      },
    });
  }

  async addAdditionalService(bookingId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    let vendorId = data.vendorId || null;
    if (!vendorId && data.customVendorName) {
      const customName = data.customVendorName.trim();
      let customVendor = await prisma.vendor.findFirst({
        where: { name: { equals: customName, mode: 'insensitive' } }
      });
      if (!customVendor) {
        customVendor = await prisma.vendor.create({
          data: {
            name: customName,
            vendorType: 'Custom / Other',
            phoneNumber: 'N/A',
          }
        });
      }
      vendorId = customVendor.id;
    }

    const service = await prisma.additionalService.create({
      data: {
        bookingId,
        vendorId,
        customVendorName: null,
        serviceName: data.serviceName,
        servicePrice: Number(data.servicePrice) || 0,
        serviceDescription: data.serviceDescription || null,
      },
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return service;
  }

  async updateAdditionalService(bookingId: string, serviceId: string, data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    let vendorId = data.vendorId;
    if (data.customVendorName) {
      const customName = data.customVendorName.trim();
      let customVendor = await prisma.vendor.findFirst({
        where: { name: { equals: customName, mode: 'insensitive' } }
      });
      if (!customVendor) {
        customVendor = await prisma.vendor.create({
          data: {
            name: customName,
            vendorType: 'Custom / Other',
            phoneNumber: 'N/A',
          }
        });
      }
      vendorId = customVendor.id;
    }

    const updateData: any = {};
    if (vendorId !== undefined) {
      updateData.vendorId = vendorId;
      updateData.customVendorName = null;
    }
    if (data.serviceName !== undefined) updateData.serviceName = data.serviceName;
    if (data.servicePrice !== undefined) updateData.servicePrice = Number(data.servicePrice) || 0;
    if (data.serviceDescription !== undefined) updateData.serviceDescription = data.serviceDescription;

    const service = await prisma.additionalService.update({
      where: { id: serviceId, bookingId },
      data: updateData,
      include: {
        vendor: true
      }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return service;
  }

  async deleteAdditionalService(bookingId: string, serviceId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await prisma.additionalService.delete({
      where: { id: serviceId, bookingId }
    });

    await vendorsService.syncBookingVendorPayments(booking.id);
    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true };
  }
}

export const bookingsService = new BookingsService();


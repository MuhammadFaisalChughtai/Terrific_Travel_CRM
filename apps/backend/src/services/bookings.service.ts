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
  async getNextReference() {
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

    let nextRef = 'TT00964';
    if (lastBooking && lastBooking.bookingReference) {
      const numStr = lastBooking.bookingReference.replace('TT', '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        nextRef = `TT${String(num + 1).padStart(5, '0')}`;
      }
    }
    return { nextReference: nextRef };
  }

  async create(userId: string, data: any) {
    const nextRefObj = await this.getNextReference();
    let finalRef = nextRefObj.nextReference;

    if (data.bookingReference) {
      const customRef = data.bookingReference.trim();
      const existing = await prisma.booking.findUnique({
        where: { bookingReference: customRef },
      });
      if (existing) {
        throw new BadRequestException(`Booking reference "${customRef}" is already in use.`);
      }
      finalRef = customRef;
    }

    const booking = await prisma.booking.create({
      data: {
        bookingReference: finalRef,
        userId,
        createdById: userId,
        assignedToId: data.assignedToId || userId,
        totalPrice: Number(data.totalPrice) || 0,
        status: data.status || BookingStatus.PENDING,
        agentId: data.agentId || null,
        bookingDate: data.bookingDate ? new Date(data.bookingDate) : new Date(),
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        paidAmount: Number(data.paidAmount) || 0,
        refundAmount: Number(data.refundAmount) || 0,
        cardPaymentCharges: Number(data.cardPaymentCharges) || 0,
        cancellationCharges: Number(data.cancellationCharges) || 0,
        remainingAmount: Math.max(0, (Number(data.totalPrice) || 0) - (Number(data.refundAmount) || 0) - (Number(data.paidAmount) || 0)),
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
              otherCurrency: acc.otherCurrencyAmount ? String(acc.otherCurrencyAmount) : (acc.otherCurrency || null),
              otherCurrencyAmount: acc.otherCurrencyAmount ? Number(acc.otherCurrencyAmount) : null,
              otherCurrencyType: acc.otherCurrencyType || null,
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
              otherCurrency: ts.otherCurrencyAmount ? String(ts.otherCurrencyAmount) : (ts.otherCurrency || null),
              otherCurrencyAmount: ts.otherCurrencyAmount ? Number(ts.otherCurrencyAmount) : null,
              otherCurrencyType: ts.otherCurrencyType || null,
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
              otherCurrency: vs.otherCurrencyAmount ? String(vs.otherCurrencyAmount) : (vs.otherCurrency || null),
              otherCurrencyAmount: vs.otherCurrencyAmount ? Number(vs.otherCurrencyAmount) : null,
              otherCurrencyType: vs.otherCurrencyType || null,
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
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE "Booking"
        SET "bookingDate" = "createdAt"
        WHERE "bookingDate" IS NULL
      `);
    } catch (err) {
      // Ignore database connection/lock/permission issues
    }

    const limit = Number(query.limit) || 1000;
    const offset = Number(query.offset) || 0;
    const where: any = {};

    const sortBy = query.sortBy || 'bookingDate';
    const sortOrder = query.sortOrder || 'desc';

    let orderField: any = { createdAt: 'desc' };
    if (sortBy === 'bookingDate') {
      orderField = [
        { bookingDate: sortOrder },
        { createdAt: sortOrder }
      ];
    } else if (sortBy === 'departureDate' || sortBy === 'travelDate') {
      orderField = { departureDate: sortOrder };
    } else if (sortBy === 'paymentStatus') {
      orderField = { paymentStatus: sortOrder };
    } else if (sortBy === 'status') {
      orderField = { status: sortOrder };
    }
    
    const isAdmin = user.roles.some((role: string) => 
      ['SUPER_ADMIN', 'ADMIN', 'Admin'].includes(role)
    );
    const isManager = user.roles.some((role: string) => 
      ['Manager'].includes(role)
    );
    const isAgent = user.roles.some((role: string) => 
      ['Agent', 'TRAVEL_AGENT'].includes(role)
    );

    if (query.upcoming === 'true') {
      where.lockedStatus = { not: 'LOCKED' };
      if (isAdmin) {
        // Admins see all, no restriction
      } else if (isManager) {
        // Managers see their own + sub-agents' bookings
        if (user.agentId) {
          where.OR = [
            { agentId: user.agentId },
            { createdById: user.id }
          ];
        } else {
          where.createdById = user.id;
        }
      } else if (isAgent) {
        // Agents only see their own bookings
        if (user.agentId) {
          where.OR = [
            { agentId: user.agentId },
            { createdById: user.id }
          ];
        } else {
          where.createdById = user.id;
        }
      } else {
        // Customers/others see their own bookings
        where.userId = user.id;
      }

      const items = await prisma.booking.findMany({
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
          agentMargin: true,
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
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const computedItems = items.map((booking: any) => {
        let nearestUpcomingDate: Date | null = null;
        let nextServiceType: string | null = null;

        if (booking.flightServices) {
          for (const fs of booking.flightServices) {
            if (fs.date) {
              const d = new Date(fs.date);
              d.setHours(0, 0, 0, 0);
              if (d >= today) {
                if (!nearestUpcomingDate || d < nearestUpcomingDate) {
                  nearestUpcomingDate = d;
                  nextServiceType = 'Flight Departure';
                }
              }
            }
          }
        }

        if (booking.accommodations) {
          for (const acc of booking.accommodations) {
            if (acc.checkInDate) {
              const d = new Date(acc.checkInDate);
              d.setHours(0, 0, 0, 0);
              if (d >= today) {
                if (!nearestUpcomingDate || d < nearestUpcomingDate) {
                  nearestUpcomingDate = d;
                  nextServiceType = 'Hotel Check-in';
                }
              }
            }
          }
        }

        if (booking.transportServices && booking.transportServices.length > 0) {
          const sortedTransports = [...booking.transportServices].sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          for (let i = 0; i < sortedTransports.length; i++) {
            const ts = sortedTransports[i];
            if (ts.date) {
              const d = new Date(ts.date);
              d.setHours(0, 0, 0, 0);
              if (d >= today) {
                if (!nearestUpcomingDate || d < nearestUpcomingDate) {
                  nearestUpcomingDate = d;
                  nextServiceType = i === 0 ? 'Transport Pickup' : 'Transport Drop-off';
                }
              }
            }
          }
        }

        if (booking.passengers && booking.passengers.length > 0) {
          booking.passengers.sort((a: any, b: any) => {
            if (a.role === 'Leader' && b.role !== 'Leader') return -1;
            if (a.role !== 'Leader' && b.role === 'Leader') return 1;
            return a.id.localeCompare(b.id);
          });
        }

        let daysLeft: number | null = null;
        let priority = 'NORMAL';

        if (nearestUpcomingDate) {
          const diffTime = nearestUpcomingDate.getTime() - today.getTime();
          daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (daysLeft <= 5) {
            priority = 'HIGH';
          } else if (daysLeft <= 10) {
            priority = 'MEDIUM';
          } else {
            priority = 'NORMAL';
          }
        }

        return {
          ...booking,
          nearestUpcomingDate,
          nextServiceType,
          daysLeft,
          priority,
        };
      });

      let filteredItems = computedItems;
      if (query.search) {
        const s = query.search.toLowerCase().trim();
        filteredItems = filteredItems.filter((booking: any) => {
          if (booking.bookingReference?.toLowerCase().includes(s)) return true;
          if (booking.passengers?.some((p: any) => 
            p.firstName?.toLowerCase().includes(s) || 
            p.lastName?.toLowerCase().includes(s)
          )) return true;
          if (booking.flightServices?.some((f: any) => f.pnr?.toLowerCase().includes(s))) return true;
          if (booking.flightServices?.some((f: any) => f.flightNo?.toLowerCase().includes(s))) return true;
          if (booking.transportServices?.some((t: any) => t.flightNo?.toLowerCase().includes(s))) return true;
          return false;
        });
      }

      if (query.priority && query.priority !== 'ALL') {
        const p = query.priority.toUpperCase().trim();
        filteredItems = filteredItems.filter((booking: any) => booking.priority === p);
      }

      filteredItems.sort((a: any, b: any) => {
        const pA = a.priority === 'HIGH' ? 1 : a.priority === 'MEDIUM' ? 2 : 3;
        const pB = b.priority === 'HIGH' ? 1 : b.priority === 'MEDIUM' ? 2 : 3;
        if (pA !== pB) return pA - pB;
        
        if (a.nearestUpcomingDate && b.nearestUpcomingDate) {
          return a.nearestUpcomingDate.getTime() - b.nearestUpcomingDate.getTime();
        }
        if (a.nearestUpcomingDate) return -1;
        if (b.nearestUpcomingDate) return 1;
        return 0;
      });

      const total = filteredItems.length;
      const paginatedItems = filteredItems.slice(offset, offset + limit);

      return { total, limit, offset, items: paginatedItems };
    }

    // Apply role-based visibility boundaries using variables declared at top of method
    if (!isAdmin && !isManager && !isAgent) {
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
        where.createdAt.gte = new Date(`${createdAtFrom}T00:00:00.000Z`);
      }
      if (createdAtTo) {
        where.createdAt.lte = new Date(`${createdAtTo}T23:59:59.999Z`);
      }
    }

    // 3. Departure Date Range (departureDate)
    if (query.departureDateFrom || query.departureDateTo) {
      where.departureDate = {};
      if (query.departureDateFrom) {
        where.departureDate.gte = new Date(`${query.departureDateFrom}T00:00:00.000Z`);
      }
      if (query.departureDateTo) {
        where.departureDate.lte = new Date(`${query.departureDateTo}T23:59:59.999Z`);
      }
    }

    const andFilters: any[] = [];

    // 4. Booking Reference Filter (supports single or multi-reference bulk search)
    if (query.bookingReference) {
      const refTokens = query.bookingReference.split(/[\s,\n\r\t]+/).map((t: string) => t.trim()).filter(Boolean);
      if (refTokens.length > 1) {
        andFilters.push({
          OR: refTokens.map((t: string) => ({
            bookingReference: { contains: t, mode: 'insensitive' as const }
          }))
        });
      } else if (refTokens.length === 1) {
        if (query.bookingReferenceOp === 'equals') {
          where.bookingReference = { equals: refTokens[0], mode: 'insensitive' };
        } else {
          where.bookingReference = { contains: refTokens[0], mode: 'insensitive' };
        }
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
    if (query.customerName) {
      const nameTerm = query.customerName.trim();
      const parts = nameTerm.split(/\s+/).filter(Boolean);
      if (parts.length > 1) {
        andFilters.push({
          OR: [
            {
              passengers: {
                some: {
                  AND: parts.map((part: string) => ({
                    OR: [
                      { firstName: { contains: part, mode: 'insensitive' } },
                      { lastName: { contains: part, mode: 'insensitive' } }
                    ]
                  }))
                }
              }
            },
            {
              user: {
                AND: parts.map((part: string) => ({
                  OR: [
                    { firstName: { contains: part, mode: 'insensitive' } },
                    { lastName: { contains: part, mode: 'insensitive' } }
                  ]
                }))
              }
            }
          ]
        });
      } else {
        andFilters.push({
          OR: [
            { passengers: { some: { firstName: { contains: nameTerm, mode: 'insensitive' } } } },
            { passengers: { some: { lastName: { contains: nameTerm, mode: 'insensitive' } } } },
            { user: { firstName: { contains: nameTerm, mode: 'insensitive' } } },
            { user: { lastName: { contains: nameTerm, mode: 'insensitive' } } },
          ]
        });
      }
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

    // 7. General Search Term (supports bulk booking references as well as name/email search)
    if (query.search) {
      const searchTerm = query.search.trim();
      const parts = searchTerm.split(/[\s,\n\r\t]+/).map((t: string) => t.trim()).filter(Boolean);
      if (parts.length > 1) {
        andFilters.push({
          OR: [
            { bookingReference: { contains: searchTerm, mode: 'insensitive' } },
            // Match any individual booking reference token for bulk pastes
            ...parts.map((part: string) => ({
              bookingReference: { contains: part, mode: 'insensitive' as const }
            })),
            {
              passengers: {
                some: {
                  AND: parts.map((part: string) => ({
                    OR: [
                      { firstName: { contains: part, mode: 'insensitive' } },
                      { lastName: { contains: part, mode: 'insensitive' } }
                    ]
                  }))
                }
              }
            },
            {
              user: {
                AND: parts.map((part: string) => ({
                  OR: [
                    { firstName: { contains: part, mode: 'insensitive' } },
                    { lastName: { contains: part, mode: 'insensitive' } }
                  ]
                }))
              }
            }
          ]
        });
      } else if (parts.length === 1) {
        andFilters.push({
          OR: [
            { bookingReference: { contains: parts[0], mode: 'insensitive' } },
            { user: { firstName: { contains: parts[0], mode: 'insensitive' } } },
            { user: { lastName: { contains: parts[0], mode: 'insensitive' } } },
            { user: { email: { contains: parts[0], mode: 'insensitive' } } },
            { passengers: { some: { firstName: { contains: parts[0], mode: 'insensitive' } } } },
            { passengers: { some: { lastName: { contains: parts[0], mode: 'insensitive' } } } },
          ]
        });
      }
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
          agentMargin: true,
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
        orderBy: orderField,
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

      if (item.transactions && item.transactions.length > 0) {
        const clientPaidSum = item.transactions.reduce((sum: number, t: any) => {
          const notesLower = (t.notes || '').toLowerCase();
          if (notesLower.includes('vendor payment')) return sum;
          return sum + (t.amount || 0);
        }, 0);

        if (clientPaidSum > 0 && Math.abs(clientPaidSum - (item.paidAmount || 0)) > 0.01) {
          const newRemaining = Math.max(0, Math.round(((item.totalPrice || 0) - clientPaidSum) * 100) / 100);
          let newStatus = item.paymentStatus;
          if (newRemaining <= 0) {
            newStatus = 'PAID';
          } else {
            newStatus = 'PARTIALLY_PAID';
          }

          item.paidAmount = clientPaidSum;
          item.remainingAmount = newRemaining;
          item.paymentStatus = newStatus;

          prisma.booking.update({
            where: { id: item.id },
            data: {
              paidAmount: clientPaidSum,
              remainingAmount: newRemaining,
              paymentStatus: newStatus,
              ...(newRemaining <= 0 ? { fullyPaidAt: item.fullyPaidAt || new Date() } : {})
            }
          }).catch((err: any) => logger.error("Error auto-syncing booking paidAmount in findAll:", err));
        }
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
        agentMargin: true,
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

    if (booking.transactions && booking.transactions.length > 0) {
      const clientPaidSum = booking.transactions.reduce((sum, t) => {
        const notesLower = (t.notes || '').toLowerCase();
        if (notesLower.includes('vendor payment')) return sum;
        return sum + (t.amount || 0);
      }, 0);

      if (clientPaidSum > 0 && Math.abs(clientPaidSum - (booking.paidAmount || 0)) > 0.01) {
        const newRemaining = Math.max(0, Math.round(((booking.totalPrice || 0) - clientPaidSum) * 100) / 100);
        let newStatus = booking.paymentStatus;
        if (newRemaining <= 0) {
          newStatus = 'PAID';
        } else {
          newStatus = 'PARTIALLY_PAID';
        }

        booking.paidAmount = clientPaidSum;
        booking.remainingAmount = newRemaining;
        booking.paymentStatus = newStatus;

        prisma.booking.update({
          where: { id: booking.id },
          data: {
            paidAmount: clientPaidSum,
            remainingAmount: newRemaining,
            paymentStatus: newStatus,
            ...(newRemaining <= 0 ? { fullyPaidAt: booking.fullyPaidAt || new Date() } : {})
          }
        }).catch(err => logger.error("Error auto-syncing booking paidAmount:", err));
      }
    }

    return booking;
  }

  async updateBookingDetails(
    id: string,
    data: {
      totalPrice?: number;
      paidAmount?: number;
      remainingAmount?: number;
      agentId?: string | null;
      bookingDate?: string | null;
      departureDate?: string | null;
      leadPassengerName?: string | null;
    },
    actorId?: string
  ) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    const updateData: any = {};

    if (data.totalPrice !== undefined && data.totalPrice !== null) {
      const newTotal = Number(data.totalPrice);
      if (isNaN(newTotal) || newTotal < 0) {
        throw new BadRequestException('Invalid total price value');
      }
      updateData.totalPrice = newTotal;
    }

    if (data.agentId !== undefined) {
      updateData.agentId = data.agentId || null;
    }

    if (data.bookingDate !== undefined) {
      updateData.bookingDate = data.bookingDate ? new Date(data.bookingDate) : null;
    }

    if (data.departureDate !== undefined) {
      updateData.departureDate = data.departureDate ? new Date(data.departureDate) : null;
    }

    const activeTotal = updateData.totalPrice !== undefined ? Math.round(updateData.totalPrice * 100) / 100 : (booking.totalPrice || 0);

    let finalPaidAmount = booking.paidAmount ? Math.round(booking.paidAmount * 100) / 100 : 0;
    let finalRemainingAmount = booking.remainingAmount ? Math.round(booking.remainingAmount * 100) / 100 : 0;

    if (data.paidAmount !== undefined && data.paidAmount !== null) {
      finalPaidAmount = Math.max(0, Math.round(Number(data.paidAmount) * 100) / 100);
      updateData.paidAmount = finalPaidAmount;
      if (data.remainingAmount !== undefined && data.remainingAmount !== null) {
        finalRemainingAmount = Math.max(0, Math.round(Number(data.remainingAmount) * 100) / 100);
        updateData.remainingAmount = finalRemainingAmount;
      } else {
        finalRemainingAmount = Math.max(0, Math.round((activeTotal - finalPaidAmount) * 100) / 100);
        updateData.remainingAmount = finalRemainingAmount;
      }
    } else if (data.remainingAmount !== undefined && data.remainingAmount !== null) {
      finalRemainingAmount = Math.max(0, Math.round(Number(data.remainingAmount) * 100) / 100);
      updateData.remainingAmount = finalRemainingAmount;
      finalPaidAmount = Math.max(0, Math.round((activeTotal - finalRemainingAmount) * 100) / 100);
      updateData.paidAmount = finalPaidAmount;
    } else {
      finalRemainingAmount = Math.max(0, Math.round((activeTotal - finalPaidAmount) * 100) / 100);
      updateData.remainingAmount = finalRemainingAmount;
    }

    // Recalculate payment status
    if (finalRemainingAmount <= 0 && finalPaidAmount > 0) {
      updateData.paymentStatus = 'PAID';
      updateData.fullyPaidAt = booking.fullyPaidAt || new Date();
    } else if (finalPaidAmount > 0) {
      updateData.paymentStatus = 'PARTIALLY_PAID';
      updateData.fullyPaidAt = null;
    } else {
      updateData.paymentStatus = 'UNPAID';
      updateData.fullyPaidAt = null;
    }

    // Update Lead Passenger Name if provided
    if (data.leadPassengerName !== undefined && data.leadPassengerName !== null) {
      const trimmed = data.leadPassengerName.trim();
      if (trimmed.length > 0) {
        const nameParts = trimmed.split(' ');
        const firstName = nameParts[0] || 'Client';
        const lastName = nameParts.slice(1).join(' ') || '';

        const leaderPax = await prisma.passenger.findFirst({
          where: { bookingId: id, role: 'Leader' }
        });

        if (leaderPax) {
          await prisma.passenger.update({
            where: { id: leaderPax.id },
            data: { firstName, lastName }
          });
        } else {
          await prisma.passenger.create({
            data: {
              bookingId: id,
              title: 'Mr',
              firstName,
              lastName,
              age: 'Adult',
              role: 'Leader'
            }
          });
        }
      }
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

    await vendorsService.syncBookingVendorPayments(booking.id);

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
        bookingVendorPayments: true,
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
    
    let totalVendorCost = 0;
    if (booking.bookingVendorPayments && booking.bookingVendorPayments.length > 0) {
      totalVendorCost = booking.bookingVendorPayments.reduce((sum, item) => sum + (item.originalCost || 0), 0);
    } else {
      const accommodationsCost = booking.accommodations?.reduce((sum, item) => sum + item.price, 0) || 0;
      const flightsCost = booking.flightServices?.reduce((sum, item) => sum + item.price, 0) || 0;
      const transportsCost = booking.transportServices?.reduce((sum, item) => sum + item.price, 0) || 0;
      const visasCost = booking.visaServices?.reduce((sum, item) => sum + item.price, 0) || 0;
      const additionalCost = booking.additionalServices?.reduce((sum, item) => sum + item.servicePrice, 0) || 0;
      totalVendorCost = accommodationsCost + flightsCost + transportsCost + visasCost + additionalCost;
    }
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
        personalItem: data.personalItem || null,
        notes: data.notes || null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
        status: data.status || "CONFIRMED",
        agentQuotedPrice: data.agentQuotedPrice !== undefined && data.agentQuotedPrice !== null ? (Number(data.agentQuotedPrice) || null) : null,
        confirmationNumber: data.confirmationNumber || null,
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
        personalItem: data.personalItem !== undefined ? data.personalItem : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        agentQuotedPrice: data.agentQuotedPrice !== undefined ? (data.agentQuotedPrice !== null ? Number(data.agentQuotedPrice) : null) : undefined,
        confirmationNumber: data.confirmationNumber !== undefined ? data.confirmationNumber : undefined,
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
        otherCurrency: data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : (data.otherCurrency || null),
        otherCurrencyAmount: data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null,
        otherCurrencyType: data.otherCurrencyType || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
        hotelConfirmationNumber: data.hotelConfirmationNumber || null,
        hotelAddress: data.hotelAddress || null,
        lastCancellationDate: data.lastCancellationDate ? new Date(data.lastCancellationDate) : null,
        agentQuotedPrice: data.agentQuotedPrice !== undefined && data.agentQuotedPrice !== null ? (Number(data.agentQuotedPrice) || null) : null,
        confirmationNumber: data.confirmationNumber || null,
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
        otherCurrency: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : null) : (data.otherCurrency !== undefined ? data.otherCurrency : undefined),
        otherCurrencyAmount: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null) : undefined,
        otherCurrencyType: data.otherCurrencyType !== undefined ? data.otherCurrencyType : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
        hotelConfirmationNumber: data.hotelConfirmationNumber !== undefined ? data.hotelConfirmationNumber : undefined,
        hotelAddress: data.hotelAddress !== undefined ? data.hotelAddress : undefined,
        lastCancellationDate: data.lastCancellationDate !== undefined ? (data.lastCancellationDate ? new Date(data.lastCancellationDate) : null) : undefined,
        agentQuotedPrice: data.agentQuotedPrice !== undefined ? (data.agentQuotedPrice !== null ? Number(data.agentQuotedPrice) : null) : undefined,
        confirmationNumber: data.confirmationNumber !== undefined ? data.confirmationNumber : undefined,
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
        passengerId: data.passengerId || null,
        passengerName: data.passengerName || null,
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        otherCurrency: data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : (data.otherCurrency || null),
        otherCurrencyAmount: data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null,
        otherCurrencyType: data.otherCurrencyType || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
        agentQuotedPrice: data.agentQuotedPrice !== undefined && data.agentQuotedPrice !== null ? (Number(data.agentQuotedPrice) || null) : null,
        confirmationNumber: data.confirmationNumber || null,
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
        passengerId: data.passengerId !== undefined ? data.passengerId : undefined,
        passengerName: data.passengerName !== undefined ? data.passengerName : undefined,
        price: data.price !== undefined ? (Number(data.price) || 0) : undefined,
        currency: data.currency !== undefined ? data.currency : undefined,
        otherCurrency: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : null) : (data.otherCurrency !== undefined ? data.otherCurrency : undefined),
        otherCurrencyAmount: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null) : undefined,
        otherCurrencyType: data.otherCurrencyType !== undefined ? data.otherCurrencyType : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        issueDate: data.issueDate !== undefined ? (data.issueDate ? new Date(data.issueDate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
        agentQuotedPrice: data.agentQuotedPrice !== undefined ? (data.agentQuotedPrice !== null ? Number(data.agentQuotedPrice) : null) : undefined,
        confirmationNumber: data.confirmationNumber !== undefined ? data.confirmationNumber : undefined,
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
        eticket:            data.eticket || null,
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
        eticket:            data.eticket            !== undefined ? data.eticket            : undefined,
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

  /** Send official flight ticket order email directly to office and ticketing team */
  async sendTicketOrder(
    bookingId: string,
    options: { customNotes?: string; pdfBase64?: string; pnr?: string; flightIds?: string[]; gdsText?: string },
    actorUser?: any
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        passengers: true,
        flightServices: {
          include: { vendor: true },
          orderBy: { date: 'asc' },
        },
        agent: true,
        createdBy: true,
        transactions: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!booking.flightServices || booking.flightServices.length === 0) {
      throw new BadRequestException('No flight segments registered in this booking to send a ticket order.');
    }

    // Determine flights to send based on selected PNR scope
    let flightsToSend = booking.flightServices;
    const isGroup = !options.pnr || options.pnr.trim().toUpperCase() === 'ALL';
    let targetPnrScope = 'GROUP';

    if (!isGroup && options.pnr) {
      const cleanPnr = options.pnr.trim().toUpperCase();
      targetPnrScope = cleanPnr;
      flightsToSend = flightsToSend.filter((fs: any) => {
        const raw = (fs.pnr || '').trim().toUpperCase();
        return raw === cleanPnr || raw.split(/[,;\s]+/).map((s: string) => s.trim()).includes(cleanPnr);
      });
      if (flightsToSend.length === 0) {
        throw new BadRequestException(`No flight segments found for PNR "${options.pnr}".`);
      }
    } else if (options.flightIds && options.flightIds.length > 0) {
      flightsToSend = flightsToSend.filter((fs: any) => options.flightIds!.includes(fs.id));
      if (flightsToSend.length === 0) {
        throw new BadRequestException('No matching flight segments found.');
      }
    }

    // Enforce that all passengers have passport scans uploaded
    const passengers = booking.passengers || [];
    if (passengers.length === 0) {
      throw new BadRequestException('No passengers registered in this booking to issue ticket order.');
    }

    const missingPassports = passengers.filter((p: any) => !p.passportScanKey || !p.passportScanKey.trim());
    if (missingPassports.length > 0) {
      const missingNames = missingPassports
        .map((p: any) => `${p.title ? p.title + ' ' : ''}${p.firstName || ''} ${p.lastName || ''}`.trim() || `Passenger #${p.id}`)
        .join(', ');
      throw new BadRequestException(
        `Upload passport to send the ticket order. Missing passport scan for: ${missingNames}`
      );
    }

    // Retrieve passenger passport scans from MinIO documents bucket
    const passportAttachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (p.passportScanKey) {
        try {
          const buffer = await minioService.getObjectBuffer('documents', p.passportScanKey);
          const match = p.passportScanKey.match(/\.([a-zA-Z0-9]+)$/);
          const ext = match ? match[1].toLowerCase() : 'jpg';
          let contentType = 'image/jpeg';
          if (ext === 'png') contentType = 'image/png';
          else if (ext === 'pdf') contentType = 'application/pdf';
          else if (ext === 'webp') contentType = 'image/webp';

          const paxName = `${p.firstName || 'Pax'}_${p.lastName || i + 1}`.replace(/[^a-zA-Z0-9_-]/g, '_');
          passportAttachments.push({
            filename: `Passport_${paxName}.${ext}`,
            content: buffer,
            contentType,
          });
        } catch (minioErr) {
          logger.error(`Failed to retrieve passport scan for passenger ${p.id} (${p.passportScanKey}):`, minioErr);
          throw new BadRequestException(
            `Failed to retrieve uploaded passport file for passenger ${p.firstName || ''} ${p.lastName || ''}. Please re-upload the passport scan.`
          );
        }
      }
    }

    // Fetch full actor user info to populate logged-in agent signature
    let actorUserFull: any = actorUser;
    if (actorUser?.id) {
      try {
        actorUserFull = await (prisma as any).user.findUnique({
          where: { id: actorUser.id },
          include: {
            agent: true,
            userRoles: { include: { role: true } },
          },
        }) || actorUser;
      } catch (err) {
        logger.warn('Failed to load full actorUser for sendTicketOrder:', err);
      }
    }

    const actorRole = actorUserFull?.userRoles?.[0]?.role?.name || actorUserFull?.role || 'Agent';
    const actorName = (actorUserFull?.firstName || actorUserFull?.lastName)
      ? `${actorUserFull.firstName || ''} ${actorUserFull.lastName || ''}`.trim()
      : (actorUserFull?.name || 'Agent');
    const actorEmail = actorUserFull?.email || actorUserFull?.agent?.payrollEmail || actorUserFull?.agent?.email || null;
    const actorPhone = (actorUserFull as any)?.phoneNumber || actorUserFull?.agent?.phoneNumber || null;

    const actorDetails = {
      name: actorName,
      role: actorRole,
      email: actorEmail,
      phone: actorPhone,
    };

    // Determine booking owner agent details
    const bookingAgentDetails = {
      name: booking.agent?.name ||
        (booking.createdBy ? `${booking.createdBy.firstName} ${booking.createdBy.lastName}`.trim() : null) ||
        actorName,
      designation: booking.agent?.designation || 'Travel Consultant',
      email: booking.agent?.payrollEmail || booking.agent?.email || booking.createdBy?.email || actorEmail,
      phone: booking.agent?.phoneNumber || (booking.createdBy as any)?.phoneNumber || actorPhone,
    };

    const uniquePnrsInFlights = Array.from(
      new Set(
        flightsToSend
          .map((f: any) => (f.pnr || '').trim().toUpperCase())
          .filter(Boolean)
      )
    );
    const targetPnr = (!isGroup && targetPnrScope !== 'GROUP')
      ? targetPnrScope
      : (uniquePnrsInFlights.length > 0 ? uniquePnrsInFlights.join(', ') : 'PENDING');

    // Calculate amounts accurately (excluding vendor payments / agent payouts)
    const clientTransactions = (booking.transactions || []).filter((tx: any) => {
      const pm = (tx.paymentMethod || '').toUpperCase();
      const notes = (tx.notes || '').toLowerCase();
      return pm !== 'AGENT PAYOUT' && pm !== 'AGENT_PAYOUT' && !notes.includes('vendor payment');
    });
    const clientTxSum = clientTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
    const paidAmount = clientTxSum > 0 ? clientTxSum : (booking.paidAmount || 0);
    const totalAmount = booking.totalPrice || 0;
    const refundAmount = booking.refundAmount || 0;
    const amountLeft = Math.max(0, Math.round(((totalAmount - refundAmount) - paidAmount) * 100) / 100);

    const emailResult = await emailService.sendTicketOrderEmail({
      bookingRef: booking.bookingReference,
      bookingDate: booking.bookingDate || booking.createdAt,
      departureDate: booking.departureDate,
      agentName: bookingAgentDetails.name,
      agentEmail: bookingAgentDetails.email,
      agentPhone: bookingAgentDetails.phone,
      agentDesignation: bookingAgentDetails.designation,
      actorDetails,
      bookingAgentDetails,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidAmount: Math.round(paidAmount * 100) / 100,
      amountLeft,
      paymentStatus: booking.paymentStatus,
      currencySymbol: '£',
      passengers: booking.passengers,
      flights: flightsToSend.map((fs: any) => ({
        pnr: fs.pnr,
        flightNo: fs.flightNo,
        departedFrom: fs.departedFrom,
        arrivedAt: fs.arrivedAt,
        departTime: fs.departTime,
        arrivalTime: fs.arrivalTime,
        date: fs.date,
        flightClass: fs.flightClass,
        baggage: fs.baggage,
        checkedBaggage: fs.checkedBaggage,
        carryOnBaggage: fs.carryOnBaggage,
        personalItem: fs.personalItem,
        vendorName: fs.vendor?.name || null,
        status: fs.status,
      })),
      customNotes: options.customNotes,
      pdfBase64: options.pdfBase64,
      passportAttachments,
      pnrScope: isGroup ? 'GROUP' : targetPnrScope,
      targetPnr,
      gdsText: options.gdsText,
    });

    // Write structured audit log
    if (actorUser?.id) {
      await auditLogService.log({
        userId: actorUser.id,
        action: 'Update',
        module: 'Bookings',
        recordId: booking.id,
        newValue: {
          subAction: isGroup ? 'SendTicketOrder_Group' : `SendTicketOrder_PNR_${targetPnrScope}`,
          pnrScope: isGroup ? 'GROUP' : targetPnrScope,
          segmentsCount: flightsToSend.length,
          recipients: ['office@terrifictravel.co.uk', 'ticketing@terrifictravel.co.uk'],
          sender: 'terrifictravelltd@gmail.com',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const scopeMsg = isGroup
      ? `Group Ticket Order (All PNRs - ${flightsToSend.length} segments)`
      : `Ticket Order for PNR ${targetPnrScope} (${flightsToSend.length} segments)`;

    return {
      success: true,
      message: `${scopeMsg} for booking ${booking.bookingReference} sent successfully to office@terrifictravel.co.uk and ticketing@terrifictravel.co.uk.`,
      recipients: ['office@terrifictravel.co.uk', 'ticketing@terrifictravel.co.uk'],
      pnr: isGroup ? 'ALL' : targetPnrScope,
      segmentsCount: flightsToSend.length,
    };
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
        otherCurrency: data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : (data.otherCurrency || null),
        otherCurrencyAmount: data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null,
        otherCurrencyType: data.otherCurrencyType || null,
        conversionRate: data.conversionRate ? Number(data.conversionRate) : null,
        refundAmount: Number(data.refundAmount) || 0,
        fineAmount: Number(data.fineAmount) || 0,
        agentQuotedPrice: data.agentQuotedPrice !== undefined && data.agentQuotedPrice !== null ? (Number(data.agentQuotedPrice) || null) : null,
        confirmationNumber: data.confirmationNumber || null,
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
        otherCurrency: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? String(data.otherCurrencyAmount) : null) : (data.otherCurrency !== undefined ? data.otherCurrency : undefined),
        otherCurrencyAmount: data.otherCurrencyAmount !== undefined ? (data.otherCurrencyAmount ? Number(data.otherCurrencyAmount) : null) : undefined,
        otherCurrencyType: data.otherCurrencyType !== undefined ? data.otherCurrencyType : undefined,
        conversionRate: data.conversionRate !== undefined ? (data.conversionRate ? Number(data.conversionRate) : null) : undefined,
        refundAmount: data.refundAmount !== undefined ? (Number(data.refundAmount) || 0) : undefined,
        fineAmount: data.fineAmount !== undefined ? (Number(data.fineAmount) || 0) : undefined,
        agentQuotedPrice: data.agentQuotedPrice !== undefined ? (data.agentQuotedPrice !== null ? Number(data.agentQuotedPrice) : null) : undefined,
        confirmationNumber: data.confirmationNumber !== undefined ? data.confirmationNumber : undefined,
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
        agentQuotedPrice: data.agentQuotedPrice !== undefined && data.agentQuotedPrice !== null ? (Number(data.agentQuotedPrice) || null) : null,
        confirmationNumber: data.confirmationNumber || null,
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
    if (data.agentQuotedPrice !== undefined) {
      updateData.agentQuotedPrice = data.agentQuotedPrice !== null ? Number(data.agentQuotedPrice) : null;
    }
    if (data.confirmationNumber !== undefined) updateData.confirmationNumber = data.confirmationNumber;

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

  async deleteTransaction(bookingId: string, transactionId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { transactions: true }
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const transaction = await prisma.bookingTransaction.findFirst({
      where: { id: transactionId, bookingId }
    });
    if (!transaction) throw new NotFoundException('Transaction record not found');

    // Delete transaction from database
    await prisma.bookingTransaction.delete({
      where: { id: transactionId }
    });

    // Recalculate remaining client transactions sum and refunds
    const remainingTxs = await prisma.bookingTransaction.findMany({
      where: { bookingId }
    });
    const isCustomerTx = (t: any) => {
      const methodLower = (t.paymentMethod || '').toLowerCase();
      if (methodLower.includes('vendor') || methodLower.includes('discount') || methodLower.includes('agent') || methodLower.includes('payout')) return false;
      const notesLower = (t.notes || '').toLowerCase();
      if (notesLower.includes('vendor payment') || notesLower.includes('agent payout') || notesLower.includes('refund from vendor')) return false;
      return true;
    };
    const clientTxs = remainingTxs.filter(isCustomerTx);
    const newPaidAmount = Math.round(clientTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0) * 100) / 100;
    
    // Calculate total customer refund if transaction had negative amount or was refund
    const refundTxs = remainingTxs.filter(tx => (tx.amount || 0) < 0 && isCustomerTx(tx));
    const newRefundAmount = Math.round(Math.abs(refundTxs.reduce((sum, tx) => sum + (tx.amount || 0), 0)) * 100) / 100;

    const newRemainingAmount = Math.max(0, Math.round(((booking.totalPrice || 0) - newPaidAmount) * 100) / 100);
    let newPaymentStatus = 'UNPAID';
    if (newRemainingAmount <= 0 && newPaidAmount > 0) {
      newPaymentStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      newPaymentStatus = 'PARTIALLY_PAID';
    }

    // Update booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paidAmount: newPaidAmount,
        refundAmount: newRefundAmount,
        remainingAmount: newRemainingAmount,
        paymentStatus: newPaymentStatus,
      }
    });

    await rabbitMQService.publish('booking.updated', {
      bookingId: booking.id,
    });

    return { success: true, newPaidAmount, newRemainingAmount };
  }

  async getUniqueHotels(search: string) {
    const accommodations = await prisma.accommodationService.findMany({
      where: search ? {
        hotelName: { contains: search, mode: 'insensitive' }
      } : undefined,
      select: { hotelName: true, city: true, hotelAddress: true },
      take: 100
    });

    const hotelDb = await prisma.hotel.findMany({
      where: search ? {
        name: { contains: search, mode: 'insensitive' }
      } : undefined,
      select: { name: true, city: true, address: true },
      take: 20
    });

    const combinedMap = new Map<string, any>();
    
    // Add past bookings
    accommodations.forEach(a => {
      if (a.hotelName && a.hotelName.trim() !== '') {
        const lowerName = a.hotelName.toLowerCase();
        const existing = combinedMap.get(lowerName);
        if (!existing) {
          combinedMap.set(lowerName, {
            name: a.hotelName,
            city: a.city || '',
            address: a.hotelAddress || ''
          });
        } else {
          if (!existing.address && a.hotelAddress) {
            existing.address = a.hotelAddress;
          }
          if (!existing.city && a.city) {
            existing.city = a.city;
          }
        }
      }
    });

    // Add hotel DB (will overwrite if duplicate, but keeps the unique names)
    hotelDb.forEach(h => {
      if (h.name && h.name.trim() !== '') {
        if (!combinedMap.has(h.name.toLowerCase())) {
          combinedMap.set(h.name.toLowerCase(), {
            name: h.name,
            city: h.city || '',
            address: h.address || ''
          });
        }
      }
    });

    return Array.from(combinedMap.values()).map((h, i) => ({
      id: `prev-${i}`,
      name: h.name,
      city: h.city,
      address: h.address
    })).slice(0, 20);
  }

  async getBookedServices(user: any, query: any) {
    const limit = Number(query.limit) || 50;
    const offset = Number(query.offset) || 0;
    const search = query.search as string || '';
    const type = query.type as string || 'all';

    const isAdmin = user.roles.some((role: string) => 
      ['SUPER_ADMIN', 'ADMIN', 'Admin'].includes(role)
    );
    const isManager = user.roles.some((role: string) => 
      ['Manager'].includes(role)
    );
    const isAgent = user.roles.some((role: string) => 
      ['Agent', 'TRAVEL_AGENT'].includes(role)
    );

    let accommodations: any[] = [];
    let accomTotal = 0;
    let flights: any[] = [];
    let flightsTotal = 0;

    // Fetch SystemSetting for done/fine booked services
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'booked_services_done' }
    });
    let doneIds: string[] = [];
    if (setting) {
      try {
        doneIds = JSON.parse(setting.value);
      } catch (e) {
        doneIds = [];
      }
    }

    const accomWhere: any = {};
    const accomAndFilters: any[] = [];
    const transportWhere: any = {};
    const transportAndFilters: any[] = [];
    const visaWhere: any = {};
    const visaAndFilters: any[] = [];
    const additionalWhere: any = {};
    const additionalAndFilters: any[] = [];

    if (search.trim()) {
      const q = search.trim();
      accomAndFilters.push({
        OR: [
          { hotelName: { contains: q, mode: 'insensitive' } },
          { roomType: { contains: q, mode: 'insensitive' } },
          { reservationNumber: { contains: q, mode: 'insensitive' } },
          { booking: { bookingReference: { contains: q, mode: 'insensitive' } } }
        ]
      });
      transportAndFilters.push({
        OR: [
          { vehicleType: { contains: q, mode: 'insensitive' } },
          { departureDestination: { contains: q, mode: 'insensitive' } },
          { arrivalDestination: { contains: q, mode: 'insensitive' } },
          { booking: { bookingReference: { contains: q, mode: 'insensitive' } } }
        ]
      });
      visaAndFilters.push({
        OR: [
          { passportNumber: { contains: q, mode: 'insensitive' } },
          { visaType: { contains: q, mode: 'insensitive' } },
          { visaNumber: { contains: q, mode: 'insensitive' } },
          { booking: { bookingReference: { contains: q, mode: 'insensitive' } } }
        ]
      });
      additionalAndFilters.push({
        OR: [
          { serviceName: { contains: q, mode: 'insensitive' } },
          { serviceDescription: { contains: q, mode: 'insensitive' } },
          { booking: { bookingReference: { contains: q, mode: 'insensitive' } } }
        ]
      });
    }

    if (!isAdmin) {
      if (isAgent || isManager) {
        const agentOrCreator = user.agentId 
          ? { OR: [{ agentId: user.agentId }, { createdById: user.id }] }
          : { createdById: user.id };

        accomAndFilters.push({ booking: agentOrCreator });
        transportAndFilters.push({ booking: agentOrCreator });
        visaAndFilters.push({ booking: agentOrCreator });
        additionalAndFilters.push({ booking: agentOrCreator });
      } else {
        const userFilter = { booking: { userId: user.id } };
        accomAndFilters.push(userFilter);
        transportAndFilters.push(userFilter);
        visaAndFilters.push(userFilter);
        additionalAndFilters.push(userFilter);
      }
    }

    if (accomAndFilters.length > 0) {
      accomWhere.AND = accomAndFilters;
    }
    if (transportAndFilters.length > 0) {
      transportWhere.AND = transportAndFilters;
    }
    if (visaAndFilters.length > 0) {
      visaWhere.AND = visaAndFilters;
    }
    if (additionalAndFilters.length > 0) {
      additionalWhere.AND = additionalAndFilters;
    }

    if (type === 'all' || type === 'hotels') {
      const allAccommodations = await prisma.accommodationService.findMany({
        where: accomWhere,
        include: {
          booking: {
            include: {
              agent: true,
              bookingVendorPayments: true
            }
          },
          vendor: true
        }
      });

      // Sort accommodations by checkInDate: upcoming (ascending), passed (descending)
      allAccommodations.sort((a: any, b: any) => {
        const dateA = a.checkInDate ? new Date(a.checkInDate) : null;
        const dateB = b.checkInDate ? new Date(b.checkInDate) : null;

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        const timeA = dateA.getTime();
        const timeB = dateB.getTime();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isUpcomingA = timeA >= today.getTime();
        const isUpcomingB = timeB >= today.getTime();

        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;

        if (isUpcomingA && isUpcomingB) {
          return timeA - timeB;
        } else {
          return timeB - timeA;
        }
      });

      accomTotal = allAccommodations.length;
      accommodations = allAccommodations.slice(offset, offset + limit).map((a: any) => {
        const vp = a.booking.bookingVendorPayments?.find((p: any) => p.vendorId === a.vendorId);
        return {
          ...a,
          isDone: doneIds.includes(a.id),
          vendorPaymentStatus: vp ? vp.status : 'PENDING'
        };
      });
    }

    if (type === 'all' || type === 'flights') {
      const bookingFlightWhere: any = {
        flightServices: {
          some: {}
        }
      };

      const flightAndFilters: any[] = [];

      if (search.trim()) {
        const q = search.trim();
        flightAndFilters.push({
          OR: [
            { bookingReference: { contains: q, mode: 'insensitive' } },
            {
              flightServices: {
                some: {
                  OR: [
                    { flightNo: { contains: q, mode: 'insensitive' } },
                    { pnr: { contains: q, mode: 'insensitive' } },
                    { departedFrom: { contains: q, mode: 'insensitive' } },
                    { arrivedAt: { contains: q, mode: 'insensitive' } }
                  ]
                }
              }
            }
          ]
        });
      }

      if (!isAdmin) {
        if (isAgent || isManager) {
          if (user.agentId) {
            flightAndFilters.push({
              OR: [
                { agentId: user.agentId },
                { createdById: user.id }
              ]
            });
          } else {
            flightAndFilters.push({ createdById: user.id });
          }
        } else {
          flightAndFilters.push({ userId: user.id });
        }
      }

      if (flightAndFilters.length > 0) {
        bookingFlightWhere.AND = flightAndFilters;
      }

      let bookingsWithFlights: any[] = [];
      const allBookingsWithFlights = await prisma.booking.findMany({
        where: bookingFlightWhere,
        include: {
          flightServices: {
            include: {
              vendor: true
            },
            orderBy: { date: 'asc' }
          },
          agent: true,
          bookingVendorPayments: true
        }
      });

      // Sort bookings by their first flight segment date: upcoming (ascending), passed (descending)
      allBookingsWithFlights.sort((a: any, b: any) => {
        const dateA = a.flightServices[0]?.date ? new Date(a.flightServices[0].date) : null;
        const dateB = b.flightServices[0]?.date ? new Date(b.flightServices[0].date) : null;

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        const timeA = dateA.getTime();
        const timeB = dateB.getTime();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isUpcomingA = timeA >= today.getTime();
        const isUpcomingB = timeB >= today.getTime();

        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;

        if (isUpcomingA && isUpcomingB) {
          return timeA - timeB;
        } else {
          return timeB - timeA;
        }
      });

      // Total count
      flightsTotal = allBookingsWithFlights.length;

      // Slice for pagination
      bookingsWithFlights = allBookingsWithFlights.slice(offset, offset + limit);

      flights = bookingsWithFlights.map(b => {
        const segments = b.flightServices;
        const firstSegment = segments[0] || {};
        
        const pnrs = Array.from(
          new Set(
            segments
              .map((s: any) => s.pnr)
              .filter((p: any) => p && p.trim() !== '' && p.toLowerCase() !== 'pending' && p.toLowerCase() !== 'n/a')
          )
        );
        const combinedPnr = pnrs.length > 0 ? pnrs.join(', ') : '';

        let combinedRoute = '';
        if (segments.length > 0) {
          const stops = [segments[0].departedFrom];
          segments.forEach((s: any) => {
            if (s.arrivedAt && stops[stops.length - 1] !== s.arrivedAt) {
              stops.push(s.arrivedAt);
            }
          });
          combinedRoute = stops.join(' → ');
        }

        const totalPrice = segments.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
        const hasMissingPnr = segments.some((s: any) => !s.pnr || s.pnr.trim() === '' || s.pnr.toLowerCase() === 'pending' || s.pnr.toLowerCase() === 'n/a');
        const hasCancelledSegment = segments.some((s: any) => s.status === 'CANCELLED');
        const collapsedStatus = hasCancelledSegment ? 'CANCELLED' : 'CONFIRMED';

        const vp = b.bookingVendorPayments?.find((p: any) => p.vendorId === firstSegment.vendorId);
        return {
          id: b.id,
          bookingId: b.id,
          date: firstSegment.date || b.createdAt,
          flightNo: segments.map((s: any) => s.flightNo).join(', '),
          pnr: combinedPnr,
          pnrMissing: hasMissingPnr,
          departedFrom: firstSegment.departedFrom || '',
          arrivedAt: segments[segments.length - 1]?.arrivedAt || '',
          departTime: firstSegment.departTime || '',
          arrivalTime: segments[segments.length - 1]?.arrivalTime || '',
          price: totalPrice,
          currency: firstSegment.currency || 'GBP',
          booking: {
            bookingReference: b.bookingReference,
            agent: b.agent,
            lockedStatus: b.lockedStatus,
            paymentStatus: b.paymentStatus
          },
          vendor: firstSegment.vendor,
          segmentsCount: segments.length,
          combinedRoute,
          isDone: doneIds.includes(b.id),
          status: collapsedStatus,
          vendorPaymentStatus: vp ? vp.status : 'PENDING',
          flightSegments: segments.map((s: any) => ({
            id: s.id,
            flightNo: s.flightNo,
            status: s.status || 'CONFIRMED',
            pnr: s.pnr,
            departedFrom: s.departedFrom,
            arrivedAt: s.arrivedAt,
            date: s.date
          }))
        };
      });
    }

    let transports: any[] = [];
    let transportsTotal = 0;
    if (type === 'all' || type === 'transports') {
      const allTransports = await prisma.transportService.findMany({
        where: transportWhere,
        include: {
          booking: {
            include: {
              agent: true,
              bookingVendorPayments: true
            }
          },
          vendor: true
        }
      });
      allTransports.sort((a: any, b: any) => {
        const dateA = a.date ? new Date(a.date) : null;
        const dateB = b.date ? new Date(b.date) : null;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        const timeA = dateA.getTime();
        const timeB = dateB.getTime();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isUpcomingA = timeA >= today.getTime();
        const isUpcomingB = timeB >= today.getTime();
        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;
        return timeA - timeB;
      });
      transportsTotal = allTransports.length;
      transports = allTransports.slice(offset, offset + limit).map((t: any) => {
        const vp = t.booking.bookingVendorPayments?.find((p: any) => p.vendorId === t.vendorId);
        return {
          ...t,
          isDone: doneIds.includes(t.id),
          vendorPaymentStatus: vp ? vp.status : 'PENDING'
        };
      });
    }

    let visas: any[] = [];
    let visasTotal = 0;
    if (type === 'all' || type === 'visas') {
      const allVisas = await prisma.visaService.findMany({
        where: visaWhere,
        include: {
          booking: {
            include: {
              agent: true,
              bookingVendorPayments: true
            }
          },
          vendor: true
        }
      });
      allVisas.sort((a: any, b: any) => {
        const dateA = a.issueDate ? new Date(a.issueDate) : null;
        const dateB = b.issueDate ? new Date(b.issueDate) : null;
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        const timeA = dateA.getTime();
        const timeB = dateB.getTime();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isUpcomingA = timeA >= today.getTime();
        const isUpcomingB = timeB >= today.getTime();
        if (isUpcomingA && !isUpcomingB) return -1;
        if (!isUpcomingA && isUpcomingB) return 1;
        return timeA - timeB;
      });
      visasTotal = allVisas.length;
      visas = allVisas.slice(offset, offset + limit).map((v: any) => {
        const vp = v.booking.bookingVendorPayments?.find((p: any) => p.vendorId === v.vendorId);
        return {
          ...v,
          isDone: doneIds.includes(v.id),
          vendorPaymentStatus: vp ? vp.status : 'PENDING'
        };
      });
    }

    let additionals: any[] = [];
    let additionalsTotal = 0;
    if (type === 'all' || type === 'additionals') {
      const allAdditionals = await prisma.additionalService.findMany({
        where: additionalWhere,
        include: {
          booking: {
            include: {
              agent: true,
              bookingVendorPayments: true
            }
          },
          vendor: true
        }
      });
      allAdditionals.sort((a: any, b: any) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return timeB - timeA;
      });
      additionalsTotal = allAdditionals.length;
      additionals = allAdditionals.slice(offset, offset + limit).map((ad: any) => {
        const vp = ad.booking.bookingVendorPayments?.find((p: any) => p.vendorId === ad.vendorId);
        return {
          ...ad,
          price: ad.servicePrice,
          currency: 'GBP',
          isDone: doneIds.includes(ad.id),
          vendorPaymentStatus: vp ? vp.status : 'PENDING'
        };
      });
    }

    return {
      accommodations: {
        total: accomTotal,
        items: accommodations
      },
      flights: {
        total: flightsTotal,
        items: flights
      },
      transports: {
        total: transportsTotal,
        items: transports
      },
      visas: {
        total: visasTotal,
        items: visas
      },
      additionals: {
        total: additionalsTotal,
        items: additionals
      }
    };
  }

  async toggleBookedServiceDone(serviceId: string) {
    let setting = await prisma.systemSetting.findUnique({
      where: { key: 'booked_services_done' }
    });

    let doneIds: string[] = [];
    if (setting) {
      try {
        doneIds = JSON.parse(setting.value);
      } catch (e) {
        doneIds = [];
      }
    }

    const index = doneIds.indexOf(serviceId);
    let isDone = false;
    if (index > -1) {
      doneIds.splice(index, 1);
    } else {
      doneIds.push(serviceId);
      isDone = true;
    }

    if (setting) {
      await prisma.systemSetting.update({
        where: { id: setting.id },
        data: { value: JSON.stringify(doneIds) }
      });
    } else {
      await prisma.systemSetting.create({
        data: {
          key: 'booked_services_done',
          value: JSON.stringify(doneIds),
          description: 'JSON array of booked service IDs marked as done/fine'
        }
      });
    }

    return { serviceId, isDone };
  }

  async updateVendorPaymentStatus(data: { bookingId: string; vendorId: string; status: string; partialAmount?: number }, actorId: string) {
    const { bookingId, vendorId, status, partialAmount } = data;
    if (!bookingId || !vendorId || !status) {
      throw new BadRequestException('bookingId, vendorId, and status are required');
    }

    const validStatuses = ['PENDING', 'PARTIAL', 'PAID'];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new BadRequestException('Invalid status. Must be PENDING, PARTIAL, or PAID');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Fetch booking
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          accommodations: true,
          flightServices: true,
          transportServices: true,
          visaServices: true,
          additionalServices: true,
        }
      });
      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      // 2. Fetch or compute BookingVendorPayment
      let bvp = await tx.bookingVendorPayment.findUnique({
        where: { bookingId_vendorId: { bookingId, vendorId } }
      });

      if (!bvp) {
        // Calculate original cost for this vendor
        let totalCost = 0;
        booking.accommodations?.forEach((x: any) => { if (x.vendorId === vendorId) totalCost += x.price; });
        booking.flightServices?.forEach((x: any) => { if (x.vendorId === vendorId) totalCost += x.price; });
        booking.transportServices?.forEach((x: any) => { if (x.vendorId === vendorId) totalCost += x.price; });
        booking.visaServices?.forEach((x: any) => { if (x.vendorId === vendorId) totalCost += x.price; });
        booking.additionalServices?.forEach((x: any) => { if (x.vendorId === vendorId) totalCost += x.servicePrice; });

        bvp = await tx.bookingVendorPayment.create({
          data: {
            bookingId,
            vendorId,
            originalCost: totalCost,
            remainingBalance: totalCost,
            amountPaid: 0,
            status: 'PENDING',
          }
        });
      }

      const originalCost = bvp.originalCost;
      const prevAmountPaid = bvp.amountPaid;
      let newAmountPaid = prevAmountPaid;
      let newStatus = status.toUpperCase();

      const issuanceDate = await vendorsService.getVendorIssuanceDate(tx, bookingId, vendorId);

      if (newStatus === 'PENDING') {
        newAmountPaid = 0;
        if (prevAmountPaid > 0) {
          // Reversal of previous payments
          await vendorsService.appendLedgerEntry(tx, {
            vendorId,
            bookingId,
            bookingReference: booking.bookingReference,
            eventType: 'REVERSAL',
            debit: prevAmountPaid,
            credit: 0.0,
            notes: `Reversal of vendor payment (reset to UNPAID) for booking #${booking.bookingReference}`,
            createdById: actorId,
            createdAt: issuanceDate,
          });
        }
      } else if (newStatus === 'PAID') {
        newAmountPaid = originalCost;
        const payAmount = originalCost - prevAmountPaid;
        if (payAmount > 0) {
          await vendorsService.appendLedgerEntry(tx, {
            vendorId,
            bookingId,
            bookingReference: booking.bookingReference,
            eventType: 'VENDOR_PAYMENT',
            debit: 0.0,
            credit: payAmount,
            notes: `Full vendor payment recorded manually for booking #${booking.bookingReference}`,
            createdById: actorId,
            createdAt: issuanceDate,
          });
        }
      } else if (newStatus === 'PARTIAL') {
        const pAmt = Number(partialAmount) || 0;
        if (pAmt <= 0) {
          throw new BadRequestException('Partial payment amount must be greater than zero');
        }
        newAmountPaid = prevAmountPaid + pAmt;
        if (newAmountPaid >= originalCost) {
          newAmountPaid = originalCost;
          newStatus = 'PAID';
        }
        await vendorsService.appendLedgerEntry(tx, {
          vendorId,
          bookingId,
          bookingReference: booking.bookingReference,
          eventType: 'VENDOR_PAYMENT',
          debit: 0.0,
          credit: pAmt,
          notes: `Partial vendor payment of ${pAmt} recorded manually for booking #${booking.bookingReference}`,
          createdById: actorId,
          createdAt: issuanceDate,
        });
      }

      const remainingBalance = Math.max(0, originalCost - newAmountPaid);

      // Update BookingVendorPayment
      const updatedBvp = await tx.bookingVendorPayment.update({
        where: { id: bvp.id },
        data: {
          amountPaid: newAmountPaid,
          remainingBalance,
          status: newStatus,
        }
      });

      return updatedBvp;
    });
  }
}

export const bookingsService = new BookingsService();


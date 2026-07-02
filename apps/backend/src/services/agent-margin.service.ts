import { prisma } from '../config';
import createError from 'http-errors';

export const agentMarginService = {
  async getEligibleBookings(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        agentId: { not: null },
        status: { not: 'CANCELLED' },
        OR: [
          {
            bookingDate: {
              gte: start,
              lte: end
            }
          },
          {
            bookingDate: null,
            createdAt: {
              gte: start,
              lte: end
            }
          }
        ]
      },
      include: {
        agent: { select: { name: true } },
        passengers: { select: { firstName: true, lastName: true }, take: 1 },
        bookingVendorPayments: true,
        agentMargin: { select: { status: true } }
      },
      orderBy: { bookingDate: 'asc' }
    });

    return bookings.map(b => {
      const vendorCost = b.bookingVendorPayments.reduce((acc: any, vp: any) => acc + (vp.amountPaid || 0), 0);
      const profit = b.paidAmount - vendorCost;
      return {
        id: b.id,
        bookingReference: b.bookingReference,
        date: b.bookingDate || b.createdAt,
        agentName: b.agent?.name,
        leadPassenger: b.passengers[0] ? `${b.passengers[0].firstName} ${b.passengers[0].lastName}` : 'Unknown',
        totalPrice: b.totalPrice,
        paidAmount: b.paidAmount,
        vendorCost,
        profit,
        marginStatus: b.agentMargin?.status
      };
    });
  },

  async calculateAgentMargins(startDate: string, endDate: string, includedBookingIds?: string[]) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // 1. Fetch all agents with their slabs
    const agents = await prisma.agent.findMany({
      include: {
        slabs: {
          orderBy: { minSales: 'asc' }
        }
      }
    });

    let eligibleBookingsRaw: any[] = [];

    // 2. Fetch eligible bookings using SQL aggregation
    if (includedBookingIds && Array.isArray(includedBookingIds)) {
      if (includedBookingIds.length > 0) {
        eligibleBookingsRaw = await prisma.$queryRaw`
          SELECT 
            b."agentId",
            COUNT(b.id)::int as "bookingCount",
            array_agg(b.id) as "bookingIds",
            SUM(b."paidAmount" - COALESCE(vp."totalVendorCost", 0))::float as "totalProfit"
          FROM "Booking" b
          LEFT JOIN (
            SELECT "bookingId", SUM("amountPaid") as "totalVendorCost"
            FROM "BookingVendorPayment"
            GROUP BY "bookingId"
          ) vp ON vp."bookingId" = b.id
          WHERE b.id = ANY(${includedBookingIds})
          GROUP BY b."agentId"
        `;
      }
    } else {
      eligibleBookingsRaw = await prisma.$queryRaw`
        SELECT 
          b."agentId",
          COUNT(b.id)::int as "bookingCount",
          array_agg(b.id) as "bookingIds",
          SUM(b."paidAmount" - COALESCE(vp."totalVendorCost", 0))::float as "totalProfit"
        FROM "Booking" b
        LEFT JOIN (
          SELECT "bookingId", SUM("amountPaid") as "totalVendorCost"
          FROM "BookingVendorPayment"
          GROUP BY "bookingId"
        ) vp ON vp."bookingId" = b.id
        WHERE b."agentId" IS NOT NULL
          AND b.status != 'CANCELLED'
          AND COALESCE(b."bookingDate", b."createdAt") >= ${start}
          AND COALESCE(b."bookingDate", b."createdAt") <= ${end}
        GROUP BY b."agentId"
      `;
    }

    const marginsCreated = [];

    // 3. Process each agent
    for (const data of eligibleBookingsRaw) {
      const agentId = data.agentId;
      const totalProfit = data.totalProfit || 0;
      const bookingCount = data.bookingCount || 0;

      const agent = agents.find((a: any) => a.id === agentId);
      if (!agent) continue;

      // Find applicable slab
      const slabs = agent.slabs;
      let applicableSlab = null;

      for (const slab of slabs) {
        if (totalProfit >= slab.minSales && (slab.maxSales === null || totalProfit <= slab.maxSales)) {
          applicableSlab = slab;
          break;
        }
      }

      // If no slab matches, default to 0%
      const marginPercentage = applicableSlab ? applicableSlab.commissionRate : 0;
      const marginAmount = totalProfit * (marginPercentage / 100);

      // Create or update the margin record
      const marginRecord = await prisma.agentMargin.upsert({
        where: {
          agentId_startDate_endDate: {
            agentId,
            startDate: start,
            endDate: end
          }
        },
        update: {
          bookingCount,
          totalProfit,
          marginPercentage,
          marginAmount,
          updatedAt: new Date()
        },
        create: {
          agentId,
          startDate: start,
          endDate: end,
          bookingCount,
          totalProfit,
          marginPercentage,
          marginAmount
        }
      });

      // Update the bookings to link to this margin record
      if (marginRecord) {
        // Clear old ones just in case recalculation removed some
        await prisma.booking.updateMany({
          where: { agentMarginId: marginRecord.id },
          data: { agentMarginId: null }
        });

        if (data.bookingIds && data.bookingIds.length > 0) {
          await prisma.booking.updateMany({
            where: { id: { in: data.bookingIds } },
            data: { agentMarginId: marginRecord.id }
          });
        }
      }

      marginsCreated.push(marginRecord);
    }

    return marginsCreated;
  },

  async getAllMargins(query: any) {
    const { startDate, endDate, agentId, status } = query;
    const where: any = {};

    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.endDate = { lte: end };
    }
    if (agentId && agentId !== 'all') where.agentId = agentId;
    if (status && status !== 'all') where.status = status;

    return prisma.agentMargin.findMany({
      where,
      include: {
        agent: {
          select: { id: true, name: true, email: true }
        },
        paidBy: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: [
        { startDate: 'desc' },
        { agent: { name: 'asc' } }
      ]
    });
  },

  async getAgentMargins(agentId: string) {
    return prisma.agentMargin.findMany({
      where: { agentId },
      orderBy: [
        { startDate: 'desc' }
      ]
    });
  },

  async markAsPaid(id: string, adminId: string, notes?: string) {
    const margin = await prisma.agentMargin.findUnique({
      where: { id },
      include: { 
        agent: true,
        bookings: {
          select: {
            id: true,
            bookingReference: true,
            paidAmount: true,
            bookingVendorPayments: {
              select: { amountPaid: true }
            }
          }
        }
      }
    });

    if (!margin) {
      throw createError(404, 'Margin record not found');
    }

    if (margin.status === 'PAID') {
      throw createError(400, 'Margin is already paid');
    }

    const transactionsData = margin.bookings.map(b => {
      const vendorCost = b.bookingVendorPayments.reduce((sum, vp) => sum + vp.amountPaid, 0);
      const profit = b.paidAmount - vendorCost;
      const bookingMargin = profit * (margin.marginPercentage / 100);

      const periodStr = `${margin.startDate.toISOString().split('T')[0]} to ${margin.endDate.toISOString().split('T')[0]}`;
      
      return {
        bookingId: b.id,
        amount: -bookingMargin,
        paymentMethod: 'AGENT PAYOUT',
        notes: `Agent Margin Payout for ${periodStr}`
      };
    });

    const periodStr = `${margin.startDate.toISOString().split('T')[0]} to ${margin.endDate.toISOString().split('T')[0]}`;
    const bookingRefs = margin.bookings.map(b => b.bookingReference).join(', ');
    const ledgerNotes = `Agent Margin Payout for ${periodStr}${bookingRefs ? ` | Bookings: ${bookingRefs}` : ''}`;

    // Transaction to update margin, create ledger, and insert booking transactions
    const [updatedMargin, ledgerEntry, bookingTransactions] = await prisma.$transaction([
      prisma.agentMargin.update({
        where: { id },
        data: {
          status: 'PAID',
          paidDate: new Date(),
          paidById: adminId,
          notes: notes || margin.notes
        }
      }),
      // Create ledger transaction
      prisma.vendorLedger.create({
        data: {
          agentId: margin.agentId,
          eventType: 'AGENT_PAYOUT',
          debit: margin.marginAmount,
          credit: 0,
          runningBalance: 0,
          notes: ledgerNotes,
          referenceNumber: `MARGIN-${margin.id.slice(-6).toUpperCase()}`,
          createdById: adminId
        }
      }),
      ...(transactionsData.length > 0 ? [
        prisma.bookingTransaction.createMany({
          data: transactionsData
        })
      ] : [])
    ]);

    return updatedMargin;
  },

  async resetPayment(id: string) {
    const margin = await prisma.agentMargin.findUnique({
      where: { id },
      include: { bookings: true }
    });

    if (!margin) {
      throw createError(404, 'Margin record not found');
    }

    if (margin.status !== 'PAID') {
      throw createError(400, 'Margin is not paid');
    }

    // Transaction to reset margin, remove ledger, and remove booking transactions
    const bookingIds = margin.bookings.map(b => b.id);
    
    await prisma.$transaction([
      prisma.agentMargin.update({
        where: { id },
        data: {
          status: 'UNPAID',
          paidDate: null,
          paidById: null
        }
      }),
      // Delete the corresponding ledger entry
      prisma.vendorLedger.deleteMany({
        where: {
          agentId: margin.agentId,
          eventType: 'AGENT_PAYOUT',
          referenceNumber: `MARGIN-${margin.id.slice(-6).toUpperCase()}`
        }
      }),
      // Delete corresponding booking transactions
      ...(bookingIds.length > 0 ? [
        (() => {
          const periodStr = `${margin.startDate.toISOString().split('T')[0]} to ${margin.endDate.toISOString().split('T')[0]}`;
          return prisma.bookingTransaction.deleteMany({
            where: {
              bookingId: { in: bookingIds },
              paymentMethod: 'AGENT PAYOUT',
              notes: `Agent Margin Payout for ${periodStr}`
            }
          });
        })()
      ] : [])
    ]);

    return { success: true };
  },

  async getMarginBookings(marginId: string) {
    const margin = await prisma.agentMargin.findUnique({
      where: { id: marginId }
    });

    if (!margin) throw createError(404, 'Margin record not found');

    const bookings = await prisma.booking.findMany({
      where: {
        agentMarginId: marginId
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        bookingVendorPayments: true,
      }
    });

    return bookings.map((b: any) => {
      const vendorCost = b.bookingVendorPayments.reduce((sum: number, vp: any) => sum + vp.amountPaid, 0);
      const profit = b.paidAmount - vendorCost;
      return {
        id: b.id,
        bookingReference: b.bookingReference,
        customerName: b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Unknown',
        createdAt: b.createdAt,
        paidAmount: b.paidAmount,
        vendorCost,
        profit,
        destination: '' // Can be populated if needed
      };
    });
  }
};

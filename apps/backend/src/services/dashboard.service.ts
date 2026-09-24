import { prisma } from '../config';

// Shared helper to calculate net profit and margin for a single booking
function calculateBookingFinancials(b: any): { vendorCost: number; margin: number; netProfit: number } {
  const price = b.totalPrice;
  let totalVendorCost = 0;
  if (b.bookingVendorPayments && b.bookingVendorPayments.length > 0) {
    totalVendorCost = b.bookingVendorPayments.reduce((sum: number, item: any) => sum + (item.originalCost || 0), 0);
  } else {
    const accommodationsCost = b.accommodations?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
    const flightsCost = b.flightServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
    const transportsCost = b.transportServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
    const visasCost = b.visaServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
    const additionalCost = b.additionalServices?.reduce((sum: number, item: any) => sum + item.servicePrice, 0) || 0;
    totalVendorCost = accommodationsCost + flightsCost + transportsCost + visasCost + additionalCost;
  }
  const rawProfit = price - totalVendorCost;

  let margin = 0.0;
  if (b.agent) {
    let slab = b.agent.slabs.find(
      (s: any) => price >= s.minSales && (s.maxSales === null || price <= s.maxSales)
    );
    if (!slab && b.agent.slabs.length > 0) {
      const highestSlab = b.agent.slabs.reduce((prev: any, current: any) =>
        prev.minSales > current.minSales ? prev : current
      );
      if (price > highestSlab.minSales) {
        slab = highestSlab;
      }
    }
    const rate = slab ? slab.commissionRate : 0.0;
    const potentialMargin = rawProfit * (rate / 100.0);
    if (rawProfit > 0) {
      if (rawProfit - potentialMargin <= 0) {
        margin = 0.0;
      } else {
        margin = potentialMargin;
      }
    }
  }

  return {
    vendorCost: totalVendorCost,
    margin,
    netProfit: rawProfit - margin,
  };
}

// Shared helper to calculate customer pending balance for a booking
function calculateCustomerPending(b: any): { clientPaid: number; pendingAmount: number; effectivePrice: number } {
  let clientPaid = 0;
  if (b.transactions && b.transactions.length > 0) {
    const clientTransactions = b.transactions.filter((tx: any) => {
      const pm = (tx.paymentMethod || '').toUpperCase();
      const notes = (tx.notes || '').toLowerCase();
      return pm !== 'AGENT PAYOUT' && pm !== 'AGENT_PAYOUT' && !notes.includes('vendor payment');
    });
    clientPaid = clientTransactions.reduce((sum: number, tx: any) => sum + (tx.amount || 0), 0);
  }

  if (clientPaid <= 0 && b.paidAmount > 0) {
    clientPaid = b.paidAmount;
  }

  const effectivePrice = Math.max(0, (b.totalPrice || 0) - (b.refundAmount || 0));
  const pendingAmount = Math.max(0, Math.round((effectivePrice - clientPaid) * 100) / 100);

  return {
    clientPaid: Math.round(clientPaid * 100) / 100,
    pendingAmount,
    effectivePrice: Math.round(effectivePrice * 100) / 100,
  };
}

// Helper to build the booking include payload
const bookingInclude = {
  agent: {
    include: {
      slabs: {
        orderBy: { minSales: 'asc' as const }
      }
    }
  },
  accommodations: true,
  flightServices: true,
  transportServices: true,
  visaServices: true,
  additionalServices: true,
  bookingVendorPayments: true,
  transactions: true,
  passengers: true,
};

export interface DashboardFilter {
  isAgent?: boolean;
  agentId?: string;
  userId?: string;
}

function parseFilter(filter?: DashboardFilter | string): {
  isAgent: boolean;
  agentId?: string;
  userId?: string;
  agentWhereClause: any;
} {
  if (!filter) {
    return { isAgent: false, agentWhereClause: null };
  }
  if (typeof filter === 'string') {
    return {
      isAgent: true,
      agentId: filter,
      agentWhereClause: { agentId: filter },
    };
  }

  const { isAgent, agentId, userId } = filter;
  if (!isAgent) {
    return { isAgent: false, agentWhereClause: null };
  }

  if (agentId && userId) {
    return {
      isAgent: true,
      agentId,
      userId,
      agentWhereClause: {
        OR: [
          { agentId },
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
    };
  } else if (agentId) {
    return {
      isAgent: true,
      agentId,
      agentWhereClause: { agentId },
    };
  } else if (userId) {
    return {
      isAgent: true,
      userId,
      agentWhereClause: {
        OR: [
          { createdById: userId },
          { assignedToId: userId },
        ],
      },
    };
  }

  return {
    isAgent: true,
    agentWhereClause: { id: '__no_agent_match__' },
  };
}

export class DashboardService {
  async getStats(filter?: DashboardFilter | string) {
    const { isAgent, agentId, userId, agentWhereClause } = parseFilter(filter);
    const bookingScope = agentWhereClause || {};

    const [users, bookings, flights, hotels, tours, allBookings, globalBookings, globalAgents] = await Promise.all([
      prisma.user.count({
        where: isAgent ? (agentId ? { agentId } : (userId ? { id: userId } : { id: '__none__' })) : {}
      }),
      prisma.booking.count({
        where: bookingScope
      }),
      prisma.booking.count({
        where: {
          ...bookingScope,
          status: { not: 'CANCELLED' },
          flightServices: { some: {} },
        }
      }),
      prisma.booking.count({
        where: {
          ...bookingScope,
          status: { not: 'CANCELLED' },
          accommodations: { some: {} },
        }
      }),
      prisma.booking.count({
        where: {
          ...bookingScope,
          status: { not: 'CANCELLED' },
          OR: [
            { visaServices: { some: {} } },
            { transportServices: { some: {} } },
            { additionalServices: { some: {} } }
          ],
        }
      }),
      prisma.booking.findMany({
        where: bookingScope,
        include: bookingInclude,
      }),
      prisma.booking.findMany({
        include: bookingInclude,
      }),
      prisma.agent.findMany(),
    ]);

    // Revenue = SUM(booking.totalPrice)
    const totalRevenue = allBookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);

    const agentMap: Record<string, { id: string; name: string; profit: number; bookingsCount: number }> = {};
    let totalProfit = 0;
    let totalMargin = 0;
    let totalCustomerPending = 0;
    let customerPendingBookingsCount = 0;

    // Calculate profit and margin for the filtered bookings (for the stat card)
    allBookings.forEach((b: any) => {
      const financials = calculateBookingFinancials(b);
      totalProfit += financials.netProfit;
      totalMargin += financials.margin;

      if (b.status !== 'CANCELLED') {
        const { pendingAmount } = calculateCustomerPending(b);
        if (pendingAmount > 0.01) {
          totalCustomerPending += pendingAmount;
          customerPendingBookingsCount += 1;
        }
      }
    });

    // Calculate agent leaderboard using ALL global bookings
    globalBookings.forEach((b: any) => {
      const { netProfit } = calculateBookingFinancials(b);

      if (b.agent) {
        if (!agentMap[b.agent.id]) {
          agentMap[b.agent.id] = {
            id: b.agent.id,
            name: b.agent.name,
            profit: 0,
            bookingsCount: 0,
          };
        }
        agentMap[b.agent.id].profit += netProfit;
        agentMap[b.agent.id].bookingsCount += 1;
      }
    });

    globalAgents.forEach((a: any) => {
      if (!agentMap[a.id]) {
        agentMap[a.id] = {
          id: a.id,
          name: a.name,
          profit: 0,
          bookingsCount: 0,
        };
      }
    });

    const agentPerformance = Object.values(agentMap);

    return {
      totalUsers: users,
      totalBookings: bookings,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalMargin: Math.round(totalMargin * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalCustomerPending: Math.round(totalCustomerPending * 100) / 100,
      customerPendingBookingsCount,
      flightBookings: flights,
      hotelBookings: hotels,
      tourBookings: tours,
      agentPerformance,
    };
  }

  async getStatsByPeriod(
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all',
    filter?: DashboardFilter | string
  ) {
    const { isAgent, agentWhereClause } = parseFilter(filter);
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined = new Date(now);

    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === 'weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate = new Date(now);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'quarterly') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
    } else if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }
    // 'all' => no date filter

    const dateFilter = startDate ? { 
      OR: [
        { bookingDate: { gte: startDate, lte: endDate } },
        { bookingDate: null, createdAt: { gte: startDate, lte: endDate } }
      ]
    } : null;

    let bookingWhere: any = {};
    if (agentWhereClause && dateFilter) {
      bookingWhere = {
        AND: [agentWhereClause, dateFilter]
      };
    } else if (agentWhereClause) {
      bookingWhere = agentWhereClause;
    } else if (dateFilter) {
      bookingWhere = dateFilter;
    }

    const performanceWhere: any = dateFilter ? dateFilter : {};

    const [bookings, flightBookings, hotelBookings, tourBookings, performanceBookings] = await Promise.all([
      prisma.booking.findMany({
        where: bookingWhere,
        include: bookingInclude,
      }),
      prisma.booking.count({
        where: {
          ...bookingWhere,
          status: { not: 'CANCELLED' },
          flightServices: { some: {} }
        }
      }),
      prisma.booking.count({
        where: {
          ...bookingWhere,
          status: { not: 'CANCELLED' },
          accommodations: { some: {} }
        }
      }),
      prisma.booking.count({
        where: {
          ...bookingWhere,
          status: { not: 'CANCELLED' },
          OR: [
            { visaServices: { some: {} } },
            { transportServices: { some: {} } },
            { additionalServices: { some: {} } }
          ]
        }
      }),
      prisma.booking.findMany({
        where: {
          ...performanceWhere,
          status: { not: 'CANCELLED' }
        },
        include: bookingInclude
      })
    ]);

    const globalAgents = await prisma.agent.findMany();
    const agentMap: Record<string, { id: string; name: string; profit: number; bookingsCount: number }> = {};

    globalAgents.forEach((a: any) => {
      agentMap[a.id] = {
        id: a.id,
        name: a.name,
        profit: 0,
        bookingsCount: 0,
      };
    });

    let totalRevenue = 0;
    let totalVendorCost = 0;
    let totalMargin = 0;
    let totalProfit = 0;
    let totalCustomerPending = 0;
    let customerPendingBookingsCount = 0;

    bookings.forEach((b: any) => {
      const financials = calculateBookingFinancials(b);
      totalRevenue += b.totalPrice;
      totalVendorCost += financials.vendorCost;
      totalMargin += financials.margin;
      totalProfit += financials.netProfit;

      if (b.status !== 'CANCELLED') {
        const { pendingAmount } = calculateCustomerPending(b);
        if (pendingAmount > 0.01) {
          totalCustomerPending += pendingAmount;
          customerPendingBookingsCount += 1;
        }
      }
    });

    performanceBookings.forEach((b: any) => {
      const financials = calculateBookingFinancials(b);
      if (b.agent) {
        if (!agentMap[b.agent.id]) {
          agentMap[b.agent.id] = {
            id: b.agent.id,
            name: b.agent.name,
            profit: 0,
            bookingsCount: 0,
          };
        }
        agentMap[b.agent.id].profit += financials.netProfit;
        agentMap[b.agent.id].bookingsCount += 1;
      }
    });

    const agentPerformance = Object.values(agentMap);

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalVendorCost: Math.round(totalVendorCost * 100) / 100,
      totalMargin: Math.round(totalMargin * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      totalCustomerPending: Math.round(totalCustomerPending * 100) / 100,
      customerPendingBookingsCount,
      totalBookings: bookings.length,
      flightBookings,
      hotelBookings,
      tourBookings,
      agentPerformance,
    };
  }

  async getTrends(filter?: DashboardFilter | string) {
    const { agentWhereClause } = parseFilter(filter);
    const bookings = await prisma.booking.findMany({
      where: agentWhereClause || {},
      include: bookingInclude,
      orderBy: {
        createdAt: 'asc'
      }
    });

    const calculateNetProfit = (b: any) => calculateBookingFinancials(b).netProfit;

    // 1. Daily (last 7 calendar days)
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;

      const dayBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingDate || b.createdAt);
        return bDate.getFullYear() === d.getFullYear() &&
               bDate.getMonth() === d.getMonth() &&
               bDate.getDate() === d.getDate();
      });

      const revenue = dayBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const profit = dayBookings.reduce((sum, b) => sum + calculateNetProfit(b), 0);

      daily.push({
        date: dateString,
        bookings: dayBookings.length,
        revenue,
        profit: Math.round(profit * 100) / 100
      });
    }

    // 2. Weekly (last 4 weeks, weekly buckets)
    const weekly = [];
    for (let i = 3; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - (i * 7 + 6));
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setDate(end.getDate() - (i * 7));
      end.setHours(23, 59, 59, 999);

      const label = `${String(start.getMonth() + 1).padStart(2, '0')}/${String(start.getDate()).padStart(2, '0')} - ${String(end.getMonth() + 1).padStart(2, '0')}/${String(end.getDate()).padStart(2, '0')}`;

      const weekBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingDate || b.createdAt);
        return bDate >= start && bDate <= end;
      });

      const revenue = weekBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const profit = weekBookings.reduce((sum, b) => sum + calculateNetProfit(b), 0);

      weekly.push({
        date: label,
        bookings: weekBookings.length,
        revenue,
        profit: Math.round(profit * 100) / 100
      });
    }

    // 3. Monthly (last 6 calendar months)
    const monthly = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // prevent month overflow
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      const monthBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingDate || b.createdAt);
        return bDate.getFullYear() === d.getFullYear() && bDate.getMonth() === d.getMonth();
      });

      const revenue = monthBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const profit = monthBookings.reduce((sum, b) => sum + calculateNetProfit(b), 0);

      monthly.push({
        date: label,
        bookings: monthBookings.length,
        revenue,
        profit: Math.round(profit * 100) / 100
      });
    }

    // 4. Quarterly (last 4 quarters)
    const quarterly = [];
    const now = new Date();
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const currentYear = now.getFullYear();

    for (let i = 3; i >= 0; i--) {
      // Work backwards from current quarter
      let q = currentQuarter - i;
      let y = currentYear;
      while (q < 0) {
        q += 4;
        y -= 1;
      }
      const qStart = new Date(y, q * 3, 1);
      const qEnd = new Date(y, q * 3 + 3, 0, 23, 59, 59, 999);
      const label = `Q${q + 1} ${y}`;

      const qBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingDate || b.createdAt);
        return bDate >= qStart && bDate <= qEnd;
      });

      const revenue = qBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const profit = qBookings.reduce((sum, b) => sum + calculateNetProfit(b), 0);

      quarterly.push({
        date: label,
        bookings: qBookings.length,
        revenue,
        profit: Math.round(profit * 100) / 100
      });
    }

    // 5. Yearly (last 3 calendar years)
    const yearly = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      const targetYear = d.getFullYear() - i;
      const label = `${targetYear}`;

      const yearBookings = bookings.filter(b => {
        const bDate = new Date(b.bookingDate || b.createdAt);
        return bDate.getFullYear() === targetYear;
      });

      const revenue = yearBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const profit = yearBookings.reduce((sum, b) => sum + calculateNetProfit(b), 0);

      yearly.push({
        date: label,
        bookings: yearBookings.length,
        revenue,
        profit: Math.round(profit * 100) / 100
      });
    }

    return {
      daily,
      weekly,
      monthly,
      quarterly,
      yearly
    };
  }

  async getCustomerPendingBookings(period?: string, search?: string) {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined = new Date(now);

    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === 'weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'quarterly') {
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59, 999);
    } else if (period === 'yearly') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const whereClause: any = {
      status: { not: 'CANCELLED' },
      ...(startDate ? {
        OR: [
          { bookingDate: { gte: startDate, lte: endDate } },
          { bookingDate: null, createdAt: { gte: startDate, lte: endDate } }
        ]
      } : {}),
    };

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        agent: true,
        passengers: true,
        transactions: true,
      },
      orderBy: [
        { bookingDate: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    let pendingBookings = bookings.map((b: any) => {
      const { clientPaid, pendingAmount, effectivePrice } = calculateCustomerPending(b);
      const leader = b.passengers?.find((p: any) => p.role === 'Leader') || b.passengers?.[0];
      const customerName = leader ? `${leader.firstName || ''} ${leader.lastName || ''}`.trim() : 'N/A';
      const customerPhone = leader?.phoneNumber || 'N/A';
      const customerEmail = leader?.email || 'N/A';

      return {
        id: b.id,
        bookingReference: b.bookingReference,
        bookingDate: b.bookingDate || b.createdAt,
        departureDate: b.departureDate,
        customerName: customerName || 'N/A',
        customerPhone,
        customerEmail,
        agentName: b.agent?.name || 'Unassigned',
        agentId: b.agentId,
        totalPrice: b.totalPrice,
        refundAmount: b.refundAmount || 0,
        effectivePrice,
        paidAmount: clientPaid,
        pendingAmount,
        paymentStatus: b.paymentStatus,
        status: b.status,
      };
    }).filter((b: any) => b.pendingAmount > 0.01);

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      pendingBookings = pendingBookings.filter((b: any) =>
        b.bookingReference?.toLowerCase().includes(s) ||
        b.customerName?.toLowerCase().includes(s) ||
        b.customerEmail?.toLowerCase().includes(s) ||
        b.customerPhone?.toLowerCase().includes(s) ||
        b.agentName?.toLowerCase().includes(s)
      );
    }

    // Sort descending by pending amount so the largest pending balances are on top
    pendingBookings.sort((a: any, b: any) => b.pendingAmount - a.pendingAmount);

    const totalPendingAmount = Math.round(pendingBookings.reduce((sum: number, b: any) => sum + b.pendingAmount, 0) * 100) / 100;

    return {
      bookings: pendingBookings,
      totalPendingAmount,
      count: pendingBookings.length,
    };
  }
}

export const dashboardService = new DashboardService();

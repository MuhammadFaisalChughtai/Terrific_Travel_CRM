import { prisma } from '../config';

// Shared helper to calculate net profit and margin for a single booking
function calculateBookingFinancials(b: any): { vendorCost: number; margin: number; netProfit: number } {
  const price = b.totalPrice;
  const accommodationsCost = b.accommodations?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
  const flightsCost = b.flightServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
  const transportsCost = b.transportServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
  const visasCost = b.visaServices?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
  const additionalCost = b.additionalServices?.reduce((sum: number, item: any) => sum + item.servicePrice, 0) || 0;

  const totalVendorCost = accommodationsCost + flightsCost + transportsCost + visasCost + additionalCost;
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
};

export class DashboardService {
  async getStats(agentId?: string) {
    const [users, bookings, flights, hotels, tours, allBookings, allAgents, globalBookings, globalAgents] = await Promise.all([
      prisma.user.count({
        where: agentId ? { agentId } : {}
      }),
      prisma.booking.count({
        where: agentId ? { agentId } : {}
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'FLIGHT',
          ...(agentId ? { booking: { agentId } } : {})
        }
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'HOTEL',
          ...(agentId ? { booking: { agentId } } : {})
        }
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'TOUR',
          ...(agentId ? { booking: { agentId } } : {})
        }
      }),
      prisma.booking.findMany({
        where: agentId ? { agentId } : {},
        include: bookingInclude,
      }),
      prisma.agent.findMany({
        where: agentId ? { id: agentId } : {}
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

    // Calculate profit for the filtered bookings (for the stat card)
    allBookings.forEach((b: any) => {
      const { netProfit } = calculateBookingFinancials(b);
      totalProfit += netProfit;
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
      totalProfit: Math.round(totalProfit * 100) / 100,
      flightBookings: flights,
      hotelBookings: hotels,
      tourBookings: tours,
      agentPerformance,
    };
  }

  async getStatsByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all', agentId?: string) {
    const now = new Date();
    let startDate: Date | undefined;
    let endDate: Date | undefined = new Date(now);

    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === 'weekly') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now);
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

    const bookingWhere: any = {
      ...(agentId ? { agentId } : {}),
      ...(startDate ? { 
        OR: [
          { bookingDate: { gte: startDate, lte: endDate } },
          { bookingDate: null, createdAt: { gte: startDate, lte: endDate } }
        ]
      } : {}),
    };

    const [bookings, flightBookings, hotelBookings, tourBookings] = await Promise.all([
      prisma.booking.findMany({
        where: bookingWhere,
        include: bookingInclude,
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'FLIGHT',
          booking: bookingWhere
        }
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'HOTEL',
          booking: bookingWhere
        }
      }),
      prisma.bookingItem.count({
        where: {
          itemType: 'TOUR',
          booking: bookingWhere
        }
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

    bookings.forEach((b: any) => {
      const financials = calculateBookingFinancials(b);
      totalRevenue += b.totalPrice;
      totalVendorCost += financials.vendorCost;
      totalMargin += financials.margin;
      totalProfit += financials.netProfit;

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
      totalBookings: bookings.length,
      flightBookings,
      hotelBookings,
      tourBookings,
      agentPerformance,
    };
  }

  async getTrends(agentId?: string) {
    const bookings = await prisma.booking.findMany({
      where: agentId ? { agentId } : {},
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
}

export const dashboardService = new DashboardService();

import { prisma } from '../config';

export class DashboardService {
  async getStats() {
    const [users, bookings, payments, flights, hotels, tours, allBookings, allAgents] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
      prisma.bookingItem.count({ where: { itemType: 'FLIGHT' } }),
      prisma.bookingItem.count({ where: { itemType: 'HOTEL' } }),
      prisma.bookingItem.count({ where: { itemType: 'TOUR' } }),
      prisma.booking.findMany({
        include: {
          agent: {
            include: {
              slabs: {
                orderBy: { minSales: 'asc' }
              }
            }
          },
          accommodations: true,
          flightServices: true,
          transportServices: true,
          visaServices: true,
          additionalServices: true,
        }
      }),
      prisma.agent.findMany(),
    ]);

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    const agentMap: Record<string, { id: string; name: string; profit: number; bookingsCount: number }> = {};

    allBookings.forEach((b: any) => {
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
          const highestSlab = b.agent.slabs.reduce((prev: any, current: any) => (prev.minSales > current.minSales) ? prev : current);
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

      const netProfit = rawProfit - margin;

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

    allAgents.forEach((a: any) => {
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
      totalRevenue,
      flightBookings: flights,
      hotelBookings: hotels,
      tourBookings: tours,
      agentPerformance,
    };
  }

  async getTrends() {
    const bookings = await prisma.booking.findMany({
      include: {
        agent: {
          include: {
            slabs: {
              orderBy: { minSales: 'asc' }
            }
          }
        },
        accommodations: true,
        flightServices: true,
        transportServices: true,
        visaServices: true,
        additionalServices: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const calculateNetProfit = (b: any) => {
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
          const highestSlab = b.agent.slabs.reduce((prev: any, current: any) => (prev.minSales > current.minSales) ? prev : current);
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

      return rawProfit - margin;
    };

    // 1. Daily (last 7 calendar days)
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
      
      const dayBookings = bookings.filter(b => {
        const bDate = new Date(b.createdAt);
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
        const bDate = new Date(b.createdAt);
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
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      
      const monthBookings = bookings.filter(b => {
        const bDate = new Date(b.createdAt);
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

    // 4. Yearly (last 3 calendar years)
    const yearly = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      const targetYear = d.getFullYear() - i;
      const label = `${targetYear}`;
      
      const yearBookings = bookings.filter(b => {
        const bDate = new Date(b.createdAt);
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
      yearly
    };
  }
}

export const dashboardService = new DashboardService();

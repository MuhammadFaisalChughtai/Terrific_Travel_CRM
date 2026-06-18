import { prisma } from '../config';

export class DashboardService {
  async getStats() {
    const [users, bookings, payments, flights, hotels, tours] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.payment.findMany({ where: { status: 'SUCCESS' } }),
      prisma.bookingItem.count({ where: { itemType: 'FLIGHT' } }),
      prisma.bookingItem.count({ where: { itemType: 'HOTEL' } }),
      prisma.bookingItem.count({ where: { itemType: 'TOUR' } }),
    ]);

    const totalRevenue = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    return {
      totalUsers: users,
      totalBookings: bookings,
      totalRevenue,
      flightBookings: flights,
      hotelBookings: hotels,
      tourBookings: tours,
    };
  }

  async getTrends() {
    return [
      { date: '06/10', bookings: 5, revenue: 2200 },
      { date: '06/11', bookings: 8, revenue: 3800 },
      { date: '06/12', bookings: 12, revenue: 5400 },
      { date: '06/13', bookings: 6, revenue: 2900 },
      { date: '06/14', bookings: 15, revenue: 6800 },
      { date: '06/15', bookings: 18, revenue: 7300 },
    ];
  }
}

export const dashboardService = new DashboardService();

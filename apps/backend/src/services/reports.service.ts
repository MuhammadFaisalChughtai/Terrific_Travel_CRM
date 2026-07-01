import { prisma } from '../config';

export const reportsService = {
  async getBalanceSheet(month?: number, year?: number) {
    let bookingWhere: any = { status: { not: 'CANCELLED' } };
    let vendorWhere: any = {};
    let marginWhere: any = {};

    if (month && year) {
      // Create a date range for the specified month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      
      bookingWhere.createdAt = { gte: startDate, lte: endDate };
      vendorWhere.createdAt = { gte: startDate, lte: endDate };
      marginWhere.month = month;
      marginWhere.year = year;
    }

    // 1. Revenue & Receivables (from Bookings)
    const bookings = await prisma.booking.aggregate({
      where: bookingWhere,
      _sum: {
        paidAmount: true,
        remainingAmount: true,
      }
    });

    const totalRevenue = bookings._sum.paidAmount || 0;
    const accountsReceivable = bookings._sum.remainingAmount || 0;

    // 2. Vendor Costs & Payables (from BookingVendorPayment)
    const vendorPayments = await prisma.bookingVendorPayment.aggregate({
      where: vendorWhere,
      _sum: {
        amountPaid: true,
        remainingBalance: true,
      }
    });

    const totalVendorCost = vendorPayments._sum.amountPaid || 0;
    const vendorPayables = vendorPayments._sum.remainingBalance || 0;

    // 3. Agent Margins (Paid and Unpaid)
    const margins = await prisma.agentMargin.findMany({
      where: marginWhere,
      select: {
        status: true,
        marginAmount: true,
      }
    });

    let totalAgentMarginsPaid = 0;
    let agentPayables = 0;

    for (const m of margins) {
      if (m.status === 'PAID') {
        totalAgentMarginsPaid += m.marginAmount;
      } else {
        agentPayables += m.marginAmount;
      }
    }

    // 4. Net Profit (Paid Revenue - Paid Vendor Costs - Paid Margins)
    const netProfit = totalRevenue - totalVendorCost - totalAgentMarginsPaid;

    // Monthly Trend Data (last 6 months)
    let trendData: any[] = [];
    
    // Only generate trend if looking at lifetime, otherwise it's contextually isolated
    if (!month || !year) {
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

        const mBookings = await prisma.booking.aggregate({
          where: { status: { not: 'CANCELLED' }, createdAt: { gte: start, lte: end } },
          _sum: { paidAmount: true }
        });

        const mVendors = await prisma.bookingVendorPayment.aggregate({
          where: { createdAt: { gte: start, lte: end } },
          _sum: { amountPaid: true }
        });

        const mMargins = await prisma.agentMargin.aggregate({
          where: { month: d.getMonth() + 1, year: d.getFullYear(), status: 'PAID' },
          _sum: { marginAmount: true }
        });

        const rev = mBookings._sum.paidAmount || 0;
        const vc = mVendors._sum.amountPaid || 0;
        const am = mMargins._sum.marginAmount || 0;

        trendData.push({
          name: start.toLocaleString('default', { month: 'short', year: '2-digit' }),
          revenue: rev,
          cost: vc + am,
          profit: rev - (vc + am)
        });
      }
    }

    return {
      assets: {
        cashAtHand: netProfit, // For simplicity in this CRM: Cash = Profit (In - Out)
        accountsReceivable,
        totalAssets: netProfit + accountsReceivable,
      },
      liabilities: {
        vendorPayables,
        agentPayables,
        totalLiabilities: vendorPayables + agentPayables,
      },
      equity: {
        retainedEarnings: netProfit - (vendorPayables + agentPayables), // Very simplified equity
      },
      metrics: {
        totalRevenue,
        totalVendorCost,
        totalAgentMargins: totalAgentMarginsPaid,
        totalCost: totalVendorCost + totalAgentMarginsPaid,
        netProfit,
      },
      trendData
    };
  }
};

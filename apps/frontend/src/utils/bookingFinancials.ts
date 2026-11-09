export const getCommissionRate = (price: number, slabs: any[]): number => {
  if (!slabs || slabs.length === 0) return 0;
  const slab = slabs.find(
    (s: any) =>
      price >= s.minSales && (s.maxSales === null || price <= s.maxSales)
  );
  if (slab) return slab.commissionRate;

  // Fallback: if price exceeds highest slab's maxSales, use rate of slab with highest minSales
  const highestSlab = slabs.reduce((prev: any, current: any) =>
    prev.minSales > current.minSales ? prev : current
  );
  if (price > highestSlab.minSales) {
    return highestSlab.commissionRate;
  }
  return 0;
};

export const isCustomerTransaction = (tx: any): boolean => {
  if (!tx) return false;
  const methodLower = (tx.paymentMethod || tx.method || '').toLowerCase();
  if (
    methodLower.includes('vendor') ||
    methodLower.includes('discount') ||
    methodLower.includes('agent') ||
    methodLower.includes('payout') ||
    methodLower.includes('fee') ||
    methodLower.includes('charge')
  ) {
    return false;
  }
  if (!tx.notes) return true;
  const notesLower = tx.notes.toLowerCase();
  if (
    notesLower.includes('vendor') ||
    notesLower.includes('discount') ||
    notesLower.includes('agent') ||
    notesLower.includes('payout') ||
    notesLower.includes('refund from vendor') ||
    notesLower.includes('credit card charge') ||
    notesLower.includes('card payment charge') ||
    notesLower.includes('cc charge')
  ) {
    return false;
  }
  return true;
};

export const calculateMargin = (price: number, profit: number, slabs: any[]): number => {
  const rate = getCommissionRate(price, slabs);
  return profit > 0 ? profit * (rate / 100) : 0;
};

export interface BookingFinancialOverview {
  totalPrice: number;
  effectiveTotalPrice: number;
  paidAmount: number;
  grossClientPaid: number;
  remainingAmount: number;
  totalVendorCost: number;
  totalPaidToVendors: number;
  vendorRemaining: number;
  totalVendorRefund: number;
  clientRefund: number;
  netRefundDifference: number;
  refundAdditionalProfit: number;
  refundAdditionalMargin: number;
  totalAdditionalProfit: number;
  totalAdditionalMargin: number;
  totalReducedProfit: number;
  totalReducedMargin: number;
  cardPaymentCharges: number;
  rawProfit: number;
  potentialMargin: number;
  agentCommissionRate: number;
  agentMargin: number; // Current payable margin (0 if already paid or voided)
  originalAgentMargin: number; // Base calculated margin before void/payout
  hasAgentPayout: boolean;
  actualOriginalPayout: number;
  actualAdditionalPayout: number;
  actualAgentPayout: number;
  profit: number; // Net Company Profit (matches TOTAL PROFIT card in Booking Manager modal)
  originalProfit: number;
}

export function resolveCardPaymentCharges(booking: any): number {
  const rawCharges = Number(booking?.cardPaymentCharges) || 0;
  if (rawCharges <= 0) return 0;
  if (booking?.transactions && Array.isArray(booking.transactions)) {
    if (booking.transactions.length === 0) return 0;
    const feeTxs = booking.transactions.filter((tx: any) => {
      const method = (tx.paymentMethod || '').toLowerCase();
      const notes = (tx.notes || '').toLowerCase();
      return (
        method.includes('fee') ||
        notes.includes('credit card charge') ||
        notes.includes('card payment charge') ||
        notes.includes('cc charge')
      );
    });
    if (feeTxs.length > 0) {
      return Math.round(feeTxs.reduce((sum: number, tx: any) => sum + Math.abs(Number(tx.amount) || 0), 0) * 100) / 100;
    }
    const hasCcTx = booking.transactions.some((tx: any) => {
      const method = (tx.paymentMethod || '').toLowerCase();
      const notes = (tx.notes || '').toLowerCase();
      return (
        method.includes('credit card') ||
        method.includes('cc') ||
        notes.includes('credit card') ||
        notes.includes('card payment')
      );
    });
    if (!hasCcTx) return 0;
  }
  return rawCharges;
}

export function computeBookingFinancials(booking: any): BookingFinancialOverview {
  if (!booking) {
    return {
      totalPrice: 0,
      effectiveTotalPrice: 0,
      paidAmount: 0,
      grossClientPaid: 0,
      remainingAmount: 0,
      totalVendorCost: 0,
      totalPaidToVendors: 0,
      vendorRemaining: 0,
      totalVendorRefund: 0,
      clientRefund: 0,
      netRefundDifference: 0,
      refundAdditionalProfit: 0,
      refundAdditionalMargin: 0,
      totalAdditionalProfit: 0,
      totalAdditionalMargin: 0,
      totalReducedProfit: 0,
      totalReducedMargin: 0,
      cardPaymentCharges: 0,
      rawProfit: 0,
      potentialMargin: 0,
      agentCommissionRate: 0,
      agentMargin: 0,
      originalAgentMargin: 0,
      hasAgentPayout: false,
      actualOriginalPayout: 0,
      actualAdditionalPayout: 0,
      actualAgentPayout: 0,
      profit: 0,
      originalProfit: 0,
    };
  }

  // Client payment sums
  const clientTransactionsList = booking.transactions?.filter(isCustomerTransaction) || [];
  const clientTxSum = clientTransactionsList.reduce(
    (sum: number, tx: any) => sum + (Number(tx.amount) || 0),
    0
  );

  const cardPaymentCharges = resolveCardPaymentCharges(booking);
  const rawTotalPrice = Number(booking.totalPrice) || 0;
  const installmentSum =
    booking.installments?.reduce(
      (s: number, inst: any) => s + (Number(inst.amount) || 0),
      0,
    ) || 0;
  // Ensure credit card charges do not minus from Total Payment
  const totalPrice =
    installmentSum > 0 &&
    cardPaymentCharges > 0 &&
    Math.abs(installmentSum - (rawTotalPrice + cardPaymentCharges)) < 0.05
      ? installmentSum
      : rawTotalPrice;

  const clientRefund = Number(booking.refundAmount) || 0;
  // Effective contract price after client refunds / credit notes
  const effectiveTotalPrice = Math.max(0, totalPrice - clientRefund);

  // Net cash received from client
  const paidAmount = clientTxSum > 0 ? clientTxSum : (Number(booking.paidAmount) || 0);

  // Gross client cash inflow before refunds
  const grossClientPaid =
    clientTransactionsList
      .filter((tx: any) => (Number(tx.amount) || 0) > 0)
      .reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0) || paidAmount;

  // Client Pending / Balance Due is based on effective total price minus net received
  const remainingAmount = Math.max(0, effectiveTotalPrice - paidAmount);

  // Vendor Cost Calculations
  const accommodationsCost =
    booking.accommodations?.reduce((sum: number, acc: any) => sum + (Number(acc.price) || 0), 0) || 0;
  const flightsCost =
    booking.flightServices?.reduce((sum: number, fs: any) => sum + (Number(fs.price) || 0), 0) || 0;
  const transportsCost =
    booking.transportServices?.reduce((sum: number, ts: any) => sum + (Number(ts.price) || 0), 0) || 0;
  const visasCost =
    booking.visaServices?.reduce((sum: number, vs: any) => sum + (Number(vs.price) || 0), 0) || 0;
  const additionalServicesCost =
    booking.additionalServices?.reduce((sum: number, as: any) => sum + (Number(as.servicePrice) || 0), 0) || 0;

  const totalVendorCost =
    booking.bookingVendorPayments && booking.bookingVendorPayments.length > 0
      ? booking.bookingVendorPayments.reduce((sum: number, p: any) => sum + (Number(p.originalCost) || 0), 0)
      : accommodationsCost + flightsCost + transportsCost + visasCost + additionalServicesCost;

  const totalPaidToVendors =
    booking.bookingVendorPayments?.reduce((sum: number, bvp: any) => sum + (Number(bvp.amountPaid) || 0), 0) || 0;

  const vendorRemaining =
    booking.bookingVendorPayments && booking.bookingVendorPayments.length > 0
      ? booking.bookingVendorPayments.reduce((sum: number, bvp: any) => sum + (Number(bvp.remainingBalance) || 0), 0)
      : totalVendorCost - totalPaidToVendors;

  // Refund Calculations
  const accommodationsRefund =
    booking.accommodations?.reduce((sum: number, acc: any) => sum + (Number(acc.refundAmount) || 0), 0) || 0;
  const flightsRefund =
    booking.flightServices?.reduce((sum: number, fs: any) => sum + (Number(fs.refundAmount) || 0), 0) || 0;
  const transportsRefund =
    booking.transportServices?.reduce((sum: number, ts: any) => sum + (Number(ts.refundAmount) || 0), 0) || 0;
  const visasRefund =
    booking.visaServices?.reduce((sum: number, vs: any) => sum + (Number(vs.refundAmount) || 0), 0) || 0;

  const totalVendorRefund = accommodationsRefund + flightsRefund + transportsRefund + visasRefund;

  // Raw Profit (before agent margin deduction) - cardPaymentCharges is deducted from profit
  const rawProfit = totalPrice - clientRefund - (totalVendorCost - totalVendorRefund) - cardPaymentCharges;

  // Potential Margin
  const slabs = booking.agent?.slabs || [];
  const potentialMargin =
    booking.agentId && booking.agent && slabs.length > 0
      ? calculateMargin(totalPrice, rawProfit, slabs)
      : 0;

  const potentialRate =
    booking.agentId && booking.agent && slabs.length > 0
      ? getCommissionRate(totalPrice, slabs)
      : 0;

  let agentMargin = 0;
  let agentCommissionRate = 0;

  if (rawProfit > 0) {
    if (rawProfit - potentialMargin <= 0) {
      agentMargin = 0;
      agentCommissionRate = 0;
    } else {
      agentMargin = potentialMargin;
      agentCommissionRate = potentialRate;
    }
  }

  const originalAgentMargin = agentMargin;

  const hasAgentPayout =
    booking.transactions?.some(
      (tx: any) => tx.paymentMethod === 'AGENT PAYOUT' || tx.paymentMethod === 'AGENT_PAYOUT'
    ) || (booking.agentMargin && booking.agentMargin.status === 'PAID');

  if (hasAgentPayout || booking.agentMarginVoided) {
    agentMargin = 0;
  }

  // Net Refund Surplus (Vendor Refund retained after Customer Refund)
  const netRefundDifference = Math.max(
    0,
    Math.round((totalVendorRefund - clientRefund) * 100) / 100
  );

  // When vendor refund exceeds client refund, the surplus is retained
  // If agent margin is applicable, it allocates additional margin and additional profit
  const commissionRate = booking.agentId && booking.agent ? (agentCommissionRate || potentialRate || 0) : 0;
  const refundAdditionalMargin =
    netRefundDifference > 0 && commissionRate > 0
      ? Math.round(netRefundDifference * (commissionRate / 100) * 100) / 100
      : 0;
  const refundAdditionalProfit =
    netRefundDifference > 0
      ? Math.round((netRefundDifference - refundAdditionalMargin) * 100) / 100
      : 0;

  // Price adjustments
  const hotelPriceAdjustments: any[] = booking.hotelPriceAdjustments || [];
  const transportPriceAdjustments: any[] = booking.transportPriceAdjustments || [];
  const visaPriceAdjustments: any[] = booking.visaPriceAdjustments || [];
  const additionalServicePriceAdjustments: any[] = booking.additionalServicePriceAdjustments || [];

  const allPriceAdjustments: any[] = [
    ...hotelPriceAdjustments,
    ...transportPriceAdjustments,
    ...visaPriceAdjustments,
    ...additionalServicePriceAdjustments,
  ];
  const hasAnyPriceAdjustments = allPriceAdjustments.length > 0;

  const totalAdditionalProfit =
    allPriceAdjustments.reduce(
      (sum: number, adj: any) => sum + (Number(adj.additionalProfit) || 0),
      0
    ) + refundAdditionalProfit;

  const totalReducedProfit = allPriceAdjustments.reduce(
    (sum: number, adj: any) => sum + (Number(adj.reducedProfit) || 0),
    0
  );

  const totalAdditionalMargin =
    allPriceAdjustments.reduce(
      (sum: number, adj: any) => sum + (Number(adj.additionalMargin) || 0),
      0
    ) + refundAdditionalMargin;

  const totalReducedMargin = allPriceAdjustments.reduce(
    (sum: number, adj: any) => sum + (Number(adj.reducedMargin) || 0),
    0
  );

  const isAdditionalMarginTx = (tx: any) => {
    const notes = (tx.notes || '').toLowerCase();
    return (
      (tx.paymentMethod === 'AGENT PAYOUT' || tx.paymentMethod === 'AGENT_PAYOUT') &&
      (notes.includes('additional') || notes.includes('refund'))
    );
  };

  const actualOriginalPayout = booking.transactions
    ? Math.abs(
        booking.transactions
          .filter(
            (tx: any) =>
              (tx.paymentMethod === 'AGENT PAYOUT' || tx.paymentMethod === 'AGENT_PAYOUT') &&
              !isAdditionalMarginTx(tx)
          )
          .reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0)
      )
    : 0;

  const actualAdditionalPayout = booking.transactions
    ? Math.abs(
        booking.transactions
          .filter(isAdditionalMarginTx)
          .reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0)
      )
    : 0;

  const actualAgentPayout = actualOriginalPayout + actualAdditionalPayout;

  const originalProfit = booking.agentMarginVoided
    ? rawProfit - totalAdditionalProfit + totalReducedProfit
    : hasAgentPayout
      ? rawProfit - totalAdditionalProfit + totalReducedProfit - actualOriginalPayout
      : rawProfit - totalAdditionalProfit + totalReducedProfit - originalAgentMargin;

  // Net Company Profit (matches TOTAL PROFIT card in Booking Manager modal)
  const profit = (hasAnyPriceAdjustments || totalAdditionalProfit > 0 || totalReducedProfit > 0)
    ? originalProfit + totalAdditionalProfit - totalReducedProfit
    : booking.agentMarginVoided
      ? rawProfit
      : hasAgentPayout
        ? rawProfit - actualAgentPayout
        : rawProfit - originalAgentMargin;

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    effectiveTotalPrice: Math.round(effectiveTotalPrice * 100) / 100,
    paidAmount: Math.round(paidAmount * 100) / 100,
    grossClientPaid: Math.round(grossClientPaid * 100) / 100,
    remainingAmount: Math.round(remainingAmount * 100) / 100,
    totalVendorCost: Math.round(totalVendorCost * 100) / 100,
    totalPaidToVendors: Math.round(totalPaidToVendors * 100) / 100,
    vendorRemaining: Math.round(vendorRemaining * 100) / 100,
    totalVendorRefund: Math.round(totalVendorRefund * 100) / 100,
    clientRefund: Math.round(clientRefund * 100) / 100,
    netRefundDifference: Math.round(netRefundDifference * 100) / 100,
    refundAdditionalProfit: Math.round(refundAdditionalProfit * 100) / 100,
    refundAdditionalMargin: Math.round(refundAdditionalMargin * 100) / 100,
    totalAdditionalProfit: Math.round(totalAdditionalProfit * 100) / 100,
    totalAdditionalMargin: Math.round(totalAdditionalMargin * 100) / 100,
    totalReducedProfit: Math.round(totalReducedProfit * 100) / 100,
    totalReducedMargin: Math.round(totalReducedMargin * 100) / 100,
    cardPaymentCharges: Math.round(cardPaymentCharges * 100) / 100,
    rawProfit: Math.round(rawProfit * 100) / 100,
    potentialMargin: Math.round(potentialMargin * 100) / 100,
    agentCommissionRate,
    agentMargin: Math.round(agentMargin * 100) / 100,
    originalAgentMargin: Math.round(originalAgentMargin * 100) / 100,
    hasAgentPayout,
    actualOriginalPayout: Math.round(actualOriginalPayout * 100) / 100,
    actualAdditionalPayout: Math.round(actualAdditionalPayout * 100) / 100,
    actualAgentPayout: Math.round(actualAgentPayout * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    originalProfit: Math.round(originalProfit * 100) / 100,
  };
}

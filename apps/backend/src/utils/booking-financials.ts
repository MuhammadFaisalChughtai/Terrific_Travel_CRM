/**
 * Determines whether a transaction is a customer/client payment (inflow).
 * Excludes vendor payments, vendor refunds, agent payouts/commissions, and discounts.
 */
export function isCustomerTransaction(tx: any): boolean {
  if (!tx) return false;
  const methodLower = (tx.paymentMethod || tx.method || '').toLowerCase();
  if (
    methodLower.includes('vendor') ||
    methodLower.includes('discount') ||
    methodLower.includes('agent') ||
    methodLower.includes('payout')
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
    notesLower.includes('refund from vendor')
  ) {
    return false;
  }
  return true;
}

/**
 * Calculates customer paid amount, pending balance, and effective price for a booking.
 * Exactly aligns with the BookingManager financial overview logic.
 */
export function calculateCustomerPending(b: any): { clientPaid: number; pendingAmount: number; effectivePrice: number } {
  let clientPaid = 0;
  if (b.transactions && b.transactions.length > 0) {
    const clientTransactions = b.transactions.filter(isCustomerTransaction);
    clientPaid = clientTransactions.reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0);
  }

  if (clientPaid <= 0 && b.paidAmount > 0) {
    clientPaid = Number(b.paidAmount) || 0;
  }

  const totalPrice = Number(b.totalPrice) || 0;
  const pendingAmount = Math.max(0, Math.round((totalPrice - clientPaid) * 100) / 100);

  return {
    clientPaid: Math.round(clientPaid * 100) / 100,
    pendingAmount,
    effectivePrice: Math.round(totalPrice * 100) / 100,
  };
}

/**
 * Shared helper to calculate net profit, vendor cost, and agent margin for a single booking,
 * taking into account vendor costs, vendor refunds, client refunds, card payment charges,
 * and agent slab commissions.
 */
export function calculateBookingFinancials(b: any): { vendorCost: number; margin: number; netProfit: number } {
  const price = Number(b.totalPrice) || 0;
  let totalVendorCost = 0;
  if (b.bookingVendorPayments && b.bookingVendorPayments.length > 0) {
    totalVendorCost = b.bookingVendorPayments.reduce((sum: number, item: any) => sum + (Number(item.originalCost) || 0), 0);
  } else {
    const accommodationsCost = b.accommodations?.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0) || 0;
    const flightsCost = b.flightServices?.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0) || 0;
    const transportsCost = b.transportServices?.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0) || 0;
    const visasCost = b.visaServices?.reduce((sum: number, item: any) => sum + (Number(item.price) || 0), 0) || 0;
    const additionalCost = b.additionalServices?.reduce((sum: number, item: any) => sum + (Number(item.servicePrice) || 0), 0) || 0;
    totalVendorCost = accommodationsCost + flightsCost + transportsCost + visasCost + additionalCost;
  }

  const accommodationsRefund = b.accommodations?.reduce((sum: number, acc: any) => sum + (Number(acc.refundAmount) || 0), 0) || 0;
  const flightsRefund = b.flightServices?.reduce((sum: number, fs: any) => sum + (Number(fs.refundAmount) || 0), 0) || 0;
  const transportsRefund = b.transportServices?.reduce((sum: number, ts: any) => sum + (Number(ts.refundAmount) || 0), 0) || 0;
  const visasRefund = b.visaServices?.reduce((sum: number, vs: any) => sum + (Number(vs.refundAmount) || 0), 0) || 0;
  const totalVendorRefund = accommodationsRefund + flightsRefund + transportsRefund + visasRefund;

  const clientRefund = Number(b.refundAmount) || 0;
  const cardPaymentCharges = Number(b.cardPaymentCharges) || 0;

  const rawProfit = price - clientRefund - (totalVendorCost - totalVendorRefund) - cardPaymentCharges;

  let margin = 0.0;
  if (b.agent) {
    let slab = b.agent.slabs?.find(
      (s: any) => price >= s.minSales && (s.maxSales === null || price <= s.maxSales)
    );
    if (!slab && b.agent.slabs && b.agent.slabs.length > 0) {
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
    vendorCost: Math.round(totalVendorCost * 100) / 100,
    margin: Math.round(margin * 100) / 100,
    netProfit: Math.round((rawProfit - margin) * 100) / 100,
  };
}

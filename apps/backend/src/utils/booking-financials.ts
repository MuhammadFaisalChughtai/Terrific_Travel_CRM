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

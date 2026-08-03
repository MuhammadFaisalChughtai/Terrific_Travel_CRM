import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Booking-Transaction Reconciliation...");
  
  // Find all bookings with their transactions
  const bookings = await prisma.booking.findMany({
    include: {
      transactions: true,
    },
  });

  console.log(`Found ${bookings.length} bookings in the database.`);

  let updatedCount = 0;

  for (const booking of bookings) {
    // Calculate transaction total sum (excluding agent payouts since they are expenses and do not represent client payments)
    const clientTransactions = booking.transactions.filter(
      (tx) => tx.paymentMethod !== 'AGENT PAYOUT' && tx.paymentMethod !== 'AGENT_PAYOUT'
    );
    const transactionTotal = clientTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    
    // Check if there is a discrepancy with paidAmount
    const discrepancy = Math.abs(booking.paidAmount - transactionTotal);
    
    if (discrepancy > 0.01) {
      console.log(`--------------------------------------------------`);
      console.log(`Discrepancy found on Booking ID: ${booking.id}`);
      console.log(`Reference: ${booking.bookingReference}`);
      console.log(`Total Price (totalPrice): £${booking.totalPrice}`);
      console.log(`Current Client Received (paidAmount): £${booking.paidAmount}`);
      console.log(`Actual Transaction Sum (excluding agent payouts): £${transactionTotal}`);
      
      const newPaidAmount = transactionTotal;
      const newRemainingAmount = Math.max(0, (booking.totalPrice - booking.refundAmount) - newPaidAmount);
      
      // Recalculate paymentStatus
      let newPaymentStatus = 'UNPAID';
      let fullyPaidAt: Date | null = booking.fullyPaidAt;
      
      if (newRemainingAmount <= 0 && newPaidAmount > 0) {
        newPaymentStatus = 'PAID';
        fullyPaidAt = booking.fullyPaidAt || new Date();
      } else if (newPaidAmount > 0) {
        newPaymentStatus = 'PARTIALLY_PAID';
        fullyPaidAt = null;
      } else {
        newPaymentStatus = 'UNPAID';
        fullyPaidAt = null;
      }

      console.log(`Updating Booking:`);
      console.log(`  -> paidAmount: £${newPaidAmount}`);
      console.log(`  -> remainingAmount: £${newRemainingAmount}`);
      console.log(`  -> paymentStatus: ${newPaymentStatus}`);

      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          paymentStatus: newPaymentStatus,
          fullyPaidAt: fullyPaidAt,
        },
      });

      updatedCount++;
    }
  }

  console.log(`--------------------------------------------------`);
  console.log(`Reconciliation finished. Updated ${updatedCount} bookings.`);
}

main()
  .catch((err) => {
    console.error("Reconciliation failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

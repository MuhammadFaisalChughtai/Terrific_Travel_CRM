import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const vendor = await prisma.vendor.findFirst({
    where: { name: { contains: 'Brightsun', mode: 'insensitive' } }
  });
  if (!vendor) {
    console.log('Vendor not found');
    return;
  }
  console.log('Vendor Found:', vendor.id, vendor.name);

  // Get BookingVendorPayment counts and sums
  const payments = await prisma.bookingVendorPayment.findMany({
    where: { vendorId: vendor.id }
  });

  console.log('Total records:', payments.length);
  console.log('Outstanding sums by status:');
  for (const status of ['PENDING', 'PARTIAL', 'PAID']) {
    const subset = payments.filter(p => p.status === status);
    const sumRemaining = subset.reduce((sum, p) => sum + p.remainingBalance, 0);
    const sumPaid = subset.reduce((sum, p) => sum + p.amountPaid, 0);
    const sumCost = subset.reduce((sum, p) => sum + p.originalCost, 0);
    console.log(`- ${status}: count=${subset.length}, sumOriginalCost=${sumCost}, sumAmountPaid=${sumPaid}, sumRemainingBalance=${sumRemaining}`);
  }

  // Get latest ledger entry runningBalance
  const latestLedger = await prisma.vendorLedger.findFirst({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Latest ledger runningBalance:', latestLedger?.runningBalance);
}

main().catch(console.error).finally(() => prisma.$disconnect());

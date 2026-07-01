import { prisma } from './src/config';

async function main() {
  const bookings = await prisma.booking.findMany({
    include: {
      bookingVendorPayments: true,
      agent: true
    }
  });

  for (const b of bookings) {
    console.log(`Booking ${b.bookingReference} (id: ${b.id}):`);
    console.log(`  Paid Amount: ${b.paidAmount}`);
    console.log(`  Vendor Payments:`, b.bookingVendorPayments.map(vp => ({
      id: vp.id,
      amountPaid: vp.amountPaid,
      status: vp.status
    })));
  }

  const rawTest = await prisma.$queryRaw`
    SELECT 
        b.id,
        b."paidAmount",
        vp."totalVendorCost"
      FROM "Booking" b
      LEFT JOIN (
        SELECT "bookingId", SUM("amountPaid") as "totalVendorCost"
        FROM "BookingVendorPayment"
        GROUP BY "bookingId"
      ) vp ON vp."bookingId" = b.id
  `;
  console.log('Raw SQL test:', rawTest);
}

main().finally(() => prisma.$disconnect());

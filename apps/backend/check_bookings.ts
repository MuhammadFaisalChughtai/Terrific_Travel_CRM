import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const month = 7;
  const year = 2026;

  console.log(`Checking bookings for ${month}/${year}`);

  const bookings = await prisma.booking.findMany({
    where: {
      agentId: { not: null },
    },
    include: {
      bookingVendorPayments: true,
    }
  });

  for (const b of bookings) {
    const createdAtMonth = b.createdAt.getMonth() + 1;
    const createdAtYear = b.createdAt.getFullYear();
    
    console.log(`Booking ${b.bookingReference}: createdAt=${createdAtMonth}/${createdAtYear}, paymentStatus=${b.paymentStatus}, status=${b.status}`);
    console.log(`  agentId=${b.agentId}`);
    
    const unpaidVendors = b.bookingVendorPayments.filter(vp => vp.status !== 'PAID');
    console.log(`  unpaidVendors: ${unpaidVendors.length}`);
    for (const uv of unpaidVendors) {
      console.log(`    - vendor payment: id=${uv.id}, status=${uv.status}, remaining=${uv.remainingBalance}`);
    }
  }

  // Also let's run the exact raw query
  const eligibleBookingsRaw: any[] = await prisma.$queryRaw`
      SELECT 
        b."agentId",
        COUNT(b.id)::int as "bookingCount",
        array_agg(b.id) as "bookingIds",
        SUM(b."paidAmount" - COALESCE(vp."totalVendorCost", 0))::float as "totalProfit"
      FROM "Booking" b
      LEFT JOIN (
        SELECT "bookingId", SUM("amountPaid") as "totalVendorCost"
        FROM "BookingVendorPayment"
        GROUP BY "bookingId"
      ) vp ON vp."bookingId" = b.id
      WHERE b."agentId" IS NOT NULL
        AND b.status != 'CANCELLED'
        AND b."paymentStatus" = 'PAID'
        AND EXTRACT(MONTH FROM b."createdAt") = ${month}
        AND EXTRACT(YEAR FROM b."createdAt") = ${year}
        AND NOT EXISTS (
          SELECT 1 FROM "BookingVendorPayment" bvp2 
          WHERE bvp2."bookingId" = b.id AND bvp2.status != 'PAID'
        )
      GROUP BY b."agentId"
    `;
    
  console.log('Raw Query Result:', eligibleBookingsRaw);

  process.exit(0);
}

check();

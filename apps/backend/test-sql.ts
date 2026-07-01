import { prisma } from './src/config';

async function main() {
  const month = 6;
  const year = 2026;
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

    console.log(eligibleBookingsRaw);
}

main().finally(() => prisma.$disconnect());

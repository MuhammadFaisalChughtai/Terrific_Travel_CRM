const { prisma } = require('./src/config');

async function main() {
  const nullCount = await prisma.booking.count({
    where: { bookingDate: null }
  });
  console.log(`Number of bookings with null bookingDate: ${nullCount}`);

  if (nullCount > 0) {
    const updated = await prisma.$executeRaw`
      UPDATE "Booking"
      SET "bookingDate" = "createdAt"
      WHERE "bookingDate" IS NULL
    `;
    console.log(`Successfully updated ${updated} bookings.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

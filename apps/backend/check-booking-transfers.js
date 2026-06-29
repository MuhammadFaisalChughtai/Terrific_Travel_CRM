const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.findFirst({
    where: { bookingReference: 'TT00963' },
    include: {
      transportServices: {
        include: { vendor: true }
      }
    }
  });
  console.log("Booking found:", booking ? "Yes" : "No");
  if (booking) {
    console.log("Booking Reference:", booking.bookingReference);
    console.log("Transport Services:");
    for (const ts of booking.transportServices) {
      console.log({
        id: ts.id,
        vehicleType: ts.vehicleType,
        departureDestination: ts.departureDestination,
        arrivalDestination: ts.arrivalDestination,
        date: ts.date,
        departureTime: ts.departureTime,
        arrivalTime: ts.arrivalTime,
        flightNo: ts.flightNo,
        price: ts.price
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

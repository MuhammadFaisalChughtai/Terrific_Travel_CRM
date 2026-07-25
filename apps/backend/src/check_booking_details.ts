import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://tms_user:tms_password@84.247.128.101:5432/tms_db?schema=public'
      }
    }
  });

  const refs = ['TT00948', 'TT00962', 'TT00846', 'TT00987', 'TT00986'];
  for (const ref of refs) {
    const b = await prisma.booking.findUnique({
      where: { bookingReference: ref },
      include: {
        passengers: true,
        flightServices: { where: { vendorId: '5' } },
        bookingVendorPayments: { where: { vendorId: '5' } }
      }
    });

    if (b) {
      console.log(`\n=================== ${ref} ===================`);
      console.log(`Booking Ref: ${b.bookingReference} | Status: ${b.status}`);
      console.log('Passengers:');
      for (const p of b.passengers) {
        console.log(`  - ${p.title} ${p.firstName} ${p.lastName}`);
      }
      console.log('Polani Flight Services:');
      for (const fs of b.flightServices) {
        console.log(`  - ID: ${fs.id} | PNR: ${fs.pnr} | Price: ${fs.price} | Status: ${fs.status}`);
      }
      console.log('Polani BookingVendorPayment:');
      for (const bvp of b.bookingVendorPayments) {
        console.log(`  - ID: ${bvp.id} | Cost: ${bvp.originalCost} | Paid: ${bvp.amountPaid} | Remaining: ${bvp.remainingBalance} | Status: ${bvp.status}`);
      }
    }
  }

  await prisma.$disconnect();
}

main();

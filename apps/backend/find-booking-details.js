const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://tms_user:tms_password@localhost:5432/tms_db?schema=public'
    }
  }
});

async function main() {
  const booking = await prisma.booking.findFirst({
    where: {
      totalPrice: 13195.00
    },
    include: {
      agent: {
        include: {
          slabs: true
        }
      },
      accommodations: {
        include: {
          vendor: true
        }
      },
      flightServices: {
        include: {
          vendor: true
        }
      },
      transportServices: {
        include: {
          vendor: true
        }
      },
      visaServices: {
        include: {
          vendor: true
        }
      },
      additionalServices: {
        include: {
          vendor: true
        }
      },
      bookingVendorPayments: {
        include: {
          vendor: true
        }
      },
      vendorLedgers: true
    }
  });

  if (!booking) {
    console.log('No booking found with totalPrice 13195.00');
    // Let's try searching for Pullman zam zam
    const pullmanHotel = await prisma.accommodationService.findFirst({
      where: {
        hotelName: {
          contains: 'Pullman',
          mode: 'insensitive'
        }
      }
    });
    if (pullmanHotel) {
      console.log('Found hotel:', pullmanHotel);
    }
    return;
  }

  console.log('--- BOOKING ---');
  console.log('ID:', booking.id);
  console.log('Reference:', booking.bookingReference);
  console.log('Total Price:', booking.totalPrice);
  console.log('Paid Amount:', booking.paidAmount);
  console.log('Agent:', booking.agent);
  
  console.log('--- ACCOMMODATIONS ---');
  console.log(booking.accommodations.map(acc => ({
    id: acc.id,
    hotelName: acc.hotelName,
    price: acc.price,
    vendorId: acc.vendorId,
    vendorName: acc.vendor?.name
  })));

  console.log('--- BOOKING VENDOR PAYMENTS ---');
  console.log(booking.bookingVendorPayments.map(vp => ({
    id: vp.id,
    vendorId: vp.vendorId,
    vendorName: vp.vendor?.name,
    amount: vp.amount,
    originalCost: vp.originalCost,
    remainingAmount: vp.remainingAmount
  })));

  console.log('--- VENDOR LEDGERS ---');
  console.log(booking.vendorLedgers.map(vl => ({
    id: vl.id,
    vendorName: vl.vendorName,
    amount: vl.amount,
    type: vl.type,
    bookingReference: vl.bookingReference
  })));
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { BookingsService } from './apps/backend/src/services/bookings.service';
import { prisma } from './apps/backend/src/config';

async function main() {
  const service = new BookingsService();
  try {
    const data = {
      agentId: null,
      departureDate: "2026-06-20T00:00:00.000Z",
      totalPrice: 1500,
      status: "PENDING"
    };
    
    // Grab any user ID
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");

    const result = await service.create(user.id, data);
    console.log("Success:", result.id);
  } catch (e: any) {
    console.error("Error encountered:", e.message);
    console.error(e.stack);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();

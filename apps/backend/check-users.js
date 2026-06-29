const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
      agent: true,
    },
  });
  console.log('USERS IN DB:');
  console.log(JSON.stringify(users.map(u => ({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    agentId: u.agentId,
    agentName: u.agent ? u.agent.name : null,
    roles: u.userRoles.map((ur) => ur.role.name),
  })), null, 2));

  const bookings = await prisma.booking.findMany({
    take: 10,
    include: {
      agent: true,
      user: true,
    }
  });
  console.log('\nRECENT BOOKINGS:');
  console.log(JSON.stringify(bookings.map(b => ({
    id: b.id,
    ref: b.bookingReference,
    createdById: b.createdById,
    userId: b.userId,
    agentId: b.agentId,
    agentName: b.agent ? b.agent.name : null,
    createdByUser: b.user ? b.user.email : null,
  })), null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

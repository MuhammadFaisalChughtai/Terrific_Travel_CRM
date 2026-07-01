const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const notifs = await prisma.notification.findMany();
  console.log("All Notifications in DB:", notifs);

  const users = await prisma.user.findMany({
    where: {
      userRoles: {
        some: {
          role: { name: { in: ['ADMIN', 'SUPER_ADMIN'] } }
        }
      }
    },
    include: { userRoles: { include: { role: true } } }
  });

  console.log("Admins found:", users.map(u => ({ id: u.id, email: u.email, roles: u.userRoles.map(r => r.role.name) })));
}

main().catch(console.error).finally(() => prisma.$disconnect());

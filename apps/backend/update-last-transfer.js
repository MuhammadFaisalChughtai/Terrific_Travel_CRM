const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.transportService.update({
    where: { id: '53d8c7ac-4e9c-44ac-a677-f33968bfbf57' },
    data: {
      departureTime: '22:40',
      arrivalTime: ''
    }
  });
  console.log("Update result:", result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

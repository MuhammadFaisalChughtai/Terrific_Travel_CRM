const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const template = await prisma.documentTemplate.findUnique({
    where: { templateType: 'TRANSPORT_VOUCHER' }
  });
  console.log("Template HTML length:", template?.htmlContent?.length);
  console.log("Template HTML content:");
  console.log(template?.htmlContent);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Updating document templates in database to full HTML + CSS defaults...");
  const { templatesService } = require('./dist/src/services/templates.service');
  
  const keys = ['BOOKING_INVOICE', 'FLIGHT_TICKET', 'HOTEL_VOUCHER', 'TRANSPORT_VOUCHER', 'VISA_INVOICE', 'SPECIAL_SERVICES'];
  for (const key of keys) {
    console.log(`Resetting template to default: ${key}`);
    await templatesService.resetToDefault(key, 'SYSTEM_SEEDED_V2');
  }
  console.log("All templates updated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

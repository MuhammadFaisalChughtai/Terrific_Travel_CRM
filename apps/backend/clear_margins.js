const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { url: 'postgresql://tms_user:tms_password@localhost:5432/tms_db?schema=public' } 
  } 
});

async function clear() {
  await prisma.agentMargin.deleteMany({});
  console.log("Cleared AgentMargin table.");
}

clear().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });

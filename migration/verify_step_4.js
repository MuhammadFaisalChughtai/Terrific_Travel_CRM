process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://tms_user:tms_password@localhost:5432/tms_db?schema=public';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Verifying passenger user accounts in CRM for missing bookings...');
    
    // Get unique lead passengers from staging table for missing bookings
    const missingPassengers = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT "lead_passenger"
      FROM "StagingPolaniLedger"
      WHERE "reconciliation_status" = 'Missing in DB';
    `);
    
    console.log(`Found ${missingPassengers.length} unique lead passengers in missing bookings.`);
    
    let matchedCount = 0;
    let unmatchedList = [];
    
    for (const p of missingPassengers) {
      const name = p.lead_passenger;
      if (!name) continue;
      
      // Search for matching user in CRM
      const userMatch = await prisma.$queryRawUnsafe(`
        SELECT id, email, "firstName", "lastName"
        FROM "User"
        WHERE UPPER("firstName" || ' ' || "lastName") = UPPER($1)
           OR UPPER("lastName" || ' ' || "firstName") = UPPER($1)
        LIMIT 1;
      `, name);
      
      if (userMatch && userMatch.length > 0) {
        matchedCount++;
      } else {
        unmatchedList.push(name);
      }
    }
    
    console.log(`\n--- Verification Results ---`);
    console.log(`- Matched Customers: ${matchedCount}`);
    console.log(`- Unmatched Customers (will default to customer@tms.com): ${unmatchedList.length}`);
    
    if (unmatchedList.length > 0) {
      console.log('\nUnmatched passengers list:');
      console.log(unmatchedList);
    }
    
  } catch (e) {
    console.error('Error during verification:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();

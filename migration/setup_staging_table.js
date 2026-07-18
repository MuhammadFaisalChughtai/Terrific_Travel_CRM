process.env.DATABASE_URL = 'postgresql://tms_user:tms_password@localhost:5432/tms_db?schema=public';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log('Creating StagingPolaniLedger table in the database...');
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "StagingPolaniLedger" (
          "excel_row" VARCHAR(50),
          "folder_no" VARCHAR(50),
          "pnr" VARCHAR(50),
          "lead_passenger" VARCHAR(255),
          "excel_travel_date" VARCHAR(50),
          "excel_inv_date" VARCHAR(50),
          "excel_inv_amount" NUMERIC(10, 2),
          "excel_receipt" VARCHAR(50),
          "excel_folder_status" VARCHAR(50),
          "db_ref" VARCHAR(50),
          "db_booking_date" VARCHAR(50),
          "db_travel_date" VARCHAR(50),
          "db_vendor" VARCHAR(255),
          "db_cost" NUMERIC(10, 2),
          "db_paid" NUMERIC(10, 2),
          "db_status" VARCHAR(50),
          "reconciliation_status" VARCHAR(100)
      );
    `);
    
    console.log('StagingPolaniLedger table created successfully!');
  } catch (e) {
    console.error('Error creating staging table:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();

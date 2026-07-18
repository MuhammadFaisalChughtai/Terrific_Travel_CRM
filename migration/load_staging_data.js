process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://tms_user:tms_password@localhost:5432/tms_db?schema=public';
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

const parseCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};

async function run() {
  try {
    let csvPath = 'polani_reconciliation_with_dates.csv';
    if (!fs.existsSync(csvPath)) {
      csvPath = 'e:/Terrific-Travel_TMS/polani_reconciliation_with_dates.csv';
    }
    console.log(`Reading CSV file from ${csvPath}...`);
    
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n');
    const headers = parseCsvLine(lines[0].trim());
    
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const vals = parseCsvLine(line);
      const record = {};
      headers.forEach((h, idx) => {
        record[h] = vals[idx];
      });
      rows.push(record);
    }
    
    console.log(`Parsed ${rows.length} rows from CSV. Clearing staging table...`);
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "StagingPolaniLedger";');
    
    console.log('Loading rows into StagingPolaniLedger...');
    
    // Batch insert rows
    for (const r of rows) {
      const invAmt = parseFloat(r['Excel Inv Amount']);
      const dbCost = parseFloat(r['DB Cost']);
      const dbPaid = parseFloat(r['DB Paid']);
      
      await prisma.$executeRawUnsafe(`
        INSERT INTO "StagingPolaniLedger" (
          "excel_row", "folder_no", "pnr", "lead_passenger", 
          "excel_travel_date", "excel_inv_date", "excel_inv_amount", 
          "excel_receipt", "excel_folder_status", "db_ref", 
          "db_booking_date", "db_travel_date", "db_vendor", 
          "db_cost", "db_paid", "db_status", "reconciliation_status"
        ) VALUES (
          $1, $2, $3, $4, 
          $5, $6, $7, 
          $8, $9, $10, 
          $11, $12, $13, 
          $14, $15, $16, $17
        )
      `,
        r['Excel Row'] || '', r['Folder No'] || '', r['PNR'] || '', r['Lead Passenger'] || '',
        r['Excel Travel Date'] || '', r['Excel Inv Date'] || '', isNaN(invAmt) ? null : invAmt,
        r['Excel Receipt'] || '', r['Excel Folder Status'] || '', r['DB Ref'] || '',
        r['DB Booking Date'] || '', r['DB Travel Date'] || '', r['DB Vendor'] || '',
        isNaN(dbCost) ? null : dbCost, isNaN(dbPaid) ? null : dbPaid, r['DB Status'] || '', r['Reconciliation Status'] || ''
      );
    }
    
    console.log('Data loaded successfully into StagingPolaniLedger!');
  } catch (e) {
    console.error('Error loading data into staging table:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();

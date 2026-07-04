const fs = require('fs');

const content = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_latest.sql', 'utf8');
const lines = content.split('\n');

// Bookings missing from CRM (visible in screenshot gap TT00965 to TT00974)
// Plus include all from remaining_bookings.sql targets
const targetRefs = new Set([
  'TT00965','TT00966','TT00967','TT00968','TT00969','TT00970',
  'TT00971','TT00972','TT00973','TT00974'
]);

let outSql = `-- Fix: Restore bookings TT00965-TT00974 from tms_db_latest.sql\n\n`;

let inBooking = false;
let bookingCols = [];
const backupIdToRef = {};

for (const line of lines) {
  if (line.startsWith('INSERT INTO "Booking"')) {
    inBooking = true;
    const match = line.match(/\(([^)]+)\)/);
    if (match) bookingCols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
    continue;
  }
  if (inBooking) {
    if (line.trim() === '' || line.trim() === ');') continue;
    if (line.trim().startsWith('(')) {
      const trimmed = line.trim();
      let inner;
      if (trimmed.endsWith(');')) inner = trimmed.slice(1, -2);
      else if (trimmed.endsWith('),')) inner = trimmed.slice(1, -2);
      else inner = trimmed.slice(1, -1);
      const parsedVals = inner.split(/,\t/);

      if (parsedVals.length === bookingCols.length) {
        const bookingData = {};
        for (let i = 0; i < bookingCols.length; i++) bookingData[bookingCols[i]] = parsedVals[i];

        const ref = bookingData['bookingReference'].replace(/'/g, '');
        if (targetRefs.has(ref)) {
          backupIdToRef[bookingData['id'].replace(/'/g, '')] = ref;

          const allCols = bookingCols.map(c => `"${c}"`).join(', ');
          const allVals = parsedVals.join(',\t');
          // Build correct UPDATE SET from actual parsed values
          const updateSets = bookingCols
            .filter(c => c !== 'id' && c !== 'bookingReference')
            .map(c => {
              const idx = bookingCols.indexOf(c);
              return `"${c}" = ${parsedVals[idx]}`;
            })
            .join(', ');

          // DO $$ block: UPDATE if exists (preserves UUID/payments), INSERT if missing
          outSql += `DO $$ BEGIN\n`;
          outSql += `  UPDATE "Booking" SET ${updateSets} WHERE "bookingReference" = '${ref}';\n`;
          outSql += `  IF NOT FOUND THEN\n`;
          outSql += `    INSERT INTO "Booking" (${allCols}) VALUES (${allVals});\n`;
          outSql += `  END IF;\n`;
          outSql += `END $$;\n\n`;
        }
      }
    }
    if (line.trim().endsWith(';')) inBooking = false;
  }
}

// Now child records for those bookings
const refList = [...targetRefs].map(r => `'${r}'`).join(', ');
const childSubQuery = `(SELECT "id" FROM "Booking" WHERE "bookingReference" IN (${refList}))`;

outSql += `-- Clear old child records\n`;
outSql += `DELETE FROM "Passenger" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "FlightService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "TransportService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "AccommodationService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "VisaService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "BookingTransaction" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "BookingVendorPayment" WHERE "bookingId" IN ${childSubQuery};\n\n`;

// Insert child records from latest
const childTables = ['Passenger','FlightService','TransportService','AccommodationService','VisaService','BookingTransaction','BookingVendorPayment'];
const backupIds = new Set(Object.keys(backupIdToRef));

for (const table of childTables) {
  let inTable = false;
  let cols = [];
  let bIdIndex = -1;
  let tableRows = [];

  for (const line of lines) {
    if (line.startsWith(`INSERT INTO "${table}"`)) {
      inTable = true;
      const match = line.match(/\(([^)]+)\)/);
      if (match) {
        cols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
        bIdIndex = cols.indexOf('bookingId');
      }
      continue;
    }
    if (inTable) {
      if (line.trim() === '' || line.trim() === ');') continue;
      if (line.trim().startsWith('(')) {
        const trimmed = line.trim();
        let inner;
        if (trimmed.endsWith(');')) inner = trimmed.slice(1, -2);
        else if (trimmed.endsWith('),')) inner = trimmed.slice(1, -2);
        else inner = trimmed.slice(1, -1);
        const parsedVals = inner.split(/,\t/);

        if (bIdIndex !== -1 && parsedVals.length > bIdIndex) {
          const rowBId = parsedVals[bIdIndex].replace(/'/g, '');
          if (backupIds.has(rowBId)) {
            const ref = backupIdToRef[rowBId];
            parsedVals[bIdIndex] = `(SELECT "id" FROM "Booking" WHERE "bookingReference" = '${ref}' LIMIT 1)`;
            tableRows.push(`(${parsedVals.join(',\t')}),`);
          }
        }
      }
      if (line.trim().endsWith(';')) inTable = false;
    }
  }

  if (tableRows.length > 0) {
    tableRows[tableRows.length - 1] = tableRows[tableRows.length - 1].replace(/,$/, ';');
    outSql += `\nINSERT INTO "${table}" ("${cols.join('", "')}") VALUES\n`;
    outSql += tableRows.join('\n') + '\n';
  }
}

fs.writeFileSync('e:/Terrific-Travel_TMS/restore_gap_bookings.sql', outSql);
console.log('Done! restore_gap_bookings.sql generated.');
console.log(`Bookings covered: ${Object.keys(backupIdToRef).length}`);
console.log('Refs:', Object.values(backupIdToRef).sort().join(', '));

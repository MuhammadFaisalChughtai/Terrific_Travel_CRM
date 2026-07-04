const fs = require('fs');

const content = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8');
const lines = content.split('\n');

const targetRefs = ['TT00925', 'TT00943', 'TT00970', 'TT00929', 'TT00924', 'TT00972', 'TT00963', 'TT00964', 'TT00939', 'TT00905', 'TT00971', 'TT00973', 'TT00957', 'TT00967', 'TT00966', 'TT00969', 'TT00912', 'TT00959', 'TT00640', 'TT00641', 'TT00645', 'TT00883', 'TT00933', 'TT00968', 'TT00945', 'TT00803', 'TT00934', 'TT00936', 'TT00944', 'TT00958', 'TT00960'];

let outSql = `-- Surgical fix for Bookings (safe - no booking deletion, payments untouched)\n\n`;

// Parse Booking inserts to create UPDATEs
// Map: backupUUID -> bookingReference (so we can remap child records)
let inBooking = false;
let bookingCols = [];
const backupIdToRef = {};   // backup UUID -> TT00xxx
const refToBackupId = {};   // TT00xxx -> backup UUID

for (const line of lines) {
  if (line.startsWith('INSERT INTO "Booking"')) {
    inBooking = true;
    const match = line.match(/\(([^)]+)\)/);
    if (match) {
      bookingCols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
    }
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
      let parsedVals = inner.split(/,\t/);

      if (parsedVals.length === bookingCols.length) {
        let bookingData = {};
        for (let i = 0; i < bookingCols.length; i++) {
          bookingData[bookingCols[i]] = parsedVals[i];
        }

        const ref = bookingData['bookingReference'].replace(/'/g, '');
        if (targetRefs.includes(ref)) {
          const backupId = bookingData['id'].replace(/'/g, '');
          backupIdToRef[backupId] = ref;
          refToBackupId[ref] = backupId;

          // UPSERT: INSERT if missing, UPDATE if exists - safe for both cases
          const allCols = bookingCols.map(c => `"${c}"`).join(', ');
          const allVals = parsedVals.join(',\t');
          let updateSets = [];
          for (let i = 0; i < bookingCols.length; i++) {
            if (bookingCols[i] !== 'id' && bookingCols[i] !== 'bookingReference') {
              updateSets.push(`"${bookingCols[i]}" = EXCLUDED."${bookingCols[i]}"`);
            }
          }
          outSql += `INSERT INTO "Booking" (${allCols}) VALUES (${allVals}) ON CONFLICT ("bookingReference") DO UPDATE SET ${updateSets.join(', ')};\n`;
        }
      }
    }

    if (line.trim().endsWith(';')) {
      inBooking = false;
    }
  }
}

if (Object.keys(backupIdToRef).length === 0) {
  console.log("No bookings found!");
  process.exit(1);
}

const refList = targetRefs.map(r => `'${r}'`).join(', ');

outSql += `\n-- Delete corrupted child records (by bookingReference lookup)\n`;
const childSubQuery = `(SELECT "id" FROM "Booking" WHERE "bookingReference" IN (${refList}))`;
outSql += `DELETE FROM "Passenger" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "FlightService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "TransportService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "AccommodationService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "VisaService" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "BookingTransaction" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `DELETE FROM "BookingVendorPayment" WHERE "bookingId" IN ${childSubQuery};\n`;
outSql += `\n-- Insert fresh child records (bookingId replaced with live DB lookup by bookingReference)\n`;

// Parse child tables - replace backup UUID with a subquery to look up the live UUID
const childTables = ['Passenger', 'FlightService', 'TransportService', 'AccommodationService', 'VisaService', 'BookingTransaction', 'BookingVendorPayment'];

for (const table of childTables) {
  let inTable = false;
  let tableRows = [];
  let cols = [];
  let bIdIndex = -1;

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
        const trimmed2 = line.trim();
        let inner2;
        if (trimmed2.endsWith(');')) inner2 = trimmed2.slice(1, -2);
        else if (trimmed2.endsWith('),')) inner2 = trimmed2.slice(1, -2);
        else inner2 = trimmed2.slice(1, -1);
        let parsedVals = inner2.split(/,\t/);

        if (bIdIndex !== -1 && parsedVals.length > bIdIndex) {
          const rowBId = parsedVals[bIdIndex].replace(/'/g, '');
          if (backupIdToRef[rowBId]) {
            const ref = backupIdToRef[rowBId];
            // Replace the hardcoded backup bookingId with a live subquery
            parsedVals[bIdIndex] = `(SELECT "id" FROM "Booking" WHERE "bookingReference" = '${ref}' LIMIT 1)`;
            const rowStr = `(${parsedVals.join(',\t')})`;
            tableRows.push(rowStr + ',');
          }
        }
      }

      if (line.trim().endsWith(';')) {
        inTable = false;
      }
    }
  }

  if (tableRows.length > 0) {
    tableRows[tableRows.length - 1] = tableRows[tableRows.length - 1].replace(/,$/, ';');
    outSql += `\nINSERT INTO "${table}" ("${cols.join('", "')}") VALUES\n`;
    outSql += tableRows.join('\n') + '\n';
  }
}

fs.writeFileSync('e:/Terrific-Travel_TMS/surgical_fix.sql', outSql);
console.log('Done! surgical_fix.sql generated.');
console.log(`Bookings covered: ${Object.keys(backupIdToRef).length}`);

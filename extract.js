const fs = require('fs');
const content = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8');
const lines = content.split('\n');
const refs = new Set();
let inBookingInsert = false;
for (const line of lines) {
  if (line.startsWith('INSERT INTO "Booking"')) {
    inBookingInsert = true;
    continue;
  }
  if (inBookingInsert) {
    if (line.trim() === '') continue;
    const match = line.match(/'(TT\d+)'/);
    if (match) {
      refs.add(match[1]);
    }
    if (line.trim().endsWith(';')) {
      inBookingInsert = false;
    }
  }
}
console.log('DELETE FROM "Booking" WHERE "bookingReference" IN (' + Array.from(refs).map(r => `'${r}'`).join(', ') + ');');

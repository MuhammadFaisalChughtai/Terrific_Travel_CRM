const fs = require('fs');

// Extract all TT refs that have actual INSERT INTO "Booking" rows in tms_db_remaining_bookings.sql
const content = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8');
const lines = content.split('\n');

let inBooking = false;
let bookingCols = [];
const found = [];

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
      const vals = inner.split(/,\t/);
      if (vals.length === bookingCols.length) {
        const refIdx = bookingCols.indexOf('bookingReference');
        if (refIdx !== -1) found.push(vals[refIdx].replace(/'/g, ''));
      }
    }
    if (line.trim().endsWith(';')) inBooking = false;
  }
}

const sorted = found.sort();
console.log('All booking refs in tms_db_remaining_bookings.sql:');
console.log(sorted.join(', '));
console.log(`\nTotal: ${sorted.length}`);

// Find numeric gaps
const nums = sorted.map(r => parseInt(r.replace('TT', '')));
const min = Math.min(...nums);
const max = Math.max(...nums);
const numSet = new Set(nums);
const gaps = [];
for (let i = min; i <= max; i++) {
  if (!numSet.has(i)) gaps.push('TT' + String(i).padStart(5, '0'));
}
console.log('\nGaps within the range of this file:');
console.log(gaps.length ? gaps.join(', ') : 'None');

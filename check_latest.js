const fs = require('fs');

const content = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_latest.sql', 'utf8');
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

const sorted = [...new Set(found)].sort();
const nums = sorted.map(r => parseInt(r.replace('TT', '')));
const min = Math.min(...nums);
const max = Math.max(...nums);
const numSet = new Set(nums);

// Find what's missing between 640 and 974 in tms_db_latest.sql
const latestSet = new Set(sorted);
const missing = [];
for (let i = 640; i <= 974; i++) {
  const ref = 'TT' + String(i).padStart(5, '0');
  if (!latestSet.has(ref)) missing.push(ref);
}

console.log(`tms_db_latest.sql has ${sorted.length} bookings from TT${String(min).padStart(5,'0')} to TT${String(max).padStart(5,'0')}`);
console.log('\nMissing from tms_db_latest.sql (TT00640-TT00974):');
console.log(missing.length ? missing.join(', ') : 'None - all present!');
console.log(`\nMissing count: ${missing.length}`);

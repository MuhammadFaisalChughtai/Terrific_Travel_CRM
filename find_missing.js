const fs = require('fs');

// Extract all TT refs from a file
function extractRefs(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/TT\d{5}/g) || [];
  return new Set(matches);
}

const latestRefs  = extractRefs('e:/Terrific-Travel_TMS/tms_db_latest.sql');
const remainingRefs = extractRefs('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql');
const allRefs = new Set([...latestRefs, ...remainingRefs]);

// Find missing refs between TT00665 and TT00974
const missing = [];
for (let i = 665; i <= 974; i++) {
  const ref = 'TT' + String(i).padStart(5, '0');
  if (!allRefs.has(ref)) {
    missing.push(ref);
  }
}

console.log('=== Missing bookings between TT00665 and TT00974 ===');
console.log(missing.join(', '));
console.log(`\nTotal missing: ${missing.length}`);

// Also show what IS in the remaining_bookings file for context
const remainingList = [...remainingRefs]
  .filter(r => /^TT\d{5}$/.test(r))
  .sort();
console.log('\n=== In tms_db_remaining_bookings.sql ===');
console.log(remainingList.join(', '));

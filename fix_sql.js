const fs = require('fs');
let sql = fs.readFileSync('e:/Terrific-Travel_TMS/surgical_fix.sql', 'utf8');
// Fix stray ) before WHERE in UPDATE statements (both id and bookingReference variants)
sql = sql.replace(/\) WHERE "bookingReference"/g, ' WHERE "bookingReference"');
sql = sql.replace(/\) WHERE "id"/g, ' WHERE "id"');
fs.writeFileSync('e:/Terrific-Travel_TMS/surgical_fix.sql', sql);
console.log('Fixed!');

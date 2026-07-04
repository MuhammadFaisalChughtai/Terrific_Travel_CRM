const fs = require('fs');

// The 10 target booking refs
const targetRefs = new Set([
  'TT00965','TT00966','TT00967','TT00968','TT00969','TT00970',
  'TT00971','TT00972','TT00973','TT00974'
]);

// Step 1: Extract userIds, agentIds, assignedToIds, createdByIds from gap bookings in tms_db_latest.sql
const latestContent = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_latest.sql', 'utf8');
const latestLines = latestContent.split('\n');

let inBooking = false;
let bookingCols = [];
const neededUserIds = new Set();

for (const line of latestLines) {
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
        const data = {};
        for (let i = 0; i < bookingCols.length; i++) data[bookingCols[i]] = vals[i];
        const ref = (data['bookingReference'] || '').replace(/'/g, '');
        if (targetRefs.has(ref)) {
          for (const col of ['userId','assignedToId','createdById']) {
            const v = (data[col] || 'NULL').replace(/'/g, '');
            if (v && v !== 'NULL') neededUserIds.add(v);
          }
        }
      }
    }
    if (line.trim().endsWith(';')) inBooking = false;
  }
}

console.log('Needed user IDs:', [...neededUserIds]);

// Step 2: Find those users in tms_db_remaining_bookings.sql (most up-to-date user data)
const remainingContent = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8');
const remainingLines = remainingContent.split('\n');

let inUser = false;
let userCols = [];
const userRows = {};

for (const line of remainingLines) {
  if (line.startsWith('INSERT INTO "User"')) {
    inUser = true;
    const match = line.match(/\(([^)]+)\)/);
    if (match) userCols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
    continue;
  }
  if (inUser) {
    if (line.trim() === '' || line.trim() === ');') continue;
    if (line.trim().startsWith('(')) {
      const trimmed = line.trim();
      let inner;
      if (trimmed.endsWith(');')) inner = trimmed.slice(1, -2);
      else if (trimmed.endsWith('),')) inner = trimmed.slice(1, -2);
      else inner = trimmed.slice(1, -1);
      const vals = inner.split(/,\t/);
      if (vals.length === userCols.length) {
        const idIdx = userCols.indexOf('id');
        const userId = vals[idIdx].replace(/'/g, '');
        if (neededUserIds.has(userId)) {
          userRows[userId] = { cols: userCols, vals };
        }
      }
    }
    if (line.trim().endsWith(';')) inUser = false;
  }
}

// Also check tms_db_latest.sql for any missing users
inUser = false;
userCols = [];
for (const line of latestLines) {
  if (line.startsWith('INSERT INTO "User"')) {
    inUser = true;
    const match = line.match(/\(([^)]+)\)/);
    if (match) userCols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
    continue;
  }
  if (inUser) {
    if (line.trim() === '' || line.trim() === ');') continue;
    if (line.trim().startsWith('(')) {
      const trimmed = line.trim();
      let inner;
      if (trimmed.endsWith(');')) inner = trimmed.slice(1, -2);
      else if (trimmed.endsWith('),')) inner = trimmed.slice(1, -2);
      else inner = trimmed.slice(1, -1);
      const vals = inner.split(/,\t/);
      if (vals.length === userCols.length) {
        const idIdx = userCols.indexOf('id');
        const userId = vals[idIdx].replace(/'/g, '');
        if (neededUserIds.has(userId) && !userRows[userId]) {
          userRows[userId] = { cols: userCols, vals };
        }
      }
    }
    if (line.trim().endsWith(';')) inUser = false;
  }
}

console.log('Found user data for:', Object.keys(userRows));
const missingUsers = [...neededUserIds].filter(id => !userRows[id]);
if (missingUsers.length) console.log('WARNING - could not find user data for:', missingUsers);

// Step 3: Prepend user upserts to restore_gap_bookings.sql
let userSql = `-- Ensure required users exist before inserting bookings\n\n`;
for (const [userId, { cols, vals }] of Object.entries(userRows)) {
  const allCols = cols.map(c => `"${c}"`).join(', ');
  const allVals = vals.join(',\t');
  // ON CONFLICT DO NOTHING - never overwrite existing live user data
  userSql += `INSERT INTO "User" (${allCols}) VALUES (${allVals}) ON CONFLICT ("id") DO NOTHING;\n`;
}

const existing = fs.readFileSync('e:/Terrific-Travel_TMS/restore_gap_bookings.sql', 'utf8');
fs.writeFileSync('e:/Terrific-Travel_TMS/restore_gap_bookings.sql', userSql + '\n' + existing);
console.log('\nPrepended user inserts to restore_gap_bookings.sql');

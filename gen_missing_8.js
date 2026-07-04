const fs = require('fs');

// The 8 bookings still missing from CRM
const targetRefs = new Set([
  'TT00966','TT00967','TT00968','TT00969',
  'TT00970','TT00971','TT00972','TT00973'
]);

function parseRows(lines, tableName) {
  let inTable = false;
  let cols = [];
  const rows = {};
  for (const line of lines) {
    if (line.startsWith(`INSERT INTO "${tableName}"`)) {
      inTable = true;
      const match = line.match(/\(([^)]+)\)/);
      if (match) cols = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
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
        const vals = inner.split(/,\t/);
        if (vals.length === cols.length) {
          const idIdx = cols.indexOf('id');
          if (idIdx !== -1) rows[vals[idIdx].replace(/'/g, '')] = { cols: [...cols], vals: [...vals] };
        }
      }
      if (line.trim().endsWith(';')) inTable = false;
    }
  }
  return rows;
}

// Source: tms_db_remaining_bookings.sql (most recent data for these bookings)
const remLines = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8').split('\n');
const latLines = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_latest.sql', 'utf8').split('\n');

// --- Step 1: Parse booking rows for target refs ---
let inBooking = false, bookingCols = [];
const bookingRows = {}; // ref -> { cols, vals, backupId }
const neededAgentIds = new Set();
const neededUserIds = new Set();

for (const line of remLines) {
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
        const ref = data['bookingReference'].replace(/'/g, '');
        if (targetRefs.has(ref)) {
          bookingRows[ref] = { cols: [...bookingCols], vals: [...vals], backupId: data['id'].replace(/'/g, '') };
          for (const c of ['userId','assignedToId','createdById']) {
            const v = (data[c]||'NULL').replace(/'/g,'');
            if (v && v !== 'NULL') neededUserIds.add(v);
          }
          for (const c of ['agentId']) {
            const v = (data[c]||'NULL').replace(/'/g,'');
            if (v && v !== 'NULL') neededAgentIds.add(v);
          }
        }
      }
    }
    if (line.trim().endsWith(';')) inBooking = false;
  }
}

console.log('Found booking data for:', Object.keys(bookingRows).sort().join(', '));

// --- Step 2: Get Agent rows ---
const agentsRem = parseRows(remLines, 'Agent');
const agentsLat = parseRows(latLines, 'Agent');
// Also collect agentIds from users
const usersRem = parseRows(remLines, 'User');
const usersLat = parseRows(latLines, 'User');
for (const id of neededUserIds) {
  const u = usersRem[id] || usersLat[id];
  if (u) {
    const aIdx = u.cols.indexOf('agentId');
    if (aIdx !== -1) { const v = u.vals[aIdx].replace(/'/g,''); if (v && v !== 'NULL') neededAgentIds.add(v); }
  }
}

// --- Build SQL ---
let sql = `-- Restore TT00966-TT00973 (8 missing bookings)\n-- Source: tms_db_remaining_bookings.sql\n\n`;

// Agents
sql += `-- Agents\n`;
for (const id of neededAgentIds) {
  const row = agentsRem[id] || agentsLat[id];
  if (!row) { sql += `-- WARNING: Agent ${id} not found\n`; continue; }
  sql += `INSERT INTO "Agent" ("${row.cols.join('", "')}") VALUES (${row.vals.join(',\t')}) ON CONFLICT ("id") DO NOTHING;\n`;
}

// Users
sql += `\n-- Users\n`;
for (const id of neededUserIds) {
  const row = usersRem[id] || usersLat[id];
  if (!row) { sql += `-- WARNING: User ${id} not found\n`; continue; }
  sql += `INSERT INTO "User" ("${row.cols.join('", "')}") VALUES (${row.vals.join(',\t')}) ON CONFLICT ("id") DO NOTHING;\n`;
}

// Bookings (DO $$ upsert)
sql += `\n-- Bookings\n`;
const backupIds = new Set();
for (const ref of [...targetRefs].sort()) {
  const b = bookingRows[ref];
  if (!b) { sql += `-- WARNING: booking ${ref} not found in backup\n`; continue; }
  backupIds.add(b.backupId);
  const updateSets = b.cols
    .filter(c => c !== 'id' && c !== 'bookingReference')
    .map(c => { const idx = b.cols.indexOf(c); return `"${c}" = ${b.vals[idx]}`; })
    .join(', ');
  const allCols = b.cols.map(c => `"${c}"`).join(', ');
  const allVals = b.vals.join(',\t');
  sql += `DO $$ BEGIN\n`;
  sql += `  UPDATE "Booking" SET ${updateSets} WHERE "bookingReference" = '${ref}';\n`;
  sql += `  IF NOT FOUND THEN\n`;
  sql += `    INSERT INTO "Booking" (${allCols}) VALUES (${allVals});\n`;
  sql += `  END IF;\n`;
  sql += `END $$;\n\n`;
}

// Clear old child records
const refList = [...targetRefs].map(r => `'${r}'`).join(', ');
const subQ = `(SELECT "id" FROM "Booking" WHERE "bookingReference" IN (${refList}))`;
sql += `-- Clear old child records\n`;
for (const t of ['Passenger','FlightService','TransportService','AccommodationService','VisaService','BookingTransaction','BookingVendorPayment']) {
  sql += `DELETE FROM "${t}" WHERE "bookingId" IN ${subQ};\n`;
}

// Insert child records
const childTables = ['Passenger','FlightService','TransportService','AccommodationService','VisaService','BookingTransaction','BookingVendorPayment'];
const backupIdToRef = {};
for (const [ref, b] of Object.entries(bookingRows)) backupIdToRef[b.backupId] = ref;

for (const table of childTables) {
  let inTable = false, tCols = [], bIdIdx = -1, rows = [];
  for (const line of remLines) {
    if (line.startsWith(`INSERT INTO "${table}"`)) {
      inTable = true;
      const match = line.match(/\(([^)]+)\)/);
      if (match) { tCols = match[1].split(',').map(c => c.trim().replace(/"/g, '')); bIdIdx = tCols.indexOf('bookingId'); }
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
        const vals = inner.split(/,\t/);
        if (bIdIdx !== -1 && vals.length > bIdIdx) {
          const bId = vals[bIdIdx].replace(/'/g,'');
          if (backupIds.has(bId)) {
            const ref = backupIdToRef[bId];
            vals[bIdIdx] = `(SELECT "id" FROM "Booking" WHERE "bookingReference" = '${ref}' LIMIT 1)`;
            rows.push(`(${vals.join(',\t')})`);
          }
        }
      }
      if (line.trim().endsWith(';')) inTable = false;
    }
  }
  if (rows.length > 0) {
    sql += `\nINSERT INTO "${table}" ("${tCols.join('", "')}") VALUES\n`;
    sql += rows.map((r,i) => i === rows.length-1 ? r+';' : r+',').join('\n') + '\n';
  }
}

fs.writeFileSync('e:/Terrific-Travel_TMS/restore_missing_8.sql', sql);
console.log('Done! restore_missing_8.sql generated.');
console.log('Bookings covered:', Object.keys(bookingRows).sort().join(', '));

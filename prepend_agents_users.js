const fs = require('fs');

const targetRefs = new Set([
  'TT00965','TT00966','TT00967','TT00968','TT00969','TT00970',
  'TT00971','TT00972','TT00973','TT00974'
]);

function parseRows(lines, tableName) {
  let inTable = false;
  let cols = [];
  const rows = {}; // id -> { cols, vals }

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
          if (idIdx !== -1) {
            const id = vals[idIdx].replace(/'/g, '');
            rows[id] = { cols: [...cols], vals: [...vals] };
          }
        }
      }
      if (line.trim().endsWith(';')) inTable = false;
    }
  }
  return rows;
}

// Load both files
const latestLines  = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_latest.sql', 'utf8').split('\n');
const remainingLines = fs.readFileSync('e:/Terrific-Travel_TMS/tms_db_remaining_bookings.sql', 'utf8').split('\n');

// Step 1: find userIds needed by gap bookings
let inBooking = false;
let bookingCols = [];
const neededUserIds = new Set();
const neededAgentIdsFromBookings = new Set();

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
          for (const col of ['agentId']) {
            const v = (data[col] || 'NULL').replace(/'/g, '');
            if (v && v !== 'NULL') neededAgentIdsFromBookings.add(v);
          }
        }
      }
    }
    if (line.trim().endsWith(';')) inBooking = false;
  }
}

// Step 2: get User rows (preferring remaining over latest)
const usersFromRemaining = parseRows(remainingLines, 'User');
const usersFromLatest    = parseRows(latestLines, 'User');

const neededUsers = {};
for (const id of neededUserIds) {
  neededUsers[id] = usersFromRemaining[id] || usersFromLatest[id];
}

// Step 3: find agentIds needed by those users
const neededAgentIds = new Set([...neededAgentIdsFromBookings]);
for (const [, row] of Object.entries(neededUsers)) {
  if (!row) continue;
  const agentIdIdx = row.cols.indexOf('agentId');
  if (agentIdIdx !== -1) {
    const v = row.vals[agentIdIdx].replace(/'/g, '');
    if (v && v !== 'NULL') neededAgentIds.add(v);
  }
}

console.log('Needed agent IDs:', [...neededAgentIds]);
console.log('Needed user IDs:', [...neededUserIds]);

// Step 4: get Agent rows
const agentsFromRemaining = parseRows(remainingLines, 'Agent');
const agentsFromLatest    = parseRows(latestLines, 'Agent');

const neededAgents = {};
for (const id of neededAgentIds) {
  neededAgents[id] = agentsFromRemaining[id] || agentsFromLatest[id];
}

const missingAgents = [...neededAgentIds].filter(id => !neededAgents[id]);
const missingUsers  = [...neededUserIds].filter(id => !neededUsers[id]);
if (missingAgents.length) console.log('WARNING missing agents:', missingAgents);
if (missingUsers.length)  console.log('WARNING missing users:', missingUsers);

// Step 5: Build SQL
let sql = `-- Step 1: Ensure required Agents exist\n\n`;
for (const [id, row] of Object.entries(neededAgents)) {
  if (!row) { sql += `-- WARNING: Agent ${id} not found in backups\n`; continue; }
  const allCols = row.cols.map(c => `"${c}"`).join(', ');
  const allVals = row.vals.join(',\t');
  sql += `INSERT INTO "Agent" (${allCols}) VALUES (${allVals}) ON CONFLICT ("id") DO NOTHING;\n`;
}

sql += `\n-- Step 2: Ensure required Users exist\n\n`;
for (const [id, row] of Object.entries(neededUsers)) {
  if (!row) { sql += `-- WARNING: User ${id} not found in backups\n`; continue; }
  const allCols = row.cols.map(c => `"${c}"`).join(', ');
  const allVals = row.vals.join(',\t');
  sql += `INSERT INTO "User" (${allCols}) VALUES (${allVals}) ON CONFLICT ("id") DO NOTHING;\n`;
}

// Regenerate gap fix fresh (without old user prepend)
// Re-run gen_gap_fix.js output and append to sql
const gapContent = fs.readFileSync('e:/Terrific-Travel_TMS/restore_gap_bookings.sql', 'utf8');
// Strip old user prepend (everything before "-- Fix: Restore bookings")
const fixStart = gapContent.indexOf('-- Fix: Restore bookings');
const gapOnly = fixStart !== -1 ? gapContent.slice(fixStart) : gapContent;

fs.writeFileSync('e:/Terrific-Travel_TMS/restore_gap_bookings.sql', sql + '\n' + gapOnly);
console.log('\nDone! restore_gap_bookings.sql updated with Agent + User prerequisites.');

const fs = require('fs');
const readline = require('readline');

function parseSqlTuple(line) {
  let str = line.trim();
  if (str.startsWith('(')) str = str.slice(1);
  if (str.endsWith('),') || str.endsWith(');')) str = str.slice(0, -2);
  else if (str.endsWith(')')) str = str.slice(0, -1);

  const rawParts = str.split(/\t/);
  return rawParts.map(p => {
    let clean = p.trim();
    if (clean.endsWith(',')) clean = clean.slice(0, -1).trim();
    if ((clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith('"') && clean.endsWith('"'))) {
      clean = clean.slice(1, -1);
    }
    return clean;
  });
}

async function main() {
  console.log("Loading admin_relational_data.json...");
  const jsonRaw = JSON.parse(fs.readFileSync('admin_relational_data.json', 'utf8'));
  const jsonBookings = jsonRaw.bookings || [];

  const jsonMap = new Map();
  for (const item of jsonBookings) {
    const details = item.booking_details || {};
    const ref = details.booking_reference ? String(details.booking_reference).trim() : null;
    if (ref) {
      jsonMap.set(ref, {
        booking_id: item.booking_id,
        booking_reference: ref,
        total_price: details.total_price !== undefined ? Number(details.total_price) : 0,
        paid_amount: details.paid_amount !== undefined ? Number(details.paid_amount) : 0,
        remaining_amount: details.remaining_amount !== undefined ? Number(details.remaining_amount) : 0,
        payment_status: details.payment_status,
        status: details.status
      });
    }
  }

  console.log(`Loaded ${jsonMap.size} bookings from JSON.`);

  console.log("Parsing TMS_210720261144.sql for Booking records...");
  const fileStream = fs.createReadStream('TMS_210720261144.sql');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let inBookingInsert = false;
  const sqlBookingsMap = new Map();

  for await (const line of rl) {
    if (line.includes('INSERT INTO "Booking"')) {
      inBookingInsert = true;
      continue;
    }
    if (inBookingInsert) {
      if (line.trim().startsWith(';') || line.trim() === '') {
        inBookingInsert = false;
        continue;
      }

      const parts = parseSqlTuple(line);

      if (parts.length >= 15) {
        const id = parts[0];
        const status = parts[2];
        const totalPrice = parseFloat(parts[3]) || 0;
        const bookingReference = parts[7];
        const paidAmount = parseFloat(parts[9]) || 0;
        const remainingAmount = parseFloat(parts[13]) || 0;
        const paymentStatus = parts[14];

        if (bookingReference) {
          sqlBookingsMap.set(bookingReference, {
            id,
            status,
            totalPrice,
            bookingReference,
            paidAmount,
            remainingAmount,
            paymentStatus
          });
        }
      }
    }
  }

  console.log(`Extracted ${sqlBookingsMap.size} bookings from SQL dump.`);

  const mismatches = [];
  const notFoundInSql = [];
  const notFoundInJson = [];
  const sqlStatements = [];

  for (const [ref, jsonRecord] of jsonMap.entries()) {
    const sqlRecord = sqlBookingsMap.get(ref);
    if (!sqlRecord) {
      notFoundInSql.push(ref);
      continue;
    }

    const jsonRemaining = jsonRecord.remaining_amount;
    const sqlRemaining = sqlRecord.remainingAmount;

    // Compare remaining amount
    if (Math.abs(jsonRemaining - sqlRemaining) > 0.001) {
      const jsonPaid = jsonRecord.paid_amount;
      const jsonTotal = jsonRecord.total_price;

      // Determine updated paymentStatus
      let newPaymentStatus = sqlRecord.paymentStatus;
      if (jsonRemaining <= 0) {
        newPaymentStatus = 'PAID';
      } else if (jsonPaid > 0 && jsonRemaining > 0) {
        newPaymentStatus = 'PARTIALLY_PAID';
      } else if (jsonPaid <= 0 && jsonRemaining > 0) {
        newPaymentStatus = 'UNPAID';
      }

      mismatches.push({
        bookingReference: ref,
        sqlId: sqlRecord.id,
        sqlRemaining: sqlRemaining,
        jsonRemaining: jsonRemaining,
        sqlPaid: sqlRecord.paidAmount,
        jsonPaid: jsonPaid,
        sqlTotalPrice: sqlRecord.totalPrice,
        jsonTotalPrice: jsonTotal,
        sqlPaymentStatus: sqlRecord.paymentStatus,
        newPaymentStatus: newPaymentStatus
      });

      sqlStatements.push(
        `UPDATE "Booking" SET "remainingAmount" = ${jsonRemaining}, "paidAmount" = ${jsonPaid}, "paymentStatus" = '${newPaymentStatus}', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = '${ref}';`
      );
    }
  }

  // Check for any bookings in SQL not found in JSON
  for (const [ref, sqlRecord] of sqlBookingsMap.entries()) {
    if (!jsonMap.has(ref)) {
      notFoundInJson.push(ref);
    }
  }

  console.log("\n========================================================");
  console.log(`SUMMARY OF COMPARISON:`);
  console.log(`Total JSON bookings: ${jsonMap.size}`);
  console.log(`Total SQL bookings: ${sqlBookingsMap.size}`);
  console.log(`Bookings with Remaining Balance Mismatches: ${mismatches.length}`);
  console.log(`Bookings in JSON but not found in SQL: ${notFoundInSql.length}`);
  console.log(`Bookings in SQL but not in JSON: ${notFoundInJson.length}`);
  console.log("========================================================\n");

  if (mismatches.length > 0) {
    console.log(`Top 20 Mismatch Examples (out of ${mismatches.length}):`);
    console.table(mismatches.slice(0, 20).map(m => ({
      Reference: m.bookingReference,
      'SQL Remaining': m.sqlRemaining,
      'JSON Remaining': m.jsonRemaining,
      'SQL Paid': m.sqlPaid,
      'JSON Paid': m.jsonPaid,
      'SQL PaymentStatus': m.sqlPaymentStatus,
      'New PaymentStatus': m.newPaymentStatus
    })));
  }

  // Save SQL update script
  const sqlScriptContent = `-- ========================================================\n-- SQL Update Script for "Booking" table\n-- Correct Remaining Balances loaded from admin_relational_data.json\n-- Target SQL File: TMS_210720261144.sql\n-- Generated At: ${new Date().toISOString()}\n-- Mismatches Found & Corrected: ${mismatches.length}\n-- ========================================================\n\nBEGIN;\n\n` + sqlStatements.join('\n') + `\n\nCOMMIT;\n`;

  fs.writeFileSync('update_remaining_balances.sql', sqlScriptContent);
  console.log(`\nGenerated SQL script saved to update_remaining_balances.sql`);

  fs.writeFileSync('comparison_report.json', JSON.stringify({
    totalJsonBookings: jsonMap.size,
    totalSqlBookings: sqlBookingsMap.size,
    mismatchCount: mismatches.length,
    mismatches,
    notFoundInSql,
    notFoundInJson
  }, null, 2));
}

main().catch(err => console.error(err));

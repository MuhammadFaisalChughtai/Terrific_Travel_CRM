const fs = require('fs');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const dataPath = 'e:\\Terrific-Travel_TMS\\admin_relational_data.json';
const sqlPath = 'e:\\Terrific-Travel_TMS\\import_data.sql';

const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

let sql = '';
const escapeStr = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const escapeNum = (num, defaultVal = 'NULL') => {
  if (num === null || num === undefined || num === '') return defaultVal;
  return Number(num);
};

const escapeDate = (dateStr) => {
  if (!dateStr) return 'NULL';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'NULL';
  return `'${d.toISOString()}'`;
};

// Map of Agents from production_user_vendors.sql
const userMap = {
  'sheikh ebad': { userId: 'b82a98bd-f24d-4ff1-af51-53e3ebdca9e5', agentId: 'e1f168f7-0772-4e82-9011-6745efc8c59b' },
  'hasnain sanwal': { userId: 'baf4459c-aeb3-464e-b39e-7a1b26430b59', agentId: 'NULL' },
  'admin': { userId: 'baf4459c-aeb3-464e-b39e-7a1b26430b59', agentId: 'NULL' },
  'zain malik': { userId: 'd47ce6c4-c1b3-4c59-b609-b3082061aff1', agentId: '6ee97972-be10-4114-bcc2-fe9165be7714' },
  'hamza choudary': { userId: 'fb69c410-7863-4086-9763-1c9d771fdbd3', agentId: 'e2f5808a-8809-4668-9e63-29444d0f988b' },
  'faisal chughtai': { userId: '278b9ff0-cf41-41b1-a5a6-070294f9c191', agentId: 'd48c4fd9-7343-42c3-8241-613691bcdac7' },
  'rayan ali': { userId: '420d80dc-2d84-4454-aa76-e22b50f01213', agentId: '455bbf6d-c482-408d-b449-7df76e15f696' },
  'ali ahmad': { userId: '1738f420-d4af-4928-8e33-eeceb35b8c3c', agentId: '0002b9e2-464a-4502-9a36-8cd0d911c289' },
  'maira tanveer': { userId: 'e0b6c8d8-c11f-4682-af07-be0a017926a5', agentId: 'ea4b8e68-8db4-4aa1-b110-0d85bae85be2' },
  'zain ali': { userId: 'c8fb18b0-04ae-4460-9267-a321aac805c6', agentId: '1e85f3e9-37fc-4704-8650-ce423408044e' }
};

const defaultUserId = "'baf4459c-aeb3-464e-b39e-7a1b26430b59'"; // Admin

sql += `\n-- Bookings\n`;
data.bookings.forEach(b => {
  const bookingId = uuidv4();
  const d = b.booking_details;
  
  const bDate = escapeDate(d.date);
  const depDate = escapeDate(d.departure_date);
  
  const agentName = (d.agent || '').toLowerCase().trim();
  const mappedUser = userMap[agentName];
  const userId = mappedUser ? `'${mappedUser.userId}'` : defaultUserId;
  const agentId = mappedUser && mappedUser.agentId !== 'NULL' ? `'${mappedUser.agentId}'` : 
                 (agentName ? `(SELECT id FROM "Agent" WHERE LOWER(name) = ${escapeStr(agentName)} LIMIT 1)` : 'NULL');
  
  sql += `INSERT INTO "Booking" ("id", "userId", "bookingReference", "bookingDate", "departureDate", "totalPrice", "paidAmount", "refundAmount", "cardPaymentCharges", "cancellationCharges", "remainingAmount", "paymentStatus", "lockedStatus", "status", "agentId", "updatedAt") VALUES (
    ${escapeStr(bookingId)}, ${userId}, ${escapeStr(d.booking_reference)}, ${bDate}, ${depDate}, ${escapeNum(d.total_price, 0)}, ${escapeNum(d.paid_amount, 0)}, ${escapeNum(d.refund_amount, 0)}, ${escapeNum(d.card_payment_charges, 0)}, ${escapeNum(d.cancellation_charges, 0)}, ${escapeNum(d.remaining_amount, 0)}, ${escapeStr(d.payment_status || 'UNPAID')}, ${escapeStr(d.locked_status || 'UNLOCKED')}, 'CONFIRMED', ${agentId}, NOW()
  );\n`;

  // Passengers
  b.passengers?.forEach(p => {
    const passId = uuidv4();
    const pAgentName = (p.agent || '').toLowerCase().trim();
    const pMappedUser = userMap[pAgentName];
    const pAgentId = pMappedUser && pMappedUser.agentId !== 'NULL' ? `'${pMappedUser.agentId}'` : 
                    (pAgentName ? `(SELECT id FROM "Agent" WHERE LOWER(name) = ${escapeStr(pAgentName)} LIMIT 1)` : 'NULL');
                    
    sql += `INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
      ${escapeStr(passId)}, ${escapeStr(bookingId)}, ${escapeStr(p.title || '')}, ${escapeStr(p.first_name || '')}, ${escapeStr(p.last_name || '')}, ${escapeStr(p.age || 'Adult')}, ${escapeStr(p.email)}, ${escapeStr(p.phone_number)}, ${escapeDate(p.passport_expiry_date)}, ${pAgentId}, ${escapeStr(p.role || 'Family Member')}
    );\n`;
  });

  // Flight Services
  b.flight_services?.forEach(f => {
    const fsId = uuidv4();
    const vIdSubquery = f.vendor ? `(SELECT id FROM "Vendor" WHERE LOWER(name) = ${escapeStr(f.vendor.toLowerCase())} LIMIT 1)` : 'NULL';
    sql += `INSERT INTO "FlightService" ("id", "bookingId", "vendorId", "date", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass") VALUES (
      ${escapeStr(fsId)}, ${escapeStr(bookingId)}, ${vIdSubquery}, ${escapeDate(f.date)}, ${escapeStr(f.flight_no)}, ${escapeStr(f.pnr || '')}, ${escapeStr(f.departed_from)}, ${escapeStr(f.arrived_at)}, ${escapeStr(f.depart_time)}, ${escapeStr(f.arrival_time)}, ${escapeNum(f.price, 0)}, ${escapeStr(f.currency || 'GBP')}, ${escapeDate(f.issue_date)}, ${escapeNum(f.refund_amount, 0)}, ${escapeNum(f.fine_amount, 0)}, ${escapeStr(f.baggage)}, ${escapeStr(f.carry_on_baggage)}, ${escapeStr(f.checked_baggage)}, ${escapeStr(f.flight_class)}
    );\n`;
  });

  // Transport Services
  b.transport_services?.forEach(t => {
    const tsId = uuidv4();
    const vIdSubquery = t.vendor ? `(SELECT id FROM "Vendor" WHERE LOWER(name) = ${escapeStr(t.vendor.toLowerCase())} LIMIT 1)` : 'NULL';
    sql += `INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
      ${escapeStr(tsId)}, ${escapeStr(bookingId)}, ${vIdSubquery}, ${escapeStr(t.vehicle_type)}, ${escapeStr(t.departure_destination)}, ${escapeStr(t.arrival_destination)}, ${escapeDate(t.date)}, ${escapeStr(t.departure_time)}, ${escapeStr(t.arrival_time || '')}, ${escapeStr(t.flight_no)}, ${escapeNum(t.price, 0)}, ${escapeStr(t.currency || 'GBP')}, ${escapeStr(t.other_currency)}, ${escapeNum(t.conversion_rate)}, ${escapeDate(t.issue_date)}, ${escapeNum(t.refund_amount, 0)}, ${escapeNum(t.fine_amount, 0)}
    );\n`;
  });

  // Accommodation Services
  b.accommodation_services?.forEach(a => {
    const asId = uuidv4();
    const vIdSubquery = a.vendor ? `(SELECT id FROM "Vendor" WHERE LOWER(name) = ${escapeStr(a.vendor.toLowerCase())} LIMIT 1)` : 'NULL';
    sql += `INSERT INTO "AccommodationService" ("id", "bookingId", "vendorId", "hotelName", "roomType", "checkInDate", "checkOutDate", "mealType", "reservationNumber", "qty", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount", "hotelConfirmationNumber", "hotelAddress", "lastCancellationDate") VALUES (
      ${escapeStr(asId)}, ${escapeStr(bookingId)}, ${vIdSubquery}, ${escapeStr(a.hotel_name)}, ${escapeStr(a.room_type)}, ${escapeDate(a.check_in_date)}, ${escapeDate(a.check_out_date)}, ${escapeStr(a.meal_type)}, ${escapeStr(a.reservation_number)}, ${escapeNum(a.qty || 1, 1)}, ${escapeNum(a.price, 0)}, ${escapeStr(a.currency || 'GBP')}, ${escapeStr(a.other_currency)}, ${escapeNum(a.conversion_rate)}, ${escapeDate(a.issue_date)}, ${escapeNum(a.refund_amount, 0)}, ${escapeNum(a.fine_amount, 0)}, ${escapeStr(a.hotel_confirmation_number)}, ${escapeStr(a.hotel_address)}, ${escapeDate(a.last_cancellation_date)}
    );\n`;
  });
  
  // Visa Services
  b.visa_services?.forEach(v => {
    const vsId = uuidv4();
    const vIdSubquery = v.vendor ? `(SELECT id FROM "Vendor" WHERE LOWER(name) = ${escapeStr(v.vendor.toLowerCase())} LIMIT 1)` : 'NULL';
    sql += `INSERT INTO "VisaService" ("id", "bookingId", "vendorId", "passportNumber", "visaType", "visaNumber", "issueDate", "expiryDate", "price", "currency", "otherCurrency", "conversionRate", "refundAmount", "fineAmount") VALUES (
      ${escapeStr(vsId)}, ${escapeStr(bookingId)}, ${vIdSubquery}, ${escapeStr(v.passport_number || '')}, ${escapeStr(v.visa_type)}, ${escapeStr(v.visa_number)}, ${escapeDate(v.issue_date)}, ${escapeDate(v.expiry_date)}, ${escapeNum(v.price, 0)}, ${escapeStr(v.currency || 'GBP')}, ${escapeStr(v.other_currency)}, ${escapeNum(v.conversion_rate)}, ${escapeNum(v.refund_amount, 0)}, ${escapeNum(v.fine_amount, 0)}
    );\n`;
  });

  // Booking Transactions
  b.booking_transactions?.forEach(t => {
    const txId = uuidv4();
    sql += `INSERT INTO "BookingTransaction" ("id", "bookingId", "amount", "paymentMethod", "paidOn", "notes") VALUES (
      ${escapeStr(txId)}, ${escapeStr(bookingId)}, ${escapeNum(t.amount, 0)}, ${escapeStr(t.payment_method || 'CASH')}, ${escapeDate(t.paid_on)}, ${escapeStr(t.notes)}
    );\n`;
  });

  // Vendor Payments (Aggregate by vendor name)
  const vendorPaymentsMap = {};
  b.vendor_payments?.forEach(vp => {
    const vName = vp.vendor ? vp.vendor.toLowerCase() : null;
    if (vName) {
      if (!vendorPaymentsMap[vName]) {
        vendorPaymentsMap[vName] = {
          originalCost: 0,
          amountPaid: 0,
          remainingBalance: 0,
          status: 'PENDING'
        };
      }
      vendorPaymentsMap[vName].originalCost += Number(vp.amount || 0);
      vendorPaymentsMap[vName].amountPaid += Number(vp.total_paid || 0);
      vendorPaymentsMap[vName].remainingBalance += Number(vp.remaining_due || 0);
      if (vp.payment_status === 'PAID') vendorPaymentsMap[vName].status = 'PAID';
    }
  });

  Object.entries(vendorPaymentsMap).forEach(([vName, vp]) => {
    const vpId = uuidv4();
    const vIdSubquery = `(SELECT id FROM "Vendor" WHERE LOWER(name) = ${escapeStr(vName)} LIMIT 1)`;
    sql += `INSERT INTO "BookingVendorPayment" ("id", "bookingId", "vendorId", "originalCost", "amountPaid", "remainingBalance", "status", "updatedAt") VALUES (
      ${escapeStr(vpId)}, ${escapeStr(bookingId)}, ${vIdSubquery}, ${escapeNum(vp.originalCost, 0)}, ${escapeNum(vp.amountPaid, 0)}, ${escapeNum(vp.remainingBalance, 0)}, ${escapeStr(vp.status)}, NOW()
    );\n`;
  });
});

fs.writeFileSync(sqlPath, sql, 'utf8');
console.log('SQL generated at:', sqlPath);

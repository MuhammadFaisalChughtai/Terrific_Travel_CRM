-- SQL Query to restore the full Booking 'TT00948' and its accommodations, passengers, flights, transports, visa, and transactions

-- 0a. Make sure vendor 'trip.com' exists
INSERT INTO "Vendor" ("id", "name", "phoneNumber", "vendorType", "walletBalance", "createdAt", "updatedAt")
SELECT '64bf37be-00d3-469b-8ee4-a4f6587d55f0', 'trip.com', '0000000000', 'flight', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Vendor" WHERE LOWER("name") = 'trip.com')
ON CONFLICT ("id") DO NOTHING;

-- 0b. Make sure vendor 'al sultan' exists
INSERT INTO "Vendor" ("id", "name", "phoneNumber", "vendorType", "walletBalance", "createdAt", "updatedAt")
SELECT 'c3e86e8e-c6c0-4468-8884-dc1619398f2d', 'al sultan', '0000000000', 'general', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Vendor" WHERE LOWER("name") = 'al sultan')
ON CONFLICT ("id") DO NOTHING;

-- 0c. Make sure vendor 'agoda' exists
INSERT INTO "Vendor" ("id", "name", "phoneNumber", "vendorType", "walletBalance", "createdAt", "updatedAt")
SELECT 'f26c9da3-8289-4839-8e98-7c17e13cee72', 'agoda', '0000000000', 'accommodation', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Vendor" WHERE LOWER("name") = 'agoda')
ON CONFLICT ("id") DO NOTHING;

-- 0d. Make sure vendor 'mofa' exists
INSERT INTO "Vendor" ("id", "name", "phoneNumber", "vendorType", "walletBalance", "createdAt", "updatedAt")
SELECT 'fc7d76c5-e5d4-459d-90b1-525a4f113d1b', 'mofa', '0000000000', 'general', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Vendor" WHERE LOWER("name") = 'mofa')
ON CONFLICT ("id") DO NOTHING;

-- 1. Booking 'TT00948'
INSERT INTO "Booking" ("id", "userId", "bookingReference", "bookingDate", "departureDate", "totalPrice", "paidAmount", "refundAmount", "cardPaymentCharges", "cancellationCharges", "remainingAmount", "paymentStatus", "lockedStatus", "status", "agentId", "updatedAt") VALUES (
  'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'baf4459c-aeb3-464e-b39e-7a1b26430b59', 'TT00948', '2026-06-08 23:00:00', '2026-08-10 23:00:00', 6210, 4210, 0, 0, 0, 2000, 'UNPAID', 'UNLOCKED', 'CONFIRMED', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 2. Passengers for 'TT00948'
INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
  '37b045d4-6e5f-48c9-9aef-1a6a7bf51fbd', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'Mrs', 'Amreen', 'Akhtar', 'Adult', '0', NULL, '2028-08-02 23:00:00', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), 'Leader'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
  'f29c1e4c-b398-4e16-9a14-e0ec5ac87506', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'Miss', 'Aisha', 'Younis', 'Adult', '0', NULL, '2027-08-18 23:00:00', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), 'Family Member'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
  '88e925af-a620-4e85-9b8d-d69628ad7be3', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'Mr', 'Imran', 'Younis', 'Adult', '0', NULL, '2027-02-12 00:00:00', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), 'Family Member'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
  '68c26669-d4e7-49bf-a0f3-4937ba8189f6', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'Mr', 'Mohammed Omair', 'Younis', 'Adult', '0', NULL, '2027-06-17 23:00:00', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), 'Family Member'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Passenger" ("id", "bookingId", "title", "firstName", "lastName", "age", "email", "phoneNumber", "passportExpiryDate", "agentId", "role") VALUES (
  '113e5a89-f766-411c-9b43-c7c8f4e3c23d', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 'Mstr', 'Mohammed Abdullah', 'Ahmed', 'Child', '0', NULL, '2028-01-19 00:00:00', (SELECT id FROM "Agent" WHERE LOWER(name) = 'hasnain sanwal' LIMIT 1), 'Family Member'
) ON CONFLICT ("id") DO NOTHING;

-- 3. FlightServices for 'TT00948'
INSERT INTO "FlightService" ("id", "bookingId", "vendorId", "date", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass") VALUES (
  'ffdc277b-4156-4239-9bcf-1f4115bfbb6d', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'trip.com' LIMIT 1), '2026-08-10 23:00:00', 'RX402', '', 'London Heathrow Airport (LHR)', 'Riyad King Khalid International Airport (RUH)', '0935', '1805', 0, 'GBP', NULL, 0, 0, '25KG', NULL, NULL, 'Economy'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "FlightService" ("id", "bookingId", "vendorId", "date", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass") VALUES (
  '8c9933f7-3684-40d7-9a11-d6689c2bf78d', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'trip.com' LIMIT 1), '2026-08-28 23:00:00', 'QR 1183', '', 'Jeddah King Abdulaziz Intl Airport (JED)', 'Doha Hamad Intl Airport (DOH)', '03:10', '05:30', 0, 'GBP', NULL, 0, 0, '25KG', NULL, NULL, 'Economy'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "FlightService" ("id", "bookingId", "vendorId", "date", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass") VALUES (
  'edddcbba-e0cf-4969-b01d-294443c7cd0f', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'trip.com' LIMIT 1), '2026-08-10 23:00:00', 'RX027', '', 'Riyad King Khalid International Airport (RUH)', 'Jeddah King Abdulaziz Intl Airport (JED)', '1940', '2130', 0, 'GBP', NULL, 0, 0, '25KG', NULL, NULL, 'Economy'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "FlightService" ("id", "bookingId", "vendorId", "date", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass") VALUES (
  '19b58628-943d-4dbb-86a1-3e33b206eaab', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'trip.com' LIMIT 1), '2026-08-28 23:00:00', 'QR 9709', '', 'Doha Hamad Intl Airport (DOH)', 'London Heathrow Airport (LHR)', '07:55', '14:05', 0, 'GBP', NULL, 0, 0, '25 KG', NULL, NULL, 'Economy'
) ON CONFLICT ("id") DO NOTHING;

-- 4. TransportServices for 'TT00948'
INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
  '0506d77f-aff4-483d-8e3c-527f1e37d819', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'al sultan' LIMIT 1), 'Coaster', 'Jeddah King Abdulaziz Intl Airport (JED)', 'Swissotel Al Maqam Makkah', '2026-08-10 23:00:00', '2130', '', 'RX027', 0, 'GBP', NULL, NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
  '2a421fb9-e016-4606-80fa-781ce9decf56', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'al sultan' LIMIT 1), 'Coaster', 'Swissotel Al Maqam Makkah', 'Makkah Ziarat', '2026-08-14 23:00:00', '0900', '', NULL, 0, 'GBP', NULL, NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
  'c32edf23-dd60-40e1-b166-9c2a2e5202a3', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'al sultan' LIMIT 1), 'Coaster', 'Swissotel Al Maqam Makkah', 'ODST Madinah', '2026-08-18 23:00:00', '1200', '', NULL, 0, 'GBP', NULL, NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
  'b83a533d-50d8-4787-99e3-a9904abc1e95', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'al sultan' LIMIT 1), 'Coaster', 'ODST Madinah', 'Madinah Ziarat', '2026-08-24 23:00:00', '0900', '', NULL, 0, 'GBP', NULL, NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES (
  '35aa344f-68ed-4e90-af48-fc00b73e6c22', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'al sultan' LIMIT 1), 'Coaster', 'ODST Madinah', 'Jeddah Airport', '2026-08-28 23:00:00', '2100', '', 'QR 1188', 0, 'GBP', NULL, NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

-- 5. VisaServices for 'TT00948'
INSERT INTO "VisaService" ("id", "bookingId", "vendorId", "passportNumber", "visaType", "visaNumber", "issueDate", "expiryDate", "price", "currency", "otherCurrency", "conversionRate", "refundAmount", "fineAmount") VALUES (
  'a2a17a83-469d-4fc7-ba96-37abb7ea92e6', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', (SELECT id FROM "Vendor" WHERE LOWER(name) = 'mofa' LIMIT 1), '', '5 E Waiver Visa', '', NULL, NULL, 0, 'GBP', NULL, NULL, 0, 0
) ON CONFLICT ("id") DO NOTHING;

-- 6. BookingTransactions for 'TT00948'
INSERT INTO "BookingTransaction" ("id", "bookingId", "amount", "paymentMethod", "paidOn", "notes") VALUES (
  'ba4b0b0b-5db4-42c5-a8a4-e39e4069b94e', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 2000, 'Cash', '2026-06-08 23:00:00', NULL
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "BookingTransaction" ("id", "bookingId", "amount", "paymentMethod", "paidOn", "notes") VALUES (
  'e2833bf9-2bca-4619-8531-112bfc35fb31', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 310, 'Cash', '2026-06-14 23:00:00', 'Refund Adjusted'
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "BookingTransaction" ("id", "bookingId", "amount", "paymentMethod", "paidOn", "notes") VALUES (
  'ecdab9ee-3e62-4554-bd7f-7b0db05943b0', 'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 1900, 'Bank Transfer', '2026-06-22 23:00:00', NULL
) ON CONFLICT ("id") DO NOTHING;

-- 7. Accommodations for 'TT00948'
INSERT INTO "AccommodationService" (
  "id", 
  "bookingId", 
  "vendorId", 
  "hotelName", 
  "roomType", 
  "checkInDate", 
  "checkOutDate", 
  "mealType", 
  "reservationNumber", 
  "qty", 
  "price", 
  "currency", 
  "otherCurrency", 
  "conversionRate", 
  "issueDate", 
  "refundAmount", 
  "fineAmount", 
  "hotelConfirmationNumber", 
  "hotelAddress", 
  "lastCancellationDate"
) VALUES (
  '26281e8f-5ab6-419b-91eb-32aebcd33be7', 
  'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 
  (SELECT id FROM "Vendor" WHERE LOWER(name) = 'agoda' LIMIT 1), 
  'Swissotel Al Maqam Makkah', 
  'Quad Room with Haram View', 
  '2026-08-10 23:00:00', 
  '2026-08-18 23:00:00', 
  'Breakfast', 
  NULL, 
  1, 
  0, 
  'GBP', 
  NULL, 
  NULL, 
  NULL, 
  0, 
  0, 
  NULL, 
  NULL, 
  NULL
) ON CONFLICT ("id") DO NOTHING;

INSERT INTO "AccommodationService" (
  "id", 
  "bookingId", 
  "vendorId", 
  "hotelName", 
  "roomType", 
  "checkInDate", 
  "checkOutDate", 
  "mealType", 
  "reservationNumber", 
  "qty", 
  "price", 
  "currency", 
  "otherCurrency", 
  "conversionRate", 
  "issueDate", 
  "refundAmount", 
  "fineAmount", 
  "hotelConfirmationNumber", 
  "hotelAddress", 
  "lastCancellationDate"
) VALUES (
  '5df146dc-c651-41b3-8e1b-5c74fe2c0c99', 
  'f984e93a-ef33-446c-ac6a-4ed9cd59ce55', 
  (SELECT id FROM "Vendor" WHERE LOWER(name) = 'agoda' LIMIT 1), 
  'ODST Madinah', 
  'Quad Room', 
  '2026-08-18 23:00:00', 
  '2026-08-28 23:00:00', 
  'Room Only', 
  NULL, 
  1, 
  0, 
  'GBP', 
  NULL, 
  NULL, 
  NULL, 
  0, 
  0, 
  NULL, 
  NULL, 
  NULL
) ON CONFLICT ("id") DO NOTHING;

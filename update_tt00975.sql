DO $$ 
DECLARE
  b_id text;
BEGIN
  SELECT "id" INTO b_id FROM "Booking" WHERE "bookingReference" = 'TT00975' LIMIT 1;
  IF b_id IS NULL THEN
    RAISE NOTICE 'Booking TT00975 not found';
    RETURN;
  END IF;

  DELETE FROM "AccommodationService" WHERE "bookingId" = b_id;
  DELETE FROM "FlightService" WHERE "bookingId" = b_id;
  DELETE FROM "TransportService" WHERE "bookingId" = b_id;

  INSERT INTO "FlightService" ("id", "bookingId", "flightReservationId", "date", "vendorId", "flightNo", "pnr", "departedFrom", "arrivedAt", "departTime", "arrivalTime", "price", "currency", "issueDate", "refundAmount", "fineAmount", "baggage", "carryOnBaggage", "checkedBaggage", "flightClass", "notes") VALUES
  ('4cad4511-632b-42a2-bd68-f1af33e5bcb8', b_id, NULL, '2026-10-20 00:00:00', '1', 'QR 330', '', 'Gatwick Airport London Crawley (LGW)', 'Hamad International Airport (DOH)', '09:00', '17:40', 0, 'GBP', NULL, 0, 0, '25 KG', '7 KG', NULL, 'Economy Class', '{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-20"}'),
  ('5efefb09-bc4b-4251-8c0e-f7b058b3f4a3', b_id, NULL, '2026-10-20 00:00:00', '1', 'QR 1188', '', 'Hamad International Airport (DOH)', 'King Abdulaziz International Airport (JED)', '18:35', '21:05', 0, 'GBP', NULL, 0, 0, '25 KG', '7 KG', NULL, 'Economy Class', '{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-20"}'),
  ('b3a51372-008b-46f8-bb5c-f58d894e0bdd', b_id, NULL, '2026-10-29 00:00:00', '1', 'QR 1187', '', 'King Abdulaziz International Airport (JED)', 'Hamad International Airport (DOH)', '19:30', '21:50', 0, 'GBP', NULL, 0, 0, '25 KG', '7 KG', NULL, 'Economy Class', '{"isConnecting":true,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-29"}'),
  ('761a62b0-a09e-4aed-926a-7f26f2b376a8', b_id, NULL, '2026-10-30 00:00:00', '1', 'QR 329', '', 'Hamad International Airport (DOH)', 'Gatwick Airport London Crawley (LGW)', '01:40', '05:55', 0, 'GBP', NULL, 0, 0, '23 KG', '7 KG', NULL, 'Economy Class', '{"isConnecting":false,"depTerminal":"","arrTerminal":"","actualNotes":"","arrivalDate":"2026-10-30"}');

  INSERT INTO "AccommodationService" ("id", "bookingId", "vendorId", "hotelName", "roomType", "checkInDate", "checkOutDate", "mealType", "reservationNumber", "qty", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount", "hotelConfirmationNumber", "hotelAddress", "lastCancellationDate", "city", "checkInTime", "checkOutTime") VALUES
  ('f236cd2d-1185-4eae-a7c2-2eacec5fc5e8', b_id, '2', 'Al Shohada by Palm Rich Makkah', 'Quad Room', '2026-10-20 00:00:00', '2026-10-25 00:00:00', 'Breakfast', NULL, 1, 0, 'GBP', NULL, NULL, NULL, 0, 0, NULL, '4490 Ajyad Street, Makkah (Mecca), Saudi Arabia', NULL, 'MAKKAH ', '16:00', '12:00'),
  ('cd65ab26-c9c8-457b-9ca2-4a228ef759c8', b_id, '2', 'Valy Al Madinah', 'Quad Room', '2026-10-25 00:00:00', '2026-10-29 00:00:00', 'Breakfast', NULL, 1, 0, 'GBP', NULL, NULL, NULL, 0, 0, NULL, '443 Abdullah bin Haram Street، DMAA6119, Madinah 42311, Saudi Arabia', NULL, 'Madinah', '16:00', '12:00');

  INSERT INTO "TransportService" ("id", "bookingId", "vendorId", "vehicleType", "departureDestination", "arrivalDestination", "date", "departureTime", "arrivalTime", "flightNo", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount") VALUES
  ('43eb4ae4-ab22-45c3-8e08-4d4a295813e2', b_id, '50fd9f2d-4964-4b67-bfa9-9bc09d46282b', 'Hiace', 'King Abdulaziz International Airport (JED)', 'Al Shohada by Palm Rich Makkah', '2026-10-20 00:00:00', '21:05', '', 'QR 1188', 0, 'GBP', NULL, NULL, NULL, 0, 0),
  ('ed64769f-c53d-4f9c-88a9-03610a6e8676', b_id, '50fd9f2d-4964-4b67-bfa9-9bc09d46282b', 'Hiace', 'Al Shohada by Palm Rich Makkah', 'Hamad International Airport (DOH)', '2026-10-20 00:00:00', '', '18:35', 'QR 1188', 0, 'GBP', NULL, NULL, NULL, 0, 0),
  ('83bf4407-1235-4cb3-b36d-3baaa1a3b6dd', b_id, '40011580-afe3-43e7-8c03-a6ad7fa710ac', 'Hiace', 'Valy Al Madinah', 'King Abdulaziz International Airport (JED)', '2026-10-29 00:00:00', '1200', '19:30', 'QR 1187', 0, 'GBP', NULL, NULL, NULL, 0, 0);

END $$;

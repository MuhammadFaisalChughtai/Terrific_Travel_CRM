DO $$ 
DECLARE
  b_id text;
BEGIN
  SELECT "id" INTO b_id FROM "Booking" WHERE "bookingReference" = 'TT00976' LIMIT 1;
  IF b_id IS NULL THEN
    RAISE NOTICE 'Booking TT00976 not found';
    RETURN;
  END IF;

  DELETE FROM "AccommodationService" WHERE "bookingId" = b_id;

  INSERT INTO "AccommodationService" ("id", "bookingId", "vendorId", "hotelName", "roomType", "checkInDate", "checkOutDate", "mealType", "reservationNumber", "qty", "price", "currency", "otherCurrency", "conversionRate", "issueDate", "refundAmount", "fineAmount", "hotelConfirmationNumber", "hotelAddress", "lastCancellationDate", "city", "checkInTime", "checkOutTime") VALUES
  ('4a01010c-ebef-4ebc-bd97-ec59c4455305', b_id, '2', 'Al Shohada by Palm Rich Makkah', 'Triple Room', '2026-10-20 00:00:00', '2026-10-25 00:00:00', 'Breakfast', NULL, 2, 0, 'GBP', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, 'Makkah', '16:00', '12:00'),
  ('ce02cfd6-04d1-4cb2-92ed-19c66c9dad3b', b_id, '2', 'Valy Al Madinah', 'Triple Room', '2026-10-25 00:00:00', '2026-10-29 00:00:00', 'Breakfast', NULL, 2, 0, 'GBP', NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, 'Madinah', '16:00', '12:00');

END $$;

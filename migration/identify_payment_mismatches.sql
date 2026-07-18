-- ====================================================================
-- SQL Script to Identify Payment Status Mismatches
-- Finds bookings marked as Fully Paid in Excel but Unpaid in CRM
-- ====================================================================

SELECT DISTINCT
    b."bookingReference",
    fs."pnr",
    s."lead_passenger",
    s."excel_inv_amount" as "excel_amount",
    s."excel_receipt",
    b."paymentStatus" as "db_booking_payment_status",
    vp."status" as "db_vendor_payment_status"
FROM "StagingPolaniLedger" s
JOIN "FlightService" fs ON UPPER(fs."pnr") = UPPER(s."pnr")
JOIN "Booking" b ON fs."bookingId" = b."id"
LEFT JOIN "BookingVendorPayment" vp ON vp."bookingId" = b."id" AND vp."vendorId" = fs."vendorId"
WHERE s."excel_receipt" = 'Fully Paid'
  AND (b."paymentStatus" != 'PAID' OR vp."status" IS NULL OR vp."status" != 'PAID');

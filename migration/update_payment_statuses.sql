-- ====================================================================
-- SQL Script to Reconcile Mismatched Payment Statuses
-- Updates CRM bookings and vendor ledgers to PAID if Excel indicates Fully Paid
-- Handles combined PNR notations in database (e.g. "PNR/PNR")
-- ====================================================================

BEGIN;

-- 1. Update Booking Vendor Ledger Payments to PAID
UPDATE "BookingVendorPayment"
SET 
  "status" = 'PAID',
  "amountPaid" = "originalCost",
  "remainingBalance" = 0.0,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "bookingId" IN (
    SELECT DISTINCT b."id"
    FROM "StagingPolaniLedger" s
    JOIN "FlightService" fs ON (
        UPPER(fs."pnr") = UPPER(s."pnr") 
        OR fs."pnr" LIKE '%' || s."pnr" || '%'
        OR s."pnr" LIKE '%' || fs."pnr" || '%'
    )
    JOIN "Booking" b ON fs."bookingId" = b."id"
    WHERE s."excel_receipt" = 'Fully Paid'
)
AND "status" != 'PAID';

-- 2. Update Bookings status to PAID
UPDATE "Booking"
SET 
  "paymentStatus" = 'PAID',
  "paidAmount" = "totalPrice",
  "remainingAmount" = 0.0,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" IN (
    SELECT DISTINCT b."id"
    FROM "StagingPolaniLedger" s
    JOIN "FlightService" fs ON (
        UPPER(fs."pnr") = UPPER(s."pnr") 
        OR fs."pnr" LIKE '%' || s."pnr" || '%'
        OR s."pnr" LIKE '%' || fs."pnr" || '%'
    )
    JOIN "Booking" b ON fs."bookingId" = b."id"
    WHERE s."excel_receipt" = 'Fully Paid'
)
AND "paymentStatus" != 'PAID';

COMMIT;

-- ====================================================================
-- SQL Script to Insert Missing Bookings and Flight Segments
-- Maps Excel Invoice Date to CRM Travel Date and Booking Date
-- Assigns Creator and Agent to System Administrator (admin@tms.com)
-- Matches Lead Passenger to CRM user account
-- De-duplicates duplicate Excel rows having the same PNR, date, and price
-- Groups by folder_no and aggregates refund rows under refundAmount column
-- Associates flight services and vendor payments with Polani Travel LTD
-- ====================================================================

BEGIN;

WITH deduplicated_ledger AS (
  SELECT DISTINCT
    s.folder_no,
    s.pnr,
    s.lead_passenger,
    s.excel_inv_amount,
    s.excel_inv_date,
    s.excel_folder_status
  FROM "StagingPolaniLedger" s
  WHERE s.reconciliation_status = 'Missing in DB'
    -- Only include rows whose date is strictly before October 2025
    AND to_date(s.excel_inv_date, 'DD/Mon/YYYY') < '2025-10-01'::date
),
missing_data AS (
  SELECT 
    gen_random_uuid() as new_booking_id,
    d.folder_no,
    MIN(d.pnr) as pnr,
    MIN(d.lead_passenger) as lead_passenger,
    -- Sum purchase price (excluding refund rows)
    SUM(CASE WHEN d.excel_folder_status NOT IN ('Partial Refund', 'Refund Request') THEN COALESCE(d.excel_inv_amount, 0.0) ELSE 0.0 END) as total_price,
    -- Sum refund price
    SUM(CASE WHEN d.excel_folder_status IN ('Partial Refund', 'Refund Request') THEN COALESCE(d.excel_inv_amount, 0.0) ELSE 0.0 END) as refund_price,
    -- Use earliest purchase date as travel date
    COALESCE(
      MIN(CASE WHEN d.excel_folder_status NOT IN ('Partial Refund', 'Refund Request') THEN to_date(d.excel_inv_date, 'DD/Mon/YYYY') ELSE NULL END),
      MIN(to_date(d.excel_inv_date, 'DD/Mon/YYYY'))
    ) as travel_date,
    -- Resolve System Administrator profile
    (SELECT id FROM "User" WHERE email = 'admin@tms.com' LIMIT 1) as admin_user_id
  FROM deduplicated_ledger d
  WHERE NOT EXISTS (
        SELECT 1 FROM "Booking" b WHERE b."bookingReference" = 'PLN-' || d.folder_no
  )
  -- Group strictly by folder_no to ensure one booking header per folder
  GROUP BY d.folder_no
),
inserted_bookings AS (
  INSERT INTO "Booking" (
    "id", 
    "userId", 
    "status", 
    "totalPrice", 
    "bookingReference", 
    "bookingDate", 
    "departureDate", 
    "paidAmount", 
    "paymentStatus", 
    "createdAt", 
    "updatedAt",
    "createdById",
    "assignedToId",
    "lockedStatus",
    "refundAmount",
    "cardPaymentCharges",
    "cancellationCharges",
    "remainingAmount"
  )
  SELECT 
    md.new_booking_id,
    COALESCE(
      (
        SELECT u.id FROM "User" u 
        WHERE UPPER(u."firstName" || ' ' || u."lastName") = UPPER(md.lead_passenger) 
           OR UPPER(u."lastName" || ' ' || u."firstName") = UPPER(md.lead_passenger)
        LIMIT 1
      ),
      (SELECT id FROM "User" WHERE email = 'customer@tms.com' LIMIT 1),
      (SELECT id FROM "User" LIMIT 1)
    ) as resolved_user_id,
    'CONFIRMED'::"BookingStatus",
    md.total_price,
    'PLN-' || md.folder_no,
    md.travel_date, -- Booking Date mapped to Invoice Date
    md.travel_date, -- Travel Date mapped to Invoice Date
    md.total_price,
    'PAID',
    md.travel_date, -- Created Date mapped to Invoice Date
    md.travel_date, -- Updated Date mapped to Invoice Date
    md.admin_user_id,
    md.admin_user_id,
    'UNLOCKED',
    md.refund_price, -- Maps refund row amounts here
    0.0,
    0.0,
    0.0
  FROM missing_data md
  RETURNING "id", "bookingReference"
)
-- Insert Flight Service segments from deduplicated ledger
INSERT INTO "FlightService" (
  "id",
  "bookingId",
  "pnr",
  "price",
  "vendorId",
  "date",
  "flightNo",
  "departedFrom",
  "arrivedAt",
  "departTime",
  "arrivalTime",
  "currency",
  "status",
  "refundAmount",
  "fineAmount"
)
SELECT
  gen_random_uuid(),
  ib."id",
  d.pnr,
  CASE WHEN d.excel_folder_status NOT IN ('Partial Refund', 'Refund Request') THEN COALESCE(d.excel_inv_amount, 0.0) ELSE 0.0 END as price,
  '5', -- Polani Travel LTD Vendor ID
  to_date(d.excel_inv_date, 'DD/Mon/YYYY'), -- Flight Date mapped to Invoice Date
  'UNKNOWN',
  'UNKNOWN',
  'UNKNOWN',
  '00:00',
  '00:00',
  'GBP',
  'CONFIRMED',
  CASE WHEN d.excel_folder_status IN ('Partial Refund', 'Refund Request') THEN COALESCE(d.excel_inv_amount, 0.0) ELSE 0.0 END as refund_amount, -- Maps segment refunds here
  0.0
FROM deduplicated_ledger d
JOIN inserted_bookings ib ON ib."bookingReference" = 'PLN-' || d.folder_no;

COMMIT;

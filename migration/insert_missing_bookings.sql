-- ====================================================================
-- SQL Script to Insert Missing Bookings and Flight Segments
-- Maps Excel Invoice Date to CRM Travel Date
-- Assigns Creator and Agent to System Administrator (admin@tms.com)
-- Matches Lead Passenger to CRM user account (or defaults to customer@tms.com)
-- Associates flight services and vendor payments with Polani Travel LTD
-- ====================================================================

BEGIN;

WITH missing_data AS (
  SELECT 
    gen_random_uuid() as new_booking_id,
    s.folder_no,
    s.pnr,
    s.lead_passenger,
    COALESCE(s.excel_inv_amount, 0.0) as total_price,
    to_date(s.excel_inv_date, 'DD/Mon/YYYY') as travel_date,
    -- Resolve customer user profile in CRM
    COALESCE(
      (
        SELECT u.id FROM "User" u 
        WHERE UPPER(u."firstName" || ' ' || u."lastName") = UPPER(s.lead_passenger) 
           OR UPPER(u."lastName" || ' ' || u."firstName") = UPPER(s.lead_passenger)
        LIMIT 1
      ),
      (SELECT id FROM "User" WHERE email = 'customer@tms.com' LIMIT 1),
      (SELECT id FROM "User" LIMIT 1)
    ) as resolved_user_id,
    -- Resolve System Administrator profile
    (SELECT id FROM "User" WHERE email = 'admin@tms.com' LIMIT 1) as admin_user_id
  FROM "StagingPolaniLedger" s
  WHERE s.reconciliation_status = 'Missing in DB'
  -- Group by folder_no to ensure one booking header per folder
  GROUP BY s.folder_no, s.pnr, s.lead_passenger, s.excel_inv_amount, s.excel_inv_date
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
    md.resolved_user_id,
    'CONFIRMED'::"BookingStatus",
    md.total_price,
    'PLN-' || md.folder_no,
    CURRENT_TIMESTAMP,
    md.travel_date, -- Invoice Date mapped to Travel Date
    md.total_price,
    'PAID',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    md.admin_user_id, -- Assign System Admin as Creator
    md.admin_user_id, -- Assign System Admin as Assigned Agent
    'UNLOCKED',
    0.0,
    0.0,
    0.0,
    0.0
  FROM missing_data md
  RETURNING "id", "bookingReference"
)
-- Insert Flight Service segments linked to the new bookings
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
  md.pnr,
  md.total_price,
  '5f298e6a-ca20-4742-9a73-13f5d9abded1', -- Polani Travel LTD Vendor UUID
  md.travel_date, -- Flight segment date mapped to Invoice Date
  'UNKNOWN',
  'UNKNOWN',
  'UNKNOWN',
  '00:00',
  '00:00',
  'GBP',
  'CONFIRMED',
  0.0,
  0.0
FROM missing_data md
JOIN inserted_bookings ib ON ib."bookingReference" = 'PLN-' || md.folder_no;

COMMIT;

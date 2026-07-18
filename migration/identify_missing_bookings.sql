-- ====================================================================
-- SQL Script to Identify Missing Bookings
-- Matches the staging table against active flight services in the CRM by PNR
-- ====================================================================

SELECT DISTINCT
    "pnr",
    "lead_passenger",
    "excel_inv_amount",
    "excel_inv_date"
FROM "StagingPolaniLedger"
WHERE "pnr" IS NOT NULL AND "pnr" != '' AND "pnr" != '[EMPTY PNR]'
  AND NOT EXISTS (
      SELECT 1 
      FROM "FlightService" fs 
      WHERE UPPER(fs."pnr") = UPPER("StagingPolaniLedger"."pnr")
  );

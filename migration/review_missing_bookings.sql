-- ====================================================================
-- SQL Script to Review Details of Missing Bookings
-- Extracts detailed row-level fields from the staging table for validation
-- ====================================================================

SELECT 
    "excel_row",
    "folder_no",
    "pnr",
    "lead_passenger",
    "excel_travel_date" as "excel_original_travel_date",
    "excel_inv_date" as "excel_invoice_date_to_use",
    "excel_inv_amount",
    "excel_folder_status",
    "excel_receipt"
FROM "StagingPolaniLedger"
WHERE "reconciliation_status" = 'Missing in DB'
ORDER BY "excel_row"::integer;

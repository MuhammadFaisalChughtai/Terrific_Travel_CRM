-- SQL script to fix the existing 'Refund from Vendor' transaction for JED flights (booking TT00962)
-- This updates it from a Credit to a Debit in the global financial ledger.

BEGIN;

UPDATE "VendorLedger"
SET 
  "debit" = 368.80, 
  "credit" = 0.0
WHERE "eventType" = 'VENDOR_REFUND'
  AND "credit" = 368.80
  AND "notes" LIKE '%SV119%'
  AND "createdAt" >= '2026-07-16 00:00:00';

COMMIT;

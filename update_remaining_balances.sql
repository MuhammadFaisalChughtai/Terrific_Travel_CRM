-- ========================================================
-- SQL Update Script for "Booking" table
-- Correct Remaining Balances loaded from admin_relational_data.json
-- Target SQL File: TMS_210720261144.sql
-- Generated At: 2026-07-21T10:49:14.133Z
-- Mismatches Found & Corrected: 45
-- ========================================================

BEGIN;

UPDATE "Booking" SET "remainingAmount" = 1, "paidAmount" = 5540, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00596';
UPDATE "Booking" SET "remainingAmount" = 1, "paidAmount" = 463, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00618';
UPDATE "Booking" SET "remainingAmount" = 28, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00655';
UPDATE "Booking" SET "remainingAmount" = 51.41, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00656';
UPDATE "Booking" SET "remainingAmount" = 670, "paidAmount" = 1000, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00660';
UPDATE "Booking" SET "remainingAmount" = 0.8, "paidAmount" = 823, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00667';
UPDATE "Booking" SET "remainingAmount" = 10, "paidAmount" = 5905, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00668';
UPDATE "Booking" SET "remainingAmount" = 95, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00678';
UPDATE "Booking" SET "remainingAmount" = 388, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00682';
UPDATE "Booking" SET "remainingAmount" = 165, "paidAmount" = 2775, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00688';
UPDATE "Booking" SET "remainingAmount" = 14.09, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00695';
UPDATE "Booking" SET "remainingAmount" = 2675, "paidAmount" = 300, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00710';
UPDATE "Booking" SET "remainingAmount" = 137, "paidAmount" = 248, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00711';
UPDATE "Booking" SET "remainingAmount" = 882, "paidAmount" = 713, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00730';
UPDATE "Booking" SET "remainingAmount" = 358, "paidAmount" = 2077, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00758';
UPDATE "Booking" SET "remainingAmount" = 5.4, "paidAmount" = 1587.6, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00780';
UPDATE "Booking" SET "remainingAmount" = 250, "paidAmount" = 6500, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00803';
UPDATE "Booking" SET "remainingAmount" = 75, "paidAmount" = 2000, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00824';
UPDATE "Booking" SET "remainingAmount" = 1905, "paidAmount" = 300, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00825';
UPDATE "Booking" SET "remainingAmount" = 1905, "paidAmount" = 300, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00826';
UPDATE "Booking" SET "remainingAmount" = 315, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00843';
UPDATE "Booking" SET "remainingAmount" = 1330, "paidAmount" = 2000, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00846';
UPDATE "Booking" SET "remainingAmount" = 0, "paidAmount" = 1141, "paymentStatus" = 'PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00849';
UPDATE "Booking" SET "remainingAmount" = 1425.07, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00854';
UPDATE "Booking" SET "remainingAmount" = 64.58, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00856';
UPDATE "Booking" SET "remainingAmount" = 5120, "paidAmount" = 4000, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00862';
UPDATE "Booking" SET "remainingAmount" = 340, "paidAmount" = 9110, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00867';
UPDATE "Booking" SET "remainingAmount" = 160, "paidAmount" = 250, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00876';
UPDATE "Booking" SET "remainingAmount" = 5500, "paidAmount" = 500, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00905';
UPDATE "Booking" SET "remainingAmount" = 670, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00914';
UPDATE "Booking" SET "remainingAmount" = 188, "paidAmount" = 4300, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00918';
UPDATE "Booking" SET "remainingAmount" = 3000, "paidAmount" = 975, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00919';
UPDATE "Booking" SET "remainingAmount" = 8235, "paidAmount" = 4215, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00928';
UPDATE "Booking" SET "remainingAmount" = 7634, "paidAmount" = 3966, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00932';
UPDATE "Booking" SET "remainingAmount" = 3600, "paidAmount" = 600, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00943';
UPDATE "Booking" SET "remainingAmount" = 1563, "paidAmount" = 855, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00944';
UPDATE "Booking" SET "remainingAmount" = 1890, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00946';
UPDATE "Booking" SET "remainingAmount" = 25, "paidAmount" = 11050, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00947';
UPDATE "Booking" SET "remainingAmount" = 2000, "paidAmount" = 4210, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00948';
UPDATE "Booking" SET "remainingAmount" = 170, "paidAmount" = 0, "paymentStatus" = 'UNPAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00953';
UPDATE "Booking" SET "remainingAmount" = 130, "paidAmount" = 50, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00956';
UPDATE "Booking" SET "remainingAmount" = 2860, "paidAmount" = 3000, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00957';
UPDATE "Booking" SET "remainingAmount" = 3380.66, "paidAmount" = 4989.34, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00960';
UPDATE "Booking" SET "remainingAmount" = 630, "paidAmount" = 1570, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00962';
UPDATE "Booking" SET "remainingAmount" = 1015, "paidAmount" = 40, "paymentStatus" = 'PARTIALLY_PAID', "updatedAt" = CURRENT_TIMESTAMP WHERE "bookingReference" = 'TT00968';

COMMIT;

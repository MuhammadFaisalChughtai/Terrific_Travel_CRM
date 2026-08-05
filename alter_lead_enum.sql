UPDATE "DocumentTemplate" SET "htmlContent" = NULL WHERE "templateType" = 'FLIGHT_TICKET';
SELECT "id", "templateType", "htmlContent" FROM "DocumentTemplate";

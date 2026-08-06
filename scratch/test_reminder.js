const { runMissingDetailsCheck } = require('./apps/backend/dist/src/cron/missing-details-reminder.cron');

async function test() {
  console.log("Starting manual check test...");
  const result = await runMissingDetailsCheck();
  console.log("Result:", result);
  process.exit(0);
}

test().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});

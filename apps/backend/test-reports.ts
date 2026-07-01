import { reportsService } from './src/services/reports.service';
import { prisma } from './src/config';

async function test() {
  try {
    const data = await reportsService.getBalanceSheet();
    console.log("Balance Sheet Data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    prisma.$disconnect();
  }
}

test();

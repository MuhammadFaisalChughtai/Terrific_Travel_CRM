import { Request, Response } from 'express';
import { reportsService } from '../services/reports.service';
import { asyncHandler } from '../middleware/async.middleware';

export const getBalanceSheet = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  
  const m = month ? parseInt(month as string, 10) : undefined;
  const y = year ? parseInt(year as string, 10) : undefined;

  const data = await reportsService.getBalanceSheet(m, y);
  
  res.status(200).json({
    success: true,
    data
  });
});

import { Request, Response } from 'express';
import { paymentsService } from '../services/payments.service';
import { asyncHandler } from '../middleware/async.middleware';

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentsService.checkout(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentsService.webhook(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentsService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

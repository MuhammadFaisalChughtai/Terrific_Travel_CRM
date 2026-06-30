import { Request, Response } from 'express';
import { paymentsService } from '../services/payments.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const submitPaymentRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'system';
  const result = await paymentsService.submitPaymentRequest(req.body, userId);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getPaymentRequests = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await paymentsService.getPaymentRequests(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const approvePaymentRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'system';
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Admin';
  const result = await paymentsService.approvePaymentRequest(req.params.id, userId, adminName);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const rejectPaymentRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'system';
  const result = await paymentsService.rejectPaymentRequest(req.params.id, req.body.reason, userId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

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

export const recordTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id || 'system';
  const adminName = req.user ? `${req.user.firstName} ${req.user.lastName}` : 'Admin';
  const result = await paymentsService.recordTransaction(req.body, userId, adminName);
  res.status(200).json({
    success: true,
    data: result,
  });
});

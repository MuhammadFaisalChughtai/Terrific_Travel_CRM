import { Response } from 'express';
import { issuanceService } from '../services/issuance.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await issuanceService.findAll(req.user, req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await issuanceService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await issuanceService.create(req.user!.id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const createFromBooking = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { bookingId } = req.params;
  const result = await issuanceService.createFromBooking(req.user!.id, bookingId, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await issuanceService.updateStatus(id, req.user!, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await issuanceService.update(id, req.user!, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

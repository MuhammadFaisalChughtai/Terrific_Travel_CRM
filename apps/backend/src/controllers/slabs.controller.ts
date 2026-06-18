import { Response } from 'express';
import { slabsService } from '../services/slabs.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await slabsService.findAll();
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await slabsService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await slabsService.create(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await slabsService.update(id, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteSlab = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await slabsService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

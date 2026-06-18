import { Response } from 'express';
import { usersService } from '../services/users.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await usersService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await usersService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await usersService.update(id, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

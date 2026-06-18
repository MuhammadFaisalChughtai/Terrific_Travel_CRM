import { Response } from 'express';
import { uploadsService } from '../services/uploads.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const uploadSingle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await uploadsService.uploadSingle(req.user!.id, req.file);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const uploadMultiple = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const result = await uploadsService.uploadMultiple(req.user!.id, files);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getPresigned = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { bucket, key } = req.params;
  const result = await uploadsService.getPresigned(bucket, key);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await uploadsService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

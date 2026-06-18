import { Request, Response } from 'express';
import { toursService } from '../services/tours.service';
import { asyncHandler } from '../middleware/async.middleware';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await toursService.create(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await toursService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await toursService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await toursService.update(id, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteTour = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await toursService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

import { Request, Response } from 'express';
import { flightsService } from '../services/flights.service';
import { asyncHandler } from '../middleware/async.middleware';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await flightsService.create(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const result = await flightsService.search(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await flightsService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await flightsService.update(id, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteFlight = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await flightsService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getAirportByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  const result = await flightsService.findAirportByCode(code);
  res.status(200).json({
    success: true,
    data: result,
  });
});

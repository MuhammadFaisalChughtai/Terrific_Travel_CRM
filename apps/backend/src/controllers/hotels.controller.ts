import { Request, Response } from "express";
import { hotelsService } from "../services/hotels.service";
import { asyncHandler } from "../middleware/async.middleware";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await hotelsService.create(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const findAll = asyncHandler(async (req: Request, res: Response) => {
  const result = await hotelsService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await hotelsService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await hotelsService.update(id, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteHotel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await hotelsService.delete(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

// Room controllers
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { id: hotelId } = req.params;
  const result = await hotelsService.createRoom(hotelId, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await hotelsService.updateRoom(roomId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const result = await hotelsService.deleteRoom(roomId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

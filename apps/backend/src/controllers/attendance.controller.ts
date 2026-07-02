import { Request, Response } from 'express';
import { attendanceService } from '../services/attendance.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const checkIn = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await attendanceService.checkIn(userId);
  res.status(200).json({ success: true, data: result });
});

export const checkOut = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await attendanceService.checkOut(userId);
  res.status(200).json({ success: true, data: result });
});

export const getTodayStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const result = await attendanceService.getTodayStatus(userId);
  res.status(200).json({ success: true, data: result });
});

export const getAllAttendance = asyncHandler(async (req: Request, res: Response) => {
  const result = await attendanceService.getAllAttendance(req.query);
  res.status(200).json({ success: true, data: result });
});

export const updateAttendance = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await attendanceService.updateAttendance(id, req.body);
  res.status(200).json({ success: true, data: result });
});

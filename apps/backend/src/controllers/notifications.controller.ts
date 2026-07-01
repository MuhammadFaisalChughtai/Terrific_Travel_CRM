import { Response } from 'express';
import { prisma } from '../config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/async.middleware';

export const getMyNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  
  res.status(200).json({ success: true, data: notifications });
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const notification = await prisma.notification.findFirst({
    where: { id, userId }
  });

  if (notification) {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  res.status(200).json({ success: true, message: 'Notification marked as read.' });
});

export const clearAllNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  await prisma.notification.deleteMany({
    where: { userId }
  });

  res.status(200).json({ success: true, message: 'All notifications cleared.' });
});

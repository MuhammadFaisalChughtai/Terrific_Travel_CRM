import { Router } from 'express';
import { checkIn, checkOut, getTodayStatus, getAllAttendance } from '../controllers/attendance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

import { prisma } from '../config';
router.get('/debug', async (req, res) => {
  const records = await prisma.attendance.findMany();
  res.json({ success: true, data: records });
});

router.use(authMiddleware as any);

// Agent routes
router.post('/check-in', requireRoles('Agent', 'TRAVEL_AGENT') as any, checkIn);
router.post('/check-out', requireRoles('Agent', 'TRAVEL_AGENT') as any, checkOut);
router.get('/today', requireRoles('Agent', 'TRAVEL_AGENT') as any, getTodayStatus);

// Admin routes
router.get('/admin/all', requireRoles('SUPER_ADMIN', 'ADMIN') as any, getAllAttendance);

import { prisma } from '../config';
router.get('/debug', async (req, res) => {
  const records = await prisma.attendance.findMany();
  res.json({ success: true, data: records });
});

export default router;

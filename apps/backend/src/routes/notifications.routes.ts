import { Router } from 'express';
import { getMyNotifications, markAsRead, clearAllNotifications } from '../controllers/notifications.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware as any);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.delete('/', clearAllNotifications);

export default router;

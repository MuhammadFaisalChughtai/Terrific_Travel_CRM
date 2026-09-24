import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import {
  recordHeartbeat,
  recordClipboardEvent,
  getLiveAgents,
  getAuditLogs,
  getScreenshotStream,
  getStatus,
} from '../controllers/agent-monitor.controller';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

const router = Router();

// All routes require authentication
router.use(authMiddleware as any);

// Endpoints called by desktop companion app & client check
router.post('/heartbeat', recordHeartbeat);
router.post('/clipboard-event', upload.single('screenshot'), recordClipboardEvent);
router.get('/status', getStatus);

// Admin/Superadmin-only inspection endpoints
router.get('/live', requireRoles('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN') as any, getLiveAgents);
router.get('/audit', requireRoles('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN') as any, getAuditLogs);
router.get('/screenshot/*', requireRoles('ADMIN', 'SUPER_ADMIN', 'SUPERADMIN') as any, getScreenshotStream);

export default router;

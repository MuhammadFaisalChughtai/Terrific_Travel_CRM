import { Router } from 'express';
import { findAll, findOne, update } from '../controllers/invoices.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all invoice routes
router.use(authMiddleware as any);

router.get('/', requirePermissions('invoices:read') as any, findAll);
router.get('/:id', requirePermissions('invoices:read') as any, findOne);
router.patch('/:id', requirePermissions('invoices:edit') as any, update);

// Reject DELETE requests system-wide
router.delete('/:id', (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Hard deletion of invoice records is disabled system-wide to preserve audit logs.'
  });
});

export default router;

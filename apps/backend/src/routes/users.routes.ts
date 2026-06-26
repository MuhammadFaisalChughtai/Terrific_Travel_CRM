import { Router } from 'express';
import { findAll, findOne, update, create, resetPassword, getRoles, getPermissions, updateRolePermissions } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all user routes
router.use(authMiddleware as any);

router.post('/', requirePermissions('users:manage') as any, create);
router.get('/', requirePermissions('users:manage') as any, findAll);

// Roles & Permissions management (must be BEFORE /:id)
router.get('/roles', requirePermissions('permissions:manage') as any, getRoles);
router.get('/permissions', requirePermissions('permissions:manage') as any, getPermissions);
router.patch('/roles/:roleId/permissions', requirePermissions('permissions:manage') as any, updateRolePermissions);

router.get('/:id', (req: any, res: any, next: any) => {
  if (req.user && req.params.id === req.user.id) {
    return next();
  }
  return (requirePermissions('users:manage') as any)(req, res, next);
}, findOne);
router.patch('/:id', requirePermissions('users:manage') as any, update);
router.post('/:id/reset-password', requirePermissions('users:manage') as any, resetPassword);

// Reject DELETE requests system-wide
router.delete('/:id', (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Hard deletion of user accounts is disabled system-wide to preserve audit logs. Please deactivate the user instead.'
  });
});

export default router;

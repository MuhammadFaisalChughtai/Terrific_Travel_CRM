import { Router } from 'express';
import {
  findAll,
  findOne,
  update,
  create,
  resetPassword,
  getRoles,
  getPermissions,
  updateRolePermissions,
  createRole,
  updateRole,
  deleteRole,
  remove,
} from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermissions } from '../middleware/rbac.middleware';

const router = Router();

// Secure all user routes
router.use(authMiddleware as any);

router.post('/', requirePermissions('users:manage') as any, create);
router.get('/', requirePermissions('users:manage', 'users:read', 'agents:read', 'leads:manage', 'leads:read') as any, findAll);

// Roles & Permissions management (must be BEFORE /:id)
router.get('/roles', requirePermissions('permissions:manage', 'roles:manage', 'roles:read') as any, getRoles);
router.post('/roles', requirePermissions('permissions:manage', 'roles:manage') as any, createRole);
router.patch('/roles/:roleId', requirePermissions('permissions:manage', 'roles:manage') as any, updateRole);
router.delete('/roles/:roleId', requirePermissions('permissions:manage', 'roles:manage') as any, deleteRole);
router.get('/permissions', requirePermissions('permissions:manage', 'roles:manage') as any, getPermissions);
router.patch('/roles/:roleId/permissions', requirePermissions('permissions:manage', 'roles:manage') as any, updateRolePermissions);

router.get('/:id', (req: any, res: any, next: any) => {
  if (req.user && req.params.id === req.user.id) {
    return next();
  }
  return (requirePermissions('users:manage') as any)(req, res, next);
}, findOne);
router.patch('/:id', requirePermissions('users:manage') as any, update);
router.post('/:id/reset-password', requirePermissions('users:manage') as any, resetPassword);

// Delete user (hard delete — admin only, with safeguards)
router.delete('/:id', requirePermissions('users:manage') as any, remove);

export default router;

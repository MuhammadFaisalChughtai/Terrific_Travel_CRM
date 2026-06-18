import { Router } from 'express';
import { create, findAll, findOne, update, deleteHotel, createRoom, updateRoom, deleteRoom } from '../controllers/hotels.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', findAll);
router.get('/:id', findOne);

// Protected routes
router.post('/', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, create);
router.patch('/:id', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, update);
router.delete('/:id', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteHotel);

// Room routes
router.post('/:id/rooms', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, createRoom);
router.patch('/rooms/:roomId', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updateRoom);
router.delete('/rooms/:roomId', authMiddleware as any, requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteRoom);

export default router;

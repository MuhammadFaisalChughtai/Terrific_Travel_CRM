import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';
import {
  getTransportRates,
  addTransportRate,
  updateTransportRate,
  deleteTransportRate,
  lookupTransportRate,
  getVisaRates,
  addVisaRate,
  updateVisaRate,
  deleteVisaRate,
} from '../controllers/catalog.controller';

const router = Router();

// Secure all routes
router.use(authMiddleware as any);

// Transport Rates
router.get('/transports', getTransportRates);
router.get('/transports/lookup', lookupTransportRate);
router.post('/transports', requireRoles('SUPER_ADMIN', 'ADMIN') as any, addTransportRate);
router.patch('/transports/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, updateTransportRate);
router.delete('/transports/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteTransportRate);

// Visa Rates
router.get('/visas', getVisaRates);
router.post('/visas', requireRoles('SUPER_ADMIN', 'ADMIN') as any, addVisaRate);
router.patch('/visas/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, updateVisaRate);
router.delete('/visas/:id', requireRoles('SUPER_ADMIN', 'ADMIN') as any, deleteVisaRate);

export default router;

import { Router } from 'express';
import {
  getTransportMatrix,
  getTransportOptions,
  upsertTransportRate,
  createRoute,
  updateRoute,
  deleteRoute,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVisaCatalog,
  createVisa,
  updateVisa,
  deleteVisa,
  resetCatalog,
} from '../controllers/catalog.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protect all catalog endpoints
router.use(authMiddleware as any);

// Transport Matrix & Quick Options
router.get('/transport-matrix', getTransportMatrix);
router.get('/transport-options', getTransportOptions);
router.post('/transport-rates', upsertTransportRate);

// Transport Routes & Vehicles
router.post('/transport-routes', createRoute);
router.patch('/transport-routes/:id', updateRoute);
router.delete('/transport-routes/:id', deleteRoute);

router.post('/transport-vehicles', createVehicle);
router.patch('/transport-vehicles/:id', updateVehicle);
router.delete('/transport-vehicles/:id', deleteVehicle);

// Visa Catalog
router.get('/visas', getVisaCatalog);
router.post('/visas', createVisa);
router.patch('/visas/:id', updateVisa);
router.delete('/visas/:id', deleteVisa);

// Reset / Seed catalog to defaults
router.post('/reset', resetCatalog);

export default router;

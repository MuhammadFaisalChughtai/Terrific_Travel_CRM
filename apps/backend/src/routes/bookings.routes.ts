import { Router } from 'express';
import multer from 'multer';
import { create, findAll, findOne, updateStatus, cancel, finalizeMargin, addFlightService, updateFlightService, deleteFlightService, addAccommodationService, updateAccommodationService, deleteAccommodationService, addPassenger, updatePassenger, deletePassenger, getPassengerForm, submitPassengerForm, sendPassengerLink, uploadPassengerPassportScan, getPassengerPassportScan, deletePassengerPassportScan, addPassengerDocument, getPassengerDocumentFile, deletePassengerDocument, addPassengerByFormToken, deletePassengerByFormToken, adminUploadPassportScan, adminGetPassportScan, adminDeletePassportScan, adminAddPassengerDocument, adminGetPassengerDocumentFile, adminDeletePassengerDocument, searchAllPassengers, addTransportService, updateTransportService, deleteTransportService } from '../controllers/bookings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles } from '../middleware/rbac.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ── Public routes (no auth) — must be BEFORE the authMiddleware.use() ─────────
router.get('/passenger-form/:token', getPassengerForm);
router.put('/passenger-form/:token', submitPassengerForm);
router.post('/passenger-form/:token/upload/:passengerId', upload.single('file'), uploadPassengerPassportScan);
router.get('/passenger-form/:token/passport-scan/:passengerId', getPassengerPassportScan);
router.delete('/passenger-form/:token/passport-scan/:passengerId', deletePassengerPassportScan);
router.post('/passenger-form/:token/documents/:passengerId', upload.single('file'), addPassengerDocument);
router.get('/passenger-form/:token/documents/:documentId/file', getPassengerDocumentFile);
router.delete('/passenger-form/:token/documents/:documentId', deletePassengerDocument);
router.post('/passenger-form/:token/passenger', addPassengerByFormToken);
router.delete('/passenger-form/:token/passenger/:passengerId', deletePassengerByFormToken);

// Secure all remaining booking routes
router.use(authMiddleware as any);

router.get('/passengers/global-search', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, searchAllPassengers);

router.post('/', create);
router.get('/', findAll);
router.get('/:id', findOne);
router.patch('/:id/status', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updateStatus);
router.patch('/:id/finalize-margin', requireRoles('SUPER_ADMIN', 'ADMIN') as any, finalizeMargin);
router.post('/:id/flights', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, addFlightService);
router.patch('/:id/flights/:flightServiceId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updateFlightService);
router.delete('/:id/flights/:flightServiceId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, deleteFlightService);

router.post('/:id/accommodations', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, addAccommodationService);
router.patch('/:id/accommodations/:accommodationId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updateAccommodationService);
router.delete('/:id/accommodations/:accommodationId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, deleteAccommodationService);

router.post('/:id/transports', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, addTransportService);
router.patch('/:id/transports/:transportServiceId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updateTransportService);
router.delete('/:id/transports/:transportServiceId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, deleteTransportService);

// Passenger CRUD
router.post('/:id/passengers', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, addPassenger);
router.patch('/:id/passengers/:passengerId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, updatePassenger);
router.delete('/:id/passengers/:passengerId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, deletePassenger);
router.post('/:id/passengers/:passengerId/send-link', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, sendPassengerLink);

// Admin passport scan (authenticated)
router.post('/:id/passengers/:passengerId/passport-scan', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, upload.single('file'), adminUploadPassportScan);
router.get('/:id/passengers/:passengerId/passport-scan', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, adminGetPassportScan);
router.delete('/:id/passengers/:passengerId/passport-scan', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, adminDeletePassportScan);

// Admin additional documents (authenticated)
router.post('/:id/passengers/:passengerId/documents', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, upload.single('file'), adminAddPassengerDocument);
router.get('/:id/documents/:documentId/file', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, adminGetPassengerDocumentFile);
router.delete('/:id/documents/:documentId', requireRoles('SUPER_ADMIN', 'ADMIN', 'TRAVEL_AGENT') as any, adminDeletePassengerDocument);

router.delete('/:id', cancel);

export default router;

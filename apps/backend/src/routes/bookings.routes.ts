import { Router } from 'express';
import multer from 'multer';
import { create, findAll, findOne, updateStatus, updateBookingDetails, toggleLock, cancel, finalizeMargin, addFlightService, updateFlightService, deleteFlightService, addAccommodationService, updateAccommodationService, deleteAccommodationService, addPassenger, updatePassenger, deletePassenger, getPassengerForm, submitPassengerForm, sendPassengerLink, uploadPassengerPassportScan, getPassengerPassportScan, deletePassengerPassportScan, addPassengerDocument, getPassengerDocumentFile, deletePassengerDocument, addPassengerByFormToken, deletePassengerByFormToken, adminUploadPassportScan, adminGetPassportScan, adminDeletePassportScan, adminAddPassengerDocument, adminGetPassengerDocumentFile, adminDeletePassengerDocument, searchAllPassengers, addTransportService, updateTransportService, deleteTransportService, addVisaService, updateVisaService, deleteVisaService, addAdditionalService, updateAdditionalService, deleteAdditionalService } from '../controllers/bookings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRoles, requirePermissions, requireBookingOwnership } from '../middleware/rbac.middleware';

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

// Check bookings:read permission for viewing passenger global search and bookings
router.get('/passengers/global-search', requirePermissions('bookings:read') as any, searchAllPassengers);

router.post('/', requirePermissions('bookings:create') as any, create);
router.get('/', requirePermissions('bookings:read') as any, findAll);
router.get('/:id', requirePermissions('bookings:read') as any, findOne);

// Editing booking details or status requires ownership or bookings:edit_any
router.patch('/:id', requireBookingOwnership as any, updateBookingDetails);
router.patch('/:id/status', requireBookingOwnership as any, updateStatus);
router.patch('/:id/lock', requireRoles('Admin', 'Manager') as any, toggleLock);
router.patch('/:id/finalize-margin', requireRoles('Admin') as any, finalizeMargin);

// Booking segments edits require ownership
router.post('/:id/flights', requireBookingOwnership as any, addFlightService);
router.patch('/:id/flights/:flightServiceId', requireBookingOwnership as any, updateFlightService);
router.delete('/:id/flights/:flightServiceId', requireBookingOwnership as any, deleteFlightService);

router.post('/:id/accommodations', requireBookingOwnership as any, addAccommodationService);
router.patch('/:id/accommodations/:accommodationId', requireBookingOwnership as any, updateAccommodationService);
router.delete('/:id/accommodations/:accommodationId', requireBookingOwnership as any, deleteAccommodationService);

router.post('/:id/transports', requireBookingOwnership as any, addTransportService);
router.patch('/:id/transports/:transportServiceId', requireBookingOwnership as any, updateTransportService);
router.delete('/:id/transports/:transportServiceId', requireBookingOwnership as any, deleteTransportService);

router.post('/:id/visas', requireBookingOwnership as any, addVisaService);
router.patch('/:id/visas/:visaServiceId', requireBookingOwnership as any, updateVisaService);
router.delete('/:id/visas/:visaServiceId', requireBookingOwnership as any, deleteVisaService);

router.post('/:id/additional-services', requireBookingOwnership as any, addAdditionalService);
router.patch('/:id/additional-services/:serviceId', requireBookingOwnership as any, updateAdditionalService);
router.delete('/:id/additional-services/:serviceId', requireBookingOwnership as any, deleteAdditionalService);

// Passenger CRUD require ownership
router.post('/:id/passengers', requireBookingOwnership as any, addPassenger);
router.patch('/:id/passengers/:passengerId', requireBookingOwnership as any, updatePassenger);
router.delete('/:id/passengers/:passengerId', requireBookingOwnership as any, deletePassenger);
router.post('/:id/passengers/:passengerId/send-link', requireBookingOwnership as any, sendPassengerLink);

// Admin passport scan (authenticated)
router.post('/:id/passengers/:passengerId/passport-scan', requireBookingOwnership as any, upload.single('file'), adminUploadPassportScan);
router.get('/:id/passengers/:passengerId/passport-scan', requireBookingOwnership as any, adminGetPassportScan);
router.delete('/:id/passengers/:passengerId/passport-scan', requireBookingOwnership as any, adminDeletePassportScan);

// Admin additional documents (authenticated)
router.post('/:id/passengers/:passengerId/documents', requireBookingOwnership as any, upload.single('file'), adminAddPassengerDocument);
router.get('/:id/documents/:documentId/file', requireBookingOwnership as any, adminGetPassengerDocumentFile);
router.delete('/:id/documents/:documentId', requireBookingOwnership as any, adminDeletePassengerDocument);

// Soft cancel is done via PATCH, not DELETE
router.patch('/:id/cancel', requireBookingOwnership as any, cancel);

// Hard delete requests are rejected globally
router.delete('/:id', (req, res) => {
  res.status(403).json({
    success: false,
    message: 'Forbidden: Hard deletion of booking records is disabled system-wide to preserve audit logs. Please cancel or archive the booking instead.'
  });
});

export default router;

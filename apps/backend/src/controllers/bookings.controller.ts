import { Response } from 'express';
import { bookingsService } from '../services/bookings.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { minioService } from '../services/minio.service';

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await bookingsService.create(req.user!.id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const getNextReference = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await bookingsService.getNextReference();
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await bookingsService.findAll(req.user, req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await bookingsService.updateStatus(id, status, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const toggleLock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.toggleLock(id, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const cancel = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.delete(id, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const finalizeMargin = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { agentId } = req.body;
  const result = await bookingsService.finalizeMargin(id, agentId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateBookingDetails = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { totalPrice, agentId, departureDate } = req.body;
  const result = await bookingsService.updateBookingDetails(id, { totalPrice, agentId, departureDate }, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const addFlightService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addFlightService(id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateFlightService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, flightServiceId } = req.params;
  const result = await bookingsService.updateFlightService(id, flightServiceId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteFlightService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, flightServiceId } = req.params;
  const result = await bookingsService.deleteFlightService(id, flightServiceId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const addAccommodationService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addAccommodationService(id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateAccommodationService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, accommodationId } = req.params;
  const result = await bookingsService.updateAccommodationService(id, accommodationId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteAccommodationService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, accommodationId } = req.params;
  const result = await bookingsService.deleteAccommodationService(id, accommodationId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const addTransportService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addTransportService(id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateTransportService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, transportServiceId } = req.params;
  const result = await bookingsService.updateTransportService(id, transportServiceId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteTransportService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, transportServiceId } = req.params;
  const result = await bookingsService.deleteTransportService(id, transportServiceId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

// ─── Passenger controllers ────────────────────────────────────────────────────

export const addPassenger = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addPassenger(id, req.body);
  res.status(201).json({ success: true, data: result });
});

export const updatePassenger = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const result = await bookingsService.updatePassenger(id, passengerId, req.body);
  res.status(200).json({ success: true, data: result });
});

export const deletePassenger = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const result = await bookingsService.deletePassenger(id, passengerId);
  res.status(200).json({ success: true, data: result });
});

/** Public — no auth required */
export const getPassengerForm = asyncHandler(async (req: any, res: Response) => {
  const { token } = req.params;
  const result = await bookingsService.getPassengerByToken(token);
  res.status(200).json({ success: true, data: result });
});

/** Public — no auth required */
export const submitPassengerForm = asyncHandler(async (req: any, res: Response) => {
  const { token } = req.params;
  const result = await bookingsService.submitPassengerForm(token, req.body);
  res.status(200).json({ success: true, data: result });
});

export const sendPassengerLink = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const result = await bookingsService.sendPassengerLink(id, passengerId);
  res.status(200).json({ success: true, data: result });
});


/** Public — no auth required */
export const uploadPassengerPassportScan = asyncHandler(async (req: any, res: Response) => {
  const { token, passengerId } = req.params;
  const result = await bookingsService.uploadPassengerPassportScan(token, passengerId, req.file);
  res.status(200).json({ success: true, data: result });
});

/** Public — no auth required */
export const getPassengerPassportScan = asyncHandler(async (req: any, res: Response) => {
  const { token, passengerId } = req.params;
  const { bucket, key } = await bookingsService.getPassengerPassportScan(token, passengerId);
  const stream = await minioService.getObjectStream(bucket, key);
  const stat = await minioService.statObject(bucket, key);
  res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  stream.pipe(res);
});

/** Public — no auth required */
export const deletePassengerPassportScan = asyncHandler(async (req: any, res: Response) => {
  const { token, passengerId } = req.params;
  const result = await bookingsService.deletePassengerPassportScan(token, passengerId);
  res.status(200).json({ success: true, data: result });
});

/** Public — no auth required */
export const addPassengerDocument = asyncHandler(async (req: any, res: Response) => {
  const { token, passengerId } = req.params;
  const { title, description } = req.body;
  const result = await bookingsService.addPassengerDocument(token, passengerId, title, description, req.file);
  res.status(201).json({ success: true, data: result });
});

/** Public — no auth required */
export const getPassengerDocumentFile = asyncHandler(async (req: any, res: Response) => {
  const { token, documentId } = req.params;
  const { bucket, key } = await bookingsService.getPassengerDocumentFile(token, documentId);
  const stream = await minioService.getObjectStream(bucket, key);
  const stat = await minioService.statObject(bucket, key);
  res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  stream.pipe(res);
});

/** Public — no auth required */
export const deletePassengerDocument = asyncHandler(async (req: any, res: Response) => {
  const { token, documentId } = req.params;
  const result = await bookingsService.deletePassengerDocument(token, documentId);
  res.status(200).json({ success: true, data: result });
});

/** Public — no auth required */
export const addPassengerByFormToken = asyncHandler(async (req: any, res: Response) => {
  const { token } = req.params;
  const result = await bookingsService.addPassengerByFormToken(token);
  res.status(201).json({ success: true, data: result });
});

/** Public — no auth required */
export const deletePassengerByFormToken = asyncHandler(async (req: any, res: Response) => {
  const { token, passengerId } = req.params;
  const result = await bookingsService.deletePassengerByFormToken(token, passengerId);
  res.status(200).json({ success: true, data: result });
});

// ─── Admin passport scan (authenticated) ─────────────────────────────────────

export const adminUploadPassportScan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const result = await bookingsService.adminUploadPassportScan(id, passengerId, req.file);
  res.status(200).json({ success: true, data: result });
});

export const adminGetPassportScan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const { bucket, key } = await bookingsService.adminGetPassportScan(id, passengerId);
  const stream = await minioService.getObjectStream(bucket, key);
  const stat = await minioService.statObject(bucket, key);
  res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  stream.pipe(res);
});

export const adminDeletePassportScan = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const result = await bookingsService.adminDeletePassportScan(id, passengerId);
  res.status(200).json({ success: true, data: result });
});

// ─── Admin additional documents (authenticated) ───────────────────────────────

export const adminAddPassengerDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, passengerId } = req.params;
  const { title, description } = req.body;
  const result = await bookingsService.adminAddPassengerDocument(id, passengerId, title, description, req.file);
  res.status(201).json({ success: true, data: result });
});

export const adminGetPassengerDocumentFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, documentId } = req.params;
  const { bucket, key } = await bookingsService.adminGetPassengerDocumentFile(id, documentId);
  const stream = await minioService.getObjectStream(bucket, key);
  const stat = await minioService.statObject(bucket, key);
  res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  stream.pipe(res);
});

export const adminDeletePassengerDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, documentId } = req.params;
  const result = await bookingsService.adminDeletePassengerDocument(id, documentId);
  res.status(200).json({ success: true, data: result });
});

export const addVisaService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addVisaService(id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateVisaService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, visaServiceId } = req.params;
  const result = await bookingsService.updateVisaService(id, visaServiceId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteVisaService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, visaServiceId } = req.params;
  const result = await bookingsService.deleteVisaService(id, visaServiceId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const searchAllPassengers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const query = (req.query.q as string || '').trim();
  const result = await bookingsService.searchAllPassengers(query);
  res.status(200).json({ success: true, data: result });
});

export const addAdditionalService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await bookingsService.addAdditionalService(id, req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const updateAdditionalService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, serviceId } = req.params;
  const result = await bookingsService.updateAdditionalService(id, serviceId, req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const deleteAdditionalService = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id, serviceId } = req.params;
  const result = await bookingsService.deleteAdditionalService(id, serviceId);
  res.status(200).json({
    success: true,
    data: result,
  });
});

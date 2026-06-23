import { Request, Response, NextFunction } from 'express';
import { vendorsService } from '../services/vendors.service';

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.findAll(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await vendorsService.findOne(req.params.id);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await vendorsService.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await vendorsService.update(req.params.id, req.body);
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.delete(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getOutstandingBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = req.query.vendorId as string;
    const result = await vendorsService.getOutstandingBookings(vendorId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const processVendorPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const adminName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
    const result = await vendorsService.processVendorPayment(req.body, userId, adminName);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const reverseVendorPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const adminName = `${(req as any).user.firstName} ${(req as any).user.lastName}`;
    const { reason } = req.body;
    const result = await vendorsService.reversePayment(req.params.paymentId, userId, adminName, reason || 'Payment Reversal');
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.getLedger(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getWalletHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.getWalletHistory(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.getDashboardSummary(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.getPayments(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getGlobalLedger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vendorsService.getLedger();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

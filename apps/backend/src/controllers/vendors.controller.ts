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

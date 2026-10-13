import { Request, Response } from 'express';
import { catalogService } from '../services/catalog.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const isAdminOrManager = (user?: any) => {
  const roles = (user?.roles || []).map((r: any) => {
    const raw = typeof r === 'string' ? r : r?.name || '';
    return raw.toUpperCase().replace(/[\s_-]+/g, '');
  });
  return roles.some((r: string) =>
    ['ADMIN', 'SUPERADMIN', 'ADMINISTRATOR', 'ROOT', 'MANAGER', 'BRANCHMANAGER'].includes(r)
  );
};

export const getTransportMatrix = asyncHandler(async (req: Request, res: Response) => {
  const season = (req.query.season as string) || undefined;
  const result = await catalogService.getTransportMatrix(season);
  res.status(200).json({ success: true, data: result });
});

export const getTransportOptions = asyncHandler(async (req: Request, res: Response) => {
  const season = (req.query.season as string) || undefined;
  const result = await catalogService.getTransportOptions(season);
  res.status(200).json({ success: true, data: result });
});

export const upsertTransportRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can edit transport rates.' });
  }
  const result = await catalogService.upsertTransportRate(req.body);
  res.status(200).json({ success: true, data: result });
});

export const createRoute = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can add routes.' });
  }
  const result = await catalogService.createRoute(req.body);
  res.status(201).json({ success: true, data: result });
});

export const updateRoute = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can edit routes.' });
  }
  const result = await catalogService.updateRoute(req.params.id, req.body);
  res.status(200).json({ success: true, data: result });
});

export const deleteRoute = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can delete routes.' });
  }
  const result = await catalogService.deleteRoute(req.params.id);
  res.status(200).json({ success: true, data: result });
});

export const createVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can add vehicles.' });
  }
  const result = await catalogService.createVehicle(req.body);
  res.status(201).json({ success: true, data: result });
});

export const updateVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can edit vehicles.' });
  }
  const result = await catalogService.updateVehicle(req.params.id, req.body);
  res.status(200).json({ success: true, data: result });
});

export const deleteVehicle = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can delete vehicles.' });
  }
  const result = await catalogService.deleteVehicle(req.params.id);
  res.status(200).json({ success: true, data: result });
});

export const getVisaCatalog = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const result = await catalogService.getVisaCatalog(includeInactive);
  res.status(200).json({ success: true, data: result });
});

export const createVisa = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can add visa products.' });
  }
  const result = await catalogService.createVisa(req.body);
  res.status(201).json({ success: true, data: result });
});

export const updateVisa = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can edit visa products.' });
  }
  const result = await catalogService.updateVisa(req.params.id, req.body);
  res.status(200).json({ success: true, data: result });
});

export const deleteVisa = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can delete visa products.' });
  }
  const result = await catalogService.deleteVisa(req.params.id);
  res.status(200).json({ success: true, data: result });
});

export const resetCatalog = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminOrManager(req.user)) {
    return res.status(403).json({ success: false, message: 'Forbidden: Only Admins and Managers can reset catalog.' });
  }
  const result = await catalogService.resetToDefault();
  res.status(200).json({ success: true, data: result });
});

import { Response } from 'express';
import { invoicesService } from '../services/invoices.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { InvoicesPolicy } from '../policies/invoices.policy';
import { ForbiddenException } from '../middleware/error.middleware';

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!InvoicesPolicy.canViewAll(req.user)) {
    throw new ForbiddenException('Forbidden: You do not have permissions to view invoices.');
  }

  const result = await invoicesService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!InvoicesPolicy.canViewAll(req.user)) {
    throw new ForbiddenException('Forbidden: You do not have permissions to view invoices.');
  }

  const { id } = req.params;
  const result = await invoicesService.findOne(id);
  res.status(200).json({
    success: true,
    data: result
  });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!InvoicesPolicy.canEdit(req.user)) {
    throw new ForbiddenException('Forbidden: You do not have permissions to edit invoices.');
  }

  const { id } = req.params;
  const result = await invoicesService.update(id, req.body, req.user!.id);
  res.status(200).json({
    success: true,
    data: result
  });
});

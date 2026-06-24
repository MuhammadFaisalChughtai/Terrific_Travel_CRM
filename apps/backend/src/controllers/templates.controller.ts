import { Response } from 'express';
import { templatesService } from '../services/templates.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

/** GET /api/templates — fetch all templates (auto-seeds if empty) */
export const getAll = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const templates = await templatesService.findAll();
  res.status(200).json({ success: true, data: templates });
});

/** GET /api/templates/:type — fetch single template by type */
export const getByType = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const template = await templatesService.findByType(type.toUpperCase());
  res.status(200).json({ success: true, data: template });
});

/** PUT /api/templates/:type — admin: save edited HTML for a template */
export const updateTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const { htmlContent } = req.body;
  const updatedBy = req.user
    ? `${req.user.firstName} ${req.user.lastName} (${req.user.email})`
    : undefined;
  const template = await templatesService.upsert(type.toUpperCase(), htmlContent, updatedBy);
  res.status(200).json({ success: true, data: template });
});

/** POST /api/templates/:type/reset — admin: reset template to factory default */
export const resetTemplate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const resetBy = req.user
    ? `${req.user.firstName} ${req.user.lastName} (${req.user.email})`
    : undefined;
  const template = await templatesService.resetToDefault(type.toUpperCase(), resetBy);
  res.status(200).json({ success: true, data: template });
});

import { Request, Response } from 'express';
import { leadsService } from '../services/leads.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { config } from '../config';

export const verifyMetaWebhookHandshake = (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.leadWebhookSecret) {
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden: Invalid verification token.');
};

export const handleInboundLeadWebhook = asyncHandler(async (req: Request, res: Response) => {
  const secretHeader = (req.headers['x-webhook-secret'] || req.headers['x-api-key']) as string | undefined;
  const querySecret = req.query.secret as string | undefined;
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const providedSecret = secretHeader || querySecret || bearerToken;

  const isMetaDirectPayload = req.body?.object === 'page' && Array.isArray(req.body?.entry);
  const hasMetaSignature = Boolean(req.headers['x-hub-signature-256'] || req.headers['x-hub-signature']);

  const expectedSecret = config.leadWebhookSecret;
  // Allow if secret matches OR if request is directly from Meta (has Meta signature or Meta page payload)
  if (!isMetaDirectPayload && !hasMetaSignature && expectedSecret && providedSecret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing webhook secret.',
    });
  }

  const result = await leadsService.processInboundWebhookLead(req.body);
  res.status(201).json({
    success: true,
    data: result,
    message: 'Lead received and assigned successfully.',
  });
});

export const getLeads = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await leadsService.getLeads(req.query);
  res.status(200).json({
    success: true,
    data: result.data,
    meta: result.meta,
  });
});

export const getLeadById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await leadsService.getLeadById(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const createLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const currentUserId = req.user?.id;
  const result = await leadsService.createLead(req.body, currentUserId);
  res.status(201).json({
    success: true,
    data: result,
    message: 'Lead created successfully.',
  });
});

export const updateLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const currentUserId = req.user?.id;
  const result = await leadsService.updateLead(id, req.body, currentUserId);
  res.status(200).json({
    success: true,
    data: result,
    message: 'Lead updated successfully.',
  });
});

export const deleteLead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userRoles = req.user?.roles || [];
  const result = await leadsService.deleteLead(id, userRoles);
  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const syncWebsiteLeadsController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await leadsService.syncWebsiteLeads();
  res.status(200).json(result);
});


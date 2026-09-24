import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/async.middleware';
import { agentMonitorService } from '../services/agent-monitor.service';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import { minioService } from '../services/minio.service';

function extractClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.trim()) {
    return cf.trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.ip || req.socket?.remoteAddress || '127.0.0.1';
}

export const recordHeartbeat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new BadRequestException('User authentication required.');
  }

  const { machineId, hostname, activeWindow, appVersion, isIdle, activeSeconds, idleSeconds } = req.body;
  if (!machineId) {
    throw new BadRequestException('machineId is required.');
  }

  const ipAddress = extractClientIp(req);

  const result = await agentMonitorService.recordHeartbeat({
    userId: req.user.id,
    machineId,
    hostname,
    activeWindow,
    appVersion,
    isIdle: typeof isIdle === 'boolean' ? isIdle : false,
    activeSeconds: activeSeconds ? Number(activeSeconds) : undefined,
    idleSeconds: idleSeconds ? Number(idleSeconds) : undefined,
    ipAddress,
  });

  res.status(200).json({
    success: true,
    data: {
      status: 'active',
      lastPingAt: result.heartbeat.lastPingAt,
      ipAddress: result.heartbeat.ipAddress,
      city: result.heartbeat.city,
      country: result.heartbeat.country,
      isCheckedIn: result.isCheckedIn,
      checkInTime: result.checkInTime,
      checkOutTime: result.checkOutTime,
    },
  });
});

export const recordClipboardEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new BadRequestException('User authentication required.');
  }

  const { action, textSnippet, charCount, sourceWindow, targetWindow, screenshotBase64 } = req.body;
  if (!action || !textSnippet) {
    throw new BadRequestException('action and textSnippet are required.');
  }

  let screenshotBuffer: Buffer | undefined;
  let screenshotMimeType: string | undefined;

  // Check if a file was uploaded via multer
  if ((req as any).file) {
    screenshotBuffer = (req as any).file.buffer;
    screenshotMimeType = (req as any).file.mimetype;
  } else if (screenshotBase64 && typeof screenshotBase64 === 'string') {
    try {
      const parts = screenshotBase64.split(';base64,');
      if (parts.length === 2) {
        screenshotMimeType = parts[0].replace('data:', '');
        screenshotBuffer = Buffer.from(parts[1], 'base64');
      } else {
        screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
        screenshotMimeType = 'image/webp';
      }
    } catch {
      // ignore invalid base64
    }
  }

  const ipAddress = extractClientIp(req);

  const log = await agentMonitorService.recordClipboardEvent({
    userId: req.user.id,
    action,
    textSnippet,
    charCount: charCount ? Number(charCount) : undefined,
    sourceWindow,
    targetWindow,
    screenshotBuffer,
    screenshotMimeType,
    ipAddress,
  });

  res.status(201).json({
    success: true,
    data: {
      id: log.id,
      action: log.action,
      createdAt: log.createdAt,
    },
  });
});

export const getLiveAgents = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const agents = await agentMonitorService.getLiveAgents();
  res.status(200).json({
    success: true,
    data: agents,
  });
});

export const getAuditLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, userId, action, search, startDate, endDate } = req.query;

  const result = await agentMonitorService.getAuditLogs({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    userId: typeof userId === 'string' ? userId : undefined,
    action: typeof action === 'string' ? action : undefined,
    search: typeof search === 'string' ? search : undefined,
    startDate: typeof startDate === 'string' ? startDate : undefined,
    endDate: typeof endDate === 'string' ? endDate : undefined,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getScreenshotStream = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const key = req.params[0] || (req.params as any).key;
  if (!key) {
    throw new BadRequestException('Screenshot key is required.');
  }

  try {
    const stream = await minioService.getObjectStream('documents', key);
    res.setHeader('Content-Type', key.endsWith('.png') ? 'image/png' : 'image/webp');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    stream.pipe(res);
  } catch (err) {
    throw new NotFoundException('Screenshot not found.');
  }
});

export const getStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new BadRequestException('User authentication required.');
  }

  const isAdmin = req.user.roles.some((r) => {
    const norm = String(r).toUpperCase().replace(/[\s_-]+/g, '');
    return ['ADMIN', 'SUPERADMIN', 'MANAGER', 'BRANCHMANAGER', 'ADMINISTRATOR'].includes(norm);
  });

  const isActive = await agentMonitorService.isUserCompanionActive(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      userId: req.user.id,
      isAdmin,
      isCompanionActive: isActive,
      enforced: process.env.ENFORCE_COMPANION_APP === 'true',
    },
  });
});

export const getProductivityReports = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page, limit, agentId, startDate, endDate } = req.query;

  const result = await agentMonitorService.getProductivityReports({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    agentId: typeof agentId === 'string' ? agentId : undefined,
    startDate: typeof startDate === 'string' ? startDate : undefined,
    endDate: typeof endDate === 'string' ? endDate : undefined,
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});


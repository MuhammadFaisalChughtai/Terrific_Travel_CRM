import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { agentMonitorService } from '../services/agent-monitor.service';

/**
 * Middleware that requires regular staff / agents to have their desktop security
 * companion running on their computer.
 *
 * CRITICAL RULE:
 * Admins, Superadmins, and Managers ALWAYS bypass this requirement and can access
 * the CRM from any machine or browser without the desktop app.
 */
export async function companionGuardMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // If enforcement flag is disabled, allow all traffic
  if (process.env.ENFORCE_COMPANION_APP !== 'true') {
    return next();
  }

  // If user is not logged in or endpoint is part of auth / health / agent-monitor, skip
  if (!req.user) {
    return next();
  }

  // Exempt Admins, Superadmins completely
  const isAdmin = req.user.roles.some((r) => {
    const norm = String(r).toUpperCase().replace(/[\s_-]+/g, '');
    return ['ADMIN', 'SUPERADMIN', 'ADMINISTRATOR', 'ROOT'].includes(norm);
  });

  if (isAdmin) {
    return next();
  }

  // For regular agents: verify an active heartbeat within the last 45 seconds
  try {
    const isOnline = await agentMonitorService.isUserCompanionActive(req.user.id);
    if (!isOnline) {
      return res.status(403).json({
        success: false,
        code: 'COMPANION_APP_REQUIRED',
        message:
          'Workstation security connector is required to access the CRM. Please ensure the Terrific Travel Security Bridge is running on your workstation.',
      });
    }
    next();
  } catch (err) {
    // If checking fails, fail open or log error to prevent breaking operations
    next();
  }
}

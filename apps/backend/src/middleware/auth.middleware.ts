import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config, prisma } from '../config';
import { UnauthorizedException, ForbiddenException } from './error.middleware';
import { userContextStorage } from '../utils/context';
import { agentMonitorService } from '../services/agent-monitor.service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
    agentId?: string | null;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return next(new UnauthorizedException('Access token is missing or invalid.'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    
    // Fetch latest user details, roles and permissions from db
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return next(new UnauthorizedException('User not found.'));
    }

    if (!user.isActive) {
      return next(new ForbiddenException('Your account has been deactivated.'));
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name)
        )
      )
    );

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions,
      agentId: user.agentId,
    };

    const isAdmin = roles.some((r) => {
      const clean = String(r).toUpperCase().replace(/[\s_-]+/g, '');
      return ['ADMIN', 'SUPERADMIN', 'ADMINISTRATOR', 'ROOT'].includes(clean);
    });

    // If regular staff/agent/manager and not calling monitor routes:
    // verify desktop app is connected and heartbeating
    const isMonitorRoute = Boolean(req.originalUrl?.includes('/agent-monitor/'));
    if (!isAdmin && !isMonitorRoute) {
      const isCompanionActive = await agentMonitorService.isUserCompanionActive(user.id);
      if (!isCompanionActive) {
        return next(new ForbiddenException('Workstation authorization required. Session closed.'));
      }
    }

    userContextStorage.run(req.user, () => {
      next();
    });
  } catch (error) {
    return next(new UnauthorizedException('Invalid or expired token.'));
  }
}

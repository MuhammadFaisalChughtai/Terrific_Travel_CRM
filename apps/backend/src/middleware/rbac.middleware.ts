import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenException, UnauthorizedException } from './error.middleware';

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedException('Unauthorized.'));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      return next(new ForbiddenException('You do not have the required role to access this resource.'));
    }

    next();
  };
}

export function requirePermissions(...allowedPermissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedException('Unauthorized.'));
    }

    // Check if user has ALL or ANY of the allowed permissions? Usually ANY of them is enough
    const hasPermission = req.user.permissions.some((permission) =>
      allowedPermissions.includes(permission)
    );
    if (!hasPermission) {
      return next(new ForbiddenException('You do not have the required permissions to access this resource.'));
    }

    next();
  };
}

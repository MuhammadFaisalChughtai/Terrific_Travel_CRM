import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenException, UnauthorizedException, NotFoundException } from './error.middleware';
import { prisma } from '../config';

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedException('Unauthorized.'));
    }

    // Normalize roles for backward compatibility with legacy routes
    const normalizeRole = (role: string) => {
      const r = role.toUpperCase();
      if (r === 'SUPER_ADMIN' || r === 'ADMIN') return 'ADMIN';
      if (r === 'TRAVEL_AGENT' || r === 'AGENT') return 'AGENT';
      if (r === 'MANAGER') return 'MANAGER';
      if (r === 'CUSTOMER') return 'CUSTOMER';
      return r;
    };

    const normalizedAllowed = allowedRoles.map(normalizeRole);
    const hasRole = req.user.roles.some((role) => 
      normalizedAllowed.includes(normalizeRole(role))
    );

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

    const hasPermission = req.user.permissions.some((permission) =>
      allowedPermissions.includes(permission)
    );
    if (!hasPermission) {
      return next(new ForbiddenException('You do not have the required permissions to access this resource.'));
    }

    next();
  };
}

export async function requireBookingOwnership(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(new UnauthorizedException('Unauthorized.'));
  }

  // Admins and Managers have global access and bypass ownership checks
  const isAdminOrManager = req.user.roles.some((role) => {
    const r = role.toUpperCase();
    return r === 'ADMIN' || r === 'SUPER_ADMIN' || r === 'MANAGER';
  });

  if (isAdminOrManager) {
    return next();
  }

  const { id } = req.params;
  if (!id) {
    return next();
  }

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return next(new NotFoundException('Booking not found.'));
    }

    // Agent can only access/edit their own bookings (where createdById == user.id)
    if (booking.createdById !== req.user.id && booking.userId !== req.user.id) {
      return next(new ForbiddenException('Forbidden: You do not have ownership of this booking.'));
    }

    next();
  } catch (error) {
    next(error);
  }
}


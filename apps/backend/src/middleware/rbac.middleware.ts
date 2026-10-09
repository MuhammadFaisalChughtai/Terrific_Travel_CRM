import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ForbiddenException, UnauthorizedException, NotFoundException } from './error.middleware';
import { prisma } from '../config';

export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedException('Unauthorized.'));
    }

    const clean = (r: string) => (r || '').toUpperCase().replace(/[\s_-]+/g, '');
    const userRoles = (req.user.roles || []).map(clean);
    const allowed = allowedRoles.map(clean);

    // Admins always have access
    const isAdmin = userRoles.some((r) => ['ADMIN', 'SUPERADMIN', 'ROOT', 'ADMINISTRATOR'].includes(r));
    if (isAdmin) return next();

    const isManager = userRoles.some((r) => ['MANAGER', 'BRANCHMANAGER', 'FLIGHTEXECUTIVE'].includes(r));
    const isAgent = userRoles.some((r) => ['AGENT', 'TRAVELAGENT'].includes(r));

    // If resource allows Manager, allow Managers (including Flight Executive)
    if (isManager && allowed.some((a) => ['MANAGER', 'BRANCHMANAGER', 'FLIGHTEXECUTIVE'].includes(a))) {
      return next();
    }

    // Managers have same access as agents: if resource allows Agent, allow both Agents and Managers
    if ((isAgent || isManager) && allowed.some((a) => ['AGENT', 'TRAVELAGENT'].includes(a))) {
      return next();
    }

    // Direct match
    const hasRole = userRoles.some((role) => allowed.includes(role));
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

  // Admins, Managers, Flight Executives, and Agents have global access and bypass ownership checks
  const isAdminManagerOrAgent = req.user.roles.some((role) => {
    const r = (role || '').toUpperCase().replace(/[\s_-]+/g, '');
    return ['ADMIN', 'SUPERADMIN', 'MANAGER', 'BRANCHMANAGER', 'FLIGHTEXECUTIVE', 'AGENT', 'TRAVELAGENT'].includes(r);
  });

  if (isAdminManagerOrAgent) {
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

    // Agent can only access/edit their own bookings
    if (
      booking.createdById !== req.user.id && 
      booking.userId !== req.user.id &&
      booking.assignedToId !== req.user.id &&
      (!booking.agentId || booking.agentId !== req.user.agentId)
    ) {
      return next(new ForbiddenException('Forbidden: You do not have ownership of this booking.'));
    }

    next();
  } catch (error) {
    next(error);
  }
}


import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config, prisma } from '../config';
import { UnauthorizedException, ForbiddenException } from './error.middleware';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
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
    };

    next();
  } catch (error) {
    return next(new UnauthorizedException('Invalid or expired token.'));
  }
}

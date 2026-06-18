import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';

export class UsersService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 10;
    const offset = Number(query.offset) || 0;
    
    const [total, items] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        take: limit,
        skip: offset,
      }),
    ]);

    const formatted = items.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      roles: user.userRoles.map((ur: any) => ur.role.name),
      createdAt: user.createdAt.toISOString(),
    }));

    return { total, limit, offset, items: formatted };
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
      roles: user.userRoles.map((ur: any) => ur.role.name),
      createdAt: user.createdAt.toISOString(),
    };
  }

  async update(id: string, data: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });
    return this.findOne(user.id);
  }
}

export const usersService = new UsersService();

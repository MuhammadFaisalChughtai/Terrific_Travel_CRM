import { prisma, logger } from '../config';
import { NotFoundException } from '../middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import { auditLogService } from './audit.service';
import { emailService } from './email.service';

export class UsersService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 100;
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
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      roles: user.userRoles.map((ur: any) => ur.role.name),
      agentId: user.agentId,
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
    if (!user) throw new NotFoundException('User not found');

    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap((ur: any) =>
          ur.role.rolePermissions.map((rp: any) => rp.permission.name as string)
        )
      )
    ) as string[];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      roles: user.userRoles.map((ur: any) => ur.role.name),
      permissions,
      agentId: user.agentId,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async remove(id: string, actorId: string) {
    const user = await prisma.user.findUnique({ where: { id }, include: { userRoles: { include: { role: true } } } });
    if (!user) throw new NotFoundException('User not found');

    // Prevent deleting yourself
    if (id === actorId) {
      throw new Error('You cannot delete your own account.');
    }

    // Prevent deleting the last admin/super-admin account
    const isAdmin = user.userRoles.some((ur: any) =>
      ['Admin', 'SUPER_ADMIN'].includes(ur.role.name)
    );
    if (isAdmin) {
      const adminCount = await prisma.user.count({
        where: {
          isActive: true,
          userRoles: {
            some: { role: { name: { in: ['Admin', 'SUPER_ADMIN'] } } },
          },
        },
      });
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last administrator account. Assign another admin first.');
      }
    }

    // Delete user roles then the user
    await prisma.userRole.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return { id, deleted: true };
  }


  async create(data: any, actorId?: string) {
    const passwordHash = await bcrypt.hash(data.password || 'user123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isEmailVerified: true,
        agentId: data.agentId || null,
      },
    });

    if (data.roles && Array.isArray(data.roles)) {
      const dbRoles = await prisma.role.findMany({ where: { name: { in: data.roles } } });
      await prisma.userRole.createMany({
        data: dbRoles.map((role) => ({ userId: user.id, roleId: role.id })),
      });
    }

    const createdUser = await this.findOne(user.id);

    await auditLogService.log({
      userId: actorId || null,
      action: 'Create',
      module: 'Users',
      recordId: user.id,
      newValue: createdUser,
    });

    // Send email to agent/user with temporary password
    try {
      const tempPass = data.password || 'user123';
      await emailService.sendTemporaryPassword(user.email, `${user.firstName} ${user.lastName}`, tempPass);
    } catch (err) {
      logger.error('Failed to send temporary credentials email:', err);
    }

    return createdUser;
  }

  async update(id: string, data: any, actorId?: string) {
    const userBefore = await this.findOne(id);

    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.agentId !== undefined) updateData.agentId = data.agentId || null;

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    if (data.roles && Array.isArray(data.roles)) {
      // Clear legacy roles
      await prisma.userRole.deleteMany({ where: { userId: id } });
      // Assign new ones
      const dbRoles = await prisma.role.findMany({ where: { name: { in: data.roles } } });
      await prisma.userRole.createMany({
        data: dbRoles.map((role) => ({ userId: id, roleId: role.id })),
      });
    }

    const updatedUser = await this.findOne(id);

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Users',
      recordId: id,
      oldValue: userBefore,
      newValue: updatedUser,
    });

    return updatedUser;
  }

  async resetPassword(id: string, password?: string, actorId?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const tempPassword = password || Math.random().toString(36).substring(2, 10);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Users',
      recordId: id,
      newValue: { message: `Password reset by operator. Temporary password assigned: ${tempPassword}` },
    });

    // Send email to user/agent with the new temporary password
    try {
      await emailService.sendTemporaryPassword(user.email, `${user.firstName} ${user.lastName}`, tempPassword);
    } catch (err) {
      logger.error('Failed to send password reset credentials email:', err);
    }

    return { id, email: user.email, tempPassword };
  }

  async getRoles() {
    return prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async getPermissions() {
    return prisma.permission.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[], actorId?: string) {
    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    const oldPermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true }
    });

    // Clear existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    });

    // Assign new permissions
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permId) => ({
          roleId,
          permissionId: permId
        }))
      });
    }

    const updatedPermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: { permission: true }
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Settings',
      recordId: roleId,
      oldValue: oldPermissions.map((rp) => rp.permission.name),
      newValue: updatedPermissions.map((rp) => rp.permission.name)
    });

    return {
      roleId,
      permissions: updatedPermissions.map((rp) => rp.permission)
    };
  }
}

export const usersService = new UsersService();


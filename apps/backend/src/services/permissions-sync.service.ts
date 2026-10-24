import { PrismaClient } from '@prisma/client';
import { SYSTEM_PERMISSIONS } from '../config/permissions.registry';
import { logger } from '../config';

export async function syncPermissionsRegistry(prisma: PrismaClient) {
  try {
    logger.info('Syncing dynamic permissions registry with database...');

    // 1. Upsert all system permissions
    for (const def of SYSTEM_PERMISSIONS) {
      await prisma.permission.upsert({
        where: { name: def.name },
        create: {
          name: def.name,
          module: def.module,
          displayName: def.displayName,
          description: def.description,
        },
        update: {
          module: def.module,
          displayName: def.displayName,
          description: def.description,
        },
      });
    }

    // 2. Mark default built-in roles as isSystem
    const builtInRoleNames = [
      'SUPER_ADMIN',
      'Admin',
      'ADMIN',
      'Manager',
      'Flight Executive',
      'Agent',
      'TRAVEL_AGENT',
      'Customer',
      'CUSTOMER',
    ];

    await prisma.role.updateMany({
      where: {
        name: { in: builtInRoleNames },
      },
      data: {
        isSystem: true,
      },
    });

    // 3. Ensure Admin roles automatically have all permissions mapped
    const adminRoles = await prisma.role.findMany({
      where: {
        name: { in: ['SUPER_ADMIN', 'Admin', 'ADMIN'] },
      },
    });

    const allPermissions = await prisma.permission.findMany({ select: { id: true, name: true } });

    for (const role of adminRoles) {
      for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: perm.id,
            },
          },
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
          update: {},
        });
      }
    }

    logger.info(`Permissions synchronized successfully (${SYSTEM_PERMISSIONS.length} registered).`);
  } catch (error) {
    logger.error('Failed to sync permissions registry:', error);
  }
}

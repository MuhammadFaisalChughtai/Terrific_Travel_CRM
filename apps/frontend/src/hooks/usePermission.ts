import { useAuthStore } from '../store/auth.store';

export function usePermission() {
  const user = useAuthStore((state) => state.user);

  const clean = (r: string) => (r || '').toUpperCase().replace(/[\s_-]+/g, '');
  const userRoles = (user?.roles || []).map((r) =>
    clean(typeof r === 'string' ? r : (r as any)?.name || '')
  );

  const isSuperAdmin = userRoles.some((r) =>
    ['SUPERADMIN', 'ADMINISTRATOR', 'ROOT'].includes(r)
  );
  const isAdmin = isSuperAdmin || userRoles.includes('ADMIN');

  const permissions = user?.permissions || [];

  const checkSinglePermission = (permission: string): boolean => {
    if (!user) return false;
    // Admins and Super Admins bypass checks
    if (isAdmin) return true;
    // Wildcard bypass
    if (permissions.includes('*') || permissions.includes('all')) return true;

    if (permissions.includes(permission)) return true;

    // Support module wildcards, e.g. 'vendors:*'
    const [module] = permission.split(':');
    if (module && permissions.includes(`${module}:*`)) return true;

    return false;
  };

  const can = (
    permissionOrPermissions: string | string[],
    mode: 'any' | 'all' = 'any'
  ): boolean => {
    if (!user) return false;
    if (isAdmin) return true;

    if (Array.isArray(permissionOrPermissions)) {
      if (permissionOrPermissions.length === 0) return true;
      if (mode === 'all') {
        return permissionOrPermissions.every(checkSinglePermission);
      }
      return permissionOrPermissions.some(checkSinglePermission);
    }

    return checkSinglePermission(permissionOrPermissions);
  };

  const canAll = (...perms: string[]): boolean => can(perms, 'all');
  const canAny = (...perms: string[]): boolean => can(perms, 'any');

  const hasRole = (roleOrRoles: string | string[]): boolean => {
    if (!user) return false;
    const rolesToCheck = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    const cleanedToCheck = rolesToCheck.map(clean);

    if (isAdmin && (cleanedToCheck.includes('ADMIN') || cleanedToCheck.includes('SUPERADMIN'))) {
      return true;
    }

    return userRoles.some((r) => cleanedToCheck.includes(r));
  };

  return {
    user,
    permissions,
    roles: user?.roles || [],
    isAdmin,
    isSuperAdmin,
    can,
    canAll,
    canAny,
    hasRole,
  };
}

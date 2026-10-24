import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { ShieldAlert } from 'lucide-react';

interface PermissionRouteProps {
  permission?: string | string[];
  role?: string | string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  permission,
  role,
  children,
  redirectTo,
}) => {
  const { can, hasRole } = usePermission();

  let allowed = true;

  if (permission) {
    allowed = can(permission);
  }

  if (role && !hasRole(role)) {
    allowed = false;
  }

  if (!allowed) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Access Restricted</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Your account does not have the required permissions to view this module.
          Contact an administrator if you believe this is in error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

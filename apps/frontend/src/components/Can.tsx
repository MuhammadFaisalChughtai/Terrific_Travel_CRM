import React from 'react';
import { usePermission } from '../hooks/usePermission';

interface CanProps {
  I?: string;
  anyOf?: string[];
  allOf?: string[];
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  I,
  anyOf,
  allOf,
  role,
  fallback = null,
  children,
}) => {
  const { can, canAll, canAny, hasRole } = usePermission();

  let isAllowed = true;

  if (I && !can(I)) {
    isAllowed = false;
  }

  if (anyOf && anyOf.length > 0 && !canAny(...anyOf)) {
    isAllowed = false;
  }

  if (allOf && allOf.length > 0 && !canAll(...allOf)) {
    isAllowed = false;
  }

  if (role && !hasRole(role)) {
    isAllowed = false;
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TRAVEL_AGENT: 'TRAVEL_AGENT',
  CUSTOMER: 'CUSTOMER',
} as const;

export type RoleType = keyof typeof ROLES;

export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  FLIGHTS_READ: 'flights:read',
  FLIGHTS_WRITE: 'flights:write',
  HOTELS_READ: 'hotels:read',
  HOTELS_WRITE: 'hotels:write',
  TOURS_READ: 'tours:read',
  TOURS_WRITE: 'tours:write',
  BOOKINGS_READ: 'bookings:read',
  BOOKINGS_WRITE: 'bookings:write',
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_WRITE: 'payments:write',
  REPORTS_READ: 'reports:read',
  SETTINGS_WRITE: 'settings:write',
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];

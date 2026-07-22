export class BookingsPolicy {
  static canViewAll(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'Manager', 'Agent'].includes(role));
  }

  static canCreate(user: any): boolean {
    return user.permissions.includes('bookings:create') || 
      user.roles.some((role: string) => ['Admin', 'Manager', 'Agent'].includes(role));
  }

  static canEdit(user: any, booking: any): boolean {
    if (user.roles.some((role: string) => ['Admin', 'SUPER_ADMIN', 'ADMIN', 'Manager', 'MANAGER', 'Agent', 'AGENT', 'TRAVEL_AGENT'].includes(role))) {
      return true;
    }
    return false;
  }

  static canDelete(user: any, booking: any): boolean {
    // Nobody can permanently delete bookings
    return false;
  }

  static canAssign(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'SUPER_ADMIN', 'ADMIN', 'Manager', 'MANAGER', 'Agent', 'AGENT', 'TRAVEL_AGENT'].includes(role));
  }

  static canFinalizeMargin(user: any): boolean {
    return user.roles.includes('Admin');
  }
}

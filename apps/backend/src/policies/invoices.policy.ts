export class InvoicesPolicy {
  private static cleanRoles(user: any): string[] {
    if (!user || !user.roles) return [];
    return user.roles.map((r: any) => {
      const raw = typeof r === 'string' ? r : r?.name || '';
      return raw.toUpperCase().replace(/[\s_-]+/g, '');
    });
  }

  static isAdmin(user: any): boolean {
    const roles = this.cleanRoles(user);
    return roles.some((r) => ['SUPERADMIN', 'ADMIN', 'ADMINISTRATOR', 'ROOT'].includes(r));
  }

  static canViewAll(user: any): boolean {
    if (!user) return false;
    const roles = this.cleanRoles(user);
    return roles.some((r) =>
      ['SUPERADMIN', 'ADMIN', 'ADMINISTRATOR', 'MANAGER', 'BRANCHMANAGER', 'AGENT', 'TRAVELAGENT'].includes(r)
    );
  }

  static canCreate(user: any): boolean {
    return this.isAdmin(user);
  }

  static canEdit(user: any, invoice?: any): boolean {
    if (!user) return false;
    if (this.isAdmin(user)) return true;

    // If an invoice is provided, check booking ownership & lock status
    if (invoice && invoice.booking) {
      const booking = invoice.booking;
      if (booking.lockedStatus === 'LOCKED' || booking.isLocked === true) {
        return false;
      }
      const isOwner =
        (booking.createdById && booking.createdById === user.id) ||
        (booking.assignedToId && booking.assignedToId === user.id) ||
        (user.agentId && booking.agentId && booking.agentId === user.agentId);
      return Boolean(isOwner);
    }

    return false;
  }

  static canDelete(user: any): boolean {
    // Nobody can delete invoices
    return false;
  }

  static canDownload(user: any): boolean {
    return this.canViewAll(user);
  }

  static canPrint(user: any): boolean {
    return this.canViewAll(user);
  }
}

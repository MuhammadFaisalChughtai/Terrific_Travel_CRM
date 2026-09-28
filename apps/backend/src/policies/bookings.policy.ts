export class BookingsPolicy {
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

  static isManager(user: any): boolean {
    if (this.isAdmin(user)) return false;
    const roles = this.cleanRoles(user);
    return roles.some((r) => ['MANAGER', 'BRANCHMANAGER'].includes(r));
  }

  static isAgent(user: any): boolean {
    if (this.isAdmin(user) || this.isManager(user)) return false;
    const roles = this.cleanRoles(user);
    return roles.some((r) => r.includes('AGENT'));
  }

  static isOwner(user: any, booking: any): boolean {
    if (!user || !booking) return false;
    if (booking.createdById && booking.createdById === user.id) return true;
    if (booking.assignedToId && booking.assignedToId === user.id) return true;
    if (booking.userId && booking.userId === user.id) return true;
    if (user.agentId && booking.agentId && booking.agentId === user.agentId) return true;
    return false;
  }

  static isLocked(booking: any): boolean {
    if (!booking) return false;
    return booking.lockedStatus === 'LOCKED' || booking.isLocked === true;
  }

  static canViewAll(user: any): boolean {
    if (!user) return false;
    const roles = this.cleanRoles(user);
    return roles.some((r) =>
      ['SUPERADMIN', 'ADMIN', 'ADMINISTRATOR', 'MANAGER', 'BRANCHMANAGER', 'AGENT', 'TRAVELAGENT'].includes(r)
    );
  }

  static canView(user: any, booking: any): boolean {
    if (!user) return false;
    if (this.canViewAll(user)) return true;
    return this.isOwner(user, booking);
  }

  static canCreate(user: any): boolean {
    if (!user) return false;
    return this.canViewAll(user);
  }

  /**
   * Only Admin or the non-locked Booking Owner can edit/modify/delete items.
   * Locked bookings are strictly view-only for all agents & managers.
   * Other agents & managers have strictly view-only access.
   */
  static canEdit(user: any, booking: any): boolean {
    if (!user || !booking) return false;
    if (this.isAdmin(user)) return true;

    // Locked bookings cannot be edited by non-admins
    if (this.isLocked(booking)) return false;

    // Only booking owner can edit
    return this.isOwner(user, booking);
  }

  /**
   * Financial Privacy: Only Admins, Managers, and the Booking Owner can see margins/profits.
   * Other agents viewing this booking have margins and profits hidden.
   */
  static canViewMarginProfit(user: any, booking: any): boolean {
    if (!user || !booking) return false;
    if (this.isAdmin(user) || this.isManager(user)) return true;
    return this.isOwner(user, booking);
  }

  static canDelete(user: any, booking: any): boolean {
    // Nobody can permanently hard-delete bookings
    return false;
  }

  static canAssign(user: any): boolean {
    return this.isAdmin(user) || this.isManager(user);
  }

  static canFinalizeMargin(user: any): boolean {
    return this.isAdmin(user);
  }
}

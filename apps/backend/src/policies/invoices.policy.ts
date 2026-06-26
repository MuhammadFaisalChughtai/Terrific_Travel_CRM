export class InvoicesPolicy {
  static canViewAll(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'Manager', 'Agent'].includes(role));
  }

  static canCreate(user: any): boolean {
    // Only Admin can create invoices manually, Manager can generate through standard billing flows if required
    return user.roles.some((role: string) => ['Admin'].includes(role));
  }

  static canEdit(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'Manager'].includes(role));
  }

  static canDelete(user: any): boolean {
    // Nobody can delete invoices
    return false;
  }

  static canDownload(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'Manager', 'Agent'].includes(role));
  }

  static canPrint(user: any): boolean {
    return user.roles.some((role: string) => ['Admin', 'Manager', 'Agent'].includes(role));
  }
}

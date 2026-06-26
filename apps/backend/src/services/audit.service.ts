import { prisma } from '../config';

export class AuditLogService {
  async log(params: {
    userId: string | null;
    action: 'Create' | 'Update' | 'Archive';
    module: 'Bookings' | 'Invoices' | 'Customers' | 'Users' | 'Settings';
    recordId: string | null;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          module: params.module,
          recordId: params.recordId,
          oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : null,
          newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : null,
          ipAddress: params.ipAddress || null,
        },
      });
    } catch (error) {
      console.error('AuditLogService Error: Failed to write audit log:', error);
    }
  }
}

export const auditLogService = new AuditLogService();

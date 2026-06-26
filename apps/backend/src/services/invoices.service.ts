import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';
import { auditLogService } from './audit.service';

export class InvoicesService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 100;
    const offset = Number(query.offset) || 0;

    const [total, items] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.findMany({
        include: {
          booking: {
            include: {
              user: true,
              passengers: true
            }
          }
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return { total, limit, offset, items };
  }

  async findOne(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: true,
            passengers: true
          }
        }
      }
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id: string, data: { amount?: number; pdfUrl?: string }, actorId?: string) {
    const invoiceBefore = await this.findOne(id);

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        amount: data.amount !== undefined ? Number(data.amount) : undefined,
        pdfUrl: data.pdfUrl || undefined
      }
    });

    await auditLogService.log({
      userId: actorId || null,
      action: 'Update',
      module: 'Invoices',
      recordId: id,
      oldValue: invoiceBefore,
      newValue: updated
    });

    return updated;
  }
}

export const invoicesService = new InvoicesService();

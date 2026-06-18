import { prisma } from '../config';
import { rabbitMQService } from './rabbitmq.service';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import { NotFoundException } from '../middleware/error.middleware';

export class PaymentsService {
  async checkout(data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const payment = await prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        amount: Number(data.amount),
        provider: data.provider || 'STRIPE',
        status: PaymentStatus.PENDING,
        transactionId: `mock_tx_${Math.random().toString(36).substring(2, 11)}`,
      },
    });

    // Mock processing timeout for background webhook emulation
    setTimeout(async () => {
      try {
        await this.processWebhook({
          transactionId: payment.transactionId,
          status: 'SUCCESS',
        });
      } catch (err) {
        console.error('Mock webhook error', err);
      }
    }, 1000);

    return payment;
  }

  async processWebhook(payload: any) {
    const payment = await prisma.payment.findUnique({
      where: { transactionId: payload.transactionId },
    });
    if (!payment) return;

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: payload.status === 'SUCCESS' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      },
    });

    if (updatedPayment.status === PaymentStatus.SUCCESS) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });

      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await prisma.invoice.create({
        data: {
          bookingId: payment.bookingId,
          invoiceNumber,
          amount: payment.amount,
          pdfUrl: `/storage/invoices/${invoiceNumber}.pdf`,
        },
      });

      await rabbitMQService.publish('payment.completed', {
        bookingId: payment.bookingId,
        paymentId: payment.id,
      });

      await rabbitMQService.publish('invoice.generated', {
        bookingId: payment.bookingId,
        invoiceNumber,
      });
    } else {
      await rabbitMQService.publish('payment.failed', {
        bookingId: payment.bookingId,
        paymentId: payment.id,
      });
    }
  }

  async webhook(body: any) {
    await this.processWebhook(body);
    return { received: true };
  }

  async findAll(query: any) {
    return prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const paymentsService = new PaymentsService();

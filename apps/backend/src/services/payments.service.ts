import { prisma } from '../config';
import { rabbitMQService } from './rabbitmq.service';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import { NotFoundException, BadRequestException } from '../middleware/error.middleware';
import { vendorsService } from './vendors.service';

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

  async recordTransaction(data: any, userId: string, adminName: string = 'Admin') {
    const amount = Number(data.amount);
    
    switch (data.type) {
      case "CUSTOMER_PAYMENT": {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId }
        });
        if (!booking) throw new NotFoundException('Booking not found');

        return prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: {
              bookingId: data.bookingId,
              amount,
              provider: 'MANUAL',
              status: PaymentStatus.SUCCESS,
              transactionId: `manual_tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            }
          });

          const newPaidAmount = booking.paidAmount + amount;
          const newRemainingAmount = Math.max(0, booking.totalPrice - newPaidAmount);
          let paymentStatus = 'UNPAID';
          if (newPaidAmount >= booking.totalPrice) {
            paymentStatus = 'PAID';
          } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
          }

          // Confirm the booking & update amounts
          await tx.booking.update({
            where: { id: data.bookingId },
            data: { 
              status: BookingStatus.CONFIRMED,
              remainingAmount: newRemainingAmount,
              paidAmount: newPaidAmount,
              paymentStatus
            }
          });

          // Create BookingTransaction entry
          await tx.bookingTransaction.create({
            data: {
              bookingId: data.bookingId,
              amount,
              paymentMethod: data.paymentMethod || 'Bank Transfer',
              notes: data.notes || 'Customer payment received'
            }
          });

          // Record in global ledger
          await vendorsService.appendLedgerEntry(tx, {
            bookingId: data.bookingId,
            bookingReference: booking.bookingReference ?? undefined,
            eventType: 'CUSTOMER_PAYMENT',
            debit: amount,
            credit: 0.0,
            notes: data.notes || 'Customer payment received',
            createdById: userId,
            referenceNumber: payment.transactionId ?? undefined
          });

          // If credit card charges are provided, update booking and create a separate transaction entry
          if (data.paymentMethod === 'Credit Card' && data.cardPaymentCharges && Number(data.cardPaymentCharges) > 0) {
            const ccCharges = Number(data.cardPaymentCharges);
            await tx.booking.update({
              where: { id: data.bookingId },
              data: {
                cardPaymentCharges: { increment: ccCharges }
              }
            });
            await tx.bookingTransaction.create({
              data: {
                bookingId: data.bookingId,
                amount: ccCharges,
                paymentMethod: 'Credit Card',
                notes: `Credit Card Charges for customer payment`
              }
            });
            await vendorsService.appendLedgerEntry(tx, {
              bookingId: data.bookingId,
              bookingReference: booking.bookingReference ?? undefined,
              eventType: 'CUSTOMER_PAYMENT',
              debit: ccCharges,
              credit: 0.0,
              notes: `Credit Card Charges for customer payment`,
              createdById: userId,
              referenceNumber: `${payment.transactionId}-cc`
            });
          }

          // Generate Invoice
          const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          await tx.invoice.create({
            data: {
              bookingId: data.bookingId,
              invoiceNumber,
              amount,
              pdfUrl: `/storage/invoices/${invoiceNumber}.pdf`,
            }
          });

          await rabbitMQService.publish('payment.completed', {
            bookingId: data.bookingId,
            paymentId: payment.id,
          });

          return payment;
        });
      }

      case "VENDOR_PAYMENT": {
        return vendorsService.processVendorPayment({
          vendorId: data.vendorId,
          paymentAmount: amount,
          paymentMethod: data.paymentMethod,
          bankAccount: data.bankAccount,
          notes: data.notes,
          useWallet: data.useWallet || false,
          bookingIds: data.bookingIds || [],
        }, userId, adminName);
      }

      case "VENDOR_REFUND": {
        return vendorsService.processVendorRefund({
          vendorId: data.vendorId,
          amount,
          notes: data.notes,
          createdById: userId,
          bookingId: data.bookingId || undefined
        });
      }

      case "CUSTOMER_REFUND": {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId }
        });
        if (!booking) throw new NotFoundException('Booking not found');

        return prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: {
              bookingId: data.bookingId,
              amount: -amount,
              provider: 'MANUAL',
              status: PaymentStatus.SUCCESS,
              transactionId: `refund_tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            }
          });

          const newPaidAmount = Math.max(0, booking.paidAmount - amount);
          const newRemainingAmount = Math.max(0, booking.totalPrice - newPaidAmount);
          let paymentStatus = 'UNPAID';
          if (newPaidAmount >= booking.totalPrice) {
            paymentStatus = 'PAID';
          } else if (newPaidAmount > 0) {
            paymentStatus = 'PARTIALLY_PAID';
          }

          await tx.booking.update({
            where: { id: data.bookingId },
            data: {
              refundAmount: { increment: amount },
              remainingAmount: newRemainingAmount,
              paidAmount: newPaidAmount,
              paymentStatus
            }
          });

          // Create BookingTransaction entry
          await tx.bookingTransaction.create({
            data: {
              bookingId: data.bookingId,
              amount: -amount,
              paymentMethod: data.paymentMethod || 'Bank Transfer',
              notes: data.notes || 'Customer Refund'
            }
          });

          // Record in global ledger
          await vendorsService.appendLedgerEntry(tx, {
            bookingId: data.bookingId,
            bookingReference: booking.bookingReference ?? undefined,
            eventType: 'CUSTOMER_REFUND',
            debit: 0.0,
            credit: amount,
            notes: data.notes || 'Customer Refund',
            createdById: userId,
            referenceNumber: payment.transactionId ?? undefined
          });

          return payment;
        });
      }

      case "AGENT_PAYOUT": {
        const agent = await prisma.agent.findUnique({
          where: { id: data.agentId }
        });
        if (!agent) throw new NotFoundException('Agent not found');
        if (agent.walletBalance < amount) {
          throw new BadRequestException('Insufficient agent wallet balance');
        }

        return prisma.agent.update({
          where: { id: data.agentId },
          data: {
            walletBalance: { decrement: amount }
          }
        });
      }

      default:
        throw new BadRequestException("Invalid transaction type");
    }
  }
}

export const paymentsService = new PaymentsService();

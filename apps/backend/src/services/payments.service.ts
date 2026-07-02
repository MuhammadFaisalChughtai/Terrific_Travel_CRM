import { prisma } from "../config";
import { rabbitMQService } from "./rabbitmq.service";
import { PaymentStatus, BookingStatus } from "@prisma/client";
import {
  NotFoundException,
  BadRequestException,
} from "../middleware/error.middleware";
import { vendorsService } from "./vendors.service";

export class PaymentsService {
  async checkout(data: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");

    const payment = await prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        amount: Number(data.amount),
        provider: data.provider || "STRIPE",
        status: PaymentStatus.PENDING,
        transactionId: `mock_tx_${Math.random().toString(36).substring(2, 11)}`,
      },
    });

    // Mock processing timeout for background webhook emulation
    setTimeout(async () => {
      try {
        await this.processWebhook({
          transactionId: payment.transactionId,
          status: "SUCCESS",
        });
      } catch (err) {
        console.error("Mock webhook error", err);
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
        status:
          payload.status === "SUCCESS"
            ? PaymentStatus.SUCCESS
            : PaymentStatus.FAILED,
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

      await rabbitMQService.publish("payment.completed", {
        bookingId: payment.bookingId,
        paymentId: payment.id,
      });

      await rabbitMQService.publish("invoice.generated", {
        bookingId: payment.bookingId,
        invoiceNumber,
      });
    } else {
      await rabbitMQService.publish("payment.failed", {
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
      orderBy: { createdAt: "desc" },
    });
  }

  async recordTransaction(
    data: any,
    userId: string,
    adminName: string = "Admin",
  ) {
    const amount = Number(data.amount);
    const transactionDate = data.transactionDate
      ? new Date(data.transactionDate)
      : undefined;

    switch (data.type) {
      case "CUSTOMER_PAYMENT": {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId },
        });
        if (!booking) throw new NotFoundException("Booking not found");

        return prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: {
              bookingId: data.bookingId,
              amount,
              provider: "MANUAL",
              status: PaymentStatus.SUCCESS,
              transactionId: `manual_tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              ...(transactionDate ? { createdAt: transactionDate } : {}),
            },
          });

          const newPaidAmount = booking.paidAmount + amount;
          const newRemainingAmount = Math.max(
            0,
            booking.totalPrice - newPaidAmount,
          );
          let paymentStatus = "UNPAID";
          if (newPaidAmount >= booking.totalPrice) {
            paymentStatus = "PAID";
          } else if (newPaidAmount > 0) {
            paymentStatus = "PARTIALLY_PAID";
          }

          // Confirm the booking & update amounts
          await tx.booking.update({
            where: { id: data.bookingId },
            data: {
              status: BookingStatus.CONFIRMED,
              remainingAmount: newRemainingAmount,
              paidAmount: newPaidAmount,
              paymentStatus,
            },
          });

          // Create BookingTransaction entry
          await tx.bookingTransaction.create({
            data: {
              bookingId: data.bookingId,
              amount,
              paymentMethod: data.paymentMethod || "Bank Transfer",
              notes: data.notes || "Customer payment received",
              ...(transactionDate ? { paidOn: transactionDate } : {}),
            },
          });

          // Record in global ledger
          await vendorsService.appendLedgerEntry(tx, {
            bookingId: data.bookingId,
            bookingReference: booking.bookingReference ?? undefined,
            eventType: "CUSTOMER_PAYMENT",
            debit: amount,
            credit: 0.0,
            notes: data.notes || "Customer payment received",
            createdById: userId,
            referenceNumber: payment.transactionId ?? undefined,
            createdAt: transactionDate,
          });

          // If credit card charges are provided, update booking and create a separate transaction entry
          if (
            data.paymentMethod === "Credit Card" &&
            data.cardPaymentCharges &&
            Number(data.cardPaymentCharges) > 0
          ) {
            const ccCharges = Number(data.cardPaymentCharges);
            const isPaidByCompany = data.isPaidByCompany === true;

            await tx.booking.update({
              where: { id: data.bookingId },
              data: {
                cardPaymentCharges: { increment: ccCharges },
                ...(isPaidByCompany
                  ? { totalPrice: { decrement: ccCharges } }
                  : { totalPrice: { increment: ccCharges } }),
              },
            });

            await tx.bookingTransaction.create({
              data: {
                bookingId: data.bookingId,
                amount: isPaidByCompany ? -ccCharges : ccCharges,
                paymentMethod: "Credit Card",
                notes:
                  `Credit Card Charges for customer payment` +
                  (isPaidByCompany
                    ? " (Paid by Company)"
                    : " (Paid by Customer)"),
                ...(transactionDate ? { paidOn: transactionDate } : {}),
              },
            });

            await vendorsService.appendLedgerEntry(tx, {
              bookingId: data.bookingId,
              bookingReference: booking.bookingReference ?? undefined,
              eventType: "CUSTOMER_PAYMENT",
              debit: isPaidByCompany ? 0.0 : ccCharges,
              credit: isPaidByCompany ? ccCharges : 0.0,
              notes:
                `Credit Card Charges for customer payment` +
                (isPaidByCompany
                  ? " (Paid by Company)"
                  : " (Paid by Customer)"),
              createdById: userId,
              referenceNumber: `${payment.transactionId}-cc`,
              createdAt: transactionDate,
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
              ...(transactionDate ? { createdAt: transactionDate } : {}),
            },
          });

          await rabbitMQService.publish("payment.completed", {
            bookingId: data.bookingId,
            paymentId: payment.id,
          });

          return payment;
        });
      }

      case "VENDOR_PAYMENT": {
        return vendorsService.processVendorPayment(
          {
            vendorId: data.vendorId,
            paymentAmount: amount,
            paymentMethod: data.paymentMethod,
            bankAccount: data.bankAccount,
            notes: data.notes,
            useWallet: data.useWallet || false,
            bookingIds: data.bookingIds || [],
          },
          userId,
          adminName,
        );
      }

      case "VENDOR_REFUND": {
        return vendorsService.processVendorRefund({
          vendorId: data.vendorId,
          amount,
          notes: data.notes,
          createdById: userId,
          bookingId: data.bookingId || undefined,
          transactionDate: data.transactionDate,
        });
      }

      case "VENDOR_DISCOUNT": {
        return vendorsService.processVendorDiscount({
          vendorId: data.vendorId,
          amount,
          notes: data.notes,
          createdById: userId,
          bookingId: data.bookingId || undefined,
          transactionDate: data.transactionDate,
        });
      }

      case "CUSTOMER_REFUND": {
        const booking = await prisma.booking.findUnique({
          where: { id: data.bookingId },
        });
        if (!booking) throw new NotFoundException("Booking not found");

        return prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: {
              bookingId: data.bookingId,
              amount: -amount,
              provider: "MANUAL",
              status: PaymentStatus.SUCCESS,
              transactionId: `refund_tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              ...(transactionDate ? { createdAt: transactionDate } : {}),
            },
          });

          const newPaidAmount = Math.max(0, booking.paidAmount - amount);
          const newRemainingAmount = Math.max(
            0,
            booking.totalPrice - newPaidAmount,
          );
          let paymentStatus = "UNPAID";
          if (newPaidAmount >= booking.totalPrice) {
            paymentStatus = "PAID";
          } else if (newPaidAmount > 0) {
            paymentStatus = "PARTIALLY_PAID";
          }

          await tx.booking.update({
            where: { id: data.bookingId },
            data: {
              refundAmount: { increment: amount },
              remainingAmount: newRemainingAmount,
              paidAmount: newPaidAmount,
              paymentStatus,
            },
          });

          // Create BookingTransaction entry
          await tx.bookingTransaction.create({
            data: {
              bookingId: data.bookingId,
              amount: -amount,
              paymentMethod: data.paymentMethod || "Bank Transfer",
              notes: data.notes || "Customer Refund",
              ...(transactionDate ? { paidOn: transactionDate } : {}),
            },
          });

          // Record in global ledger
          await vendorsService.appendLedgerEntry(tx, {
            bookingId: data.bookingId,
            bookingReference: booking.bookingReference ?? undefined,
            eventType: "CUSTOMER_REFUND",
            debit: 0.0,
            credit: amount,
            notes: data.notes || "Customer Refund",
            createdById: userId,
            referenceNumber: payment.transactionId ?? undefined,
            createdAt: transactionDate,
          });

          return payment;
        });
      }

      case "AGENT_PAYOUT": {
        const agent = await prisma.agent.findUnique({
          where: { id: data.agentId },
        });
        if (!agent) throw new NotFoundException("Agent not found");
        if (agent.walletBalance < amount) {
          throw new BadRequestException("Insufficient agent wallet balance");
        }

        return prisma.agent.update({
          where: { id: data.agentId },
          data: {
            walletBalance: { decrement: amount },
          },
        });
      }

      default:
        throw new BadRequestException("Invalid transaction type");
    }
  }

  async submitPaymentRequest(data: any, userId: string) {
    const amount = Number(data.amount);
    if (!amount || amount <= 0)
      throw new BadRequestException("Valid amount is required");
    // if (!data.receiptUrl) throw new BadRequestException('Receipt upload is required');

    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) throw new NotFoundException("Booking not found");

    const request = await prisma.paymentRequest.create({
      data: {
        bookingId: data.bookingId,
        type: data.type || "CUSTOMER_PAYMENT",
        amount,
        paymentMethod: data.paymentMethod || "Bank Transfer",
        receiptUrl: data.receiptUrl,
        notes: data.notes,
        bankAccount: data.bankAccount,
        vendorId: data.vendorId,
        cardPaymentCharges: data.cardPaymentCharges
          ? Number(data.cardPaymentCharges)
          : null,
        isPaidByCompany: data.isPaidByCompany,
        transactionDate: data.transactionDate
          ? new Date(data.transactionDate)
          : null,
        createdById: userId,
      },
    });

    const agent = await prisma.user.findUnique({
      where: { id: userId },
      include: { userRoles: { include: { role: true } } },
    });
    const agentName = agent ? `${agent.firstName} ${agent.lastName}` : "System";
    const isAdmin = agent?.userRoles.some(
      (ur) => ur.role.name === "ADMIN" || ur.role.name === "SUPER_ADMIN",
    );

    if (isAdmin) {
      // Auto-approve the request if submitted by an Admin
      return await this.approvePaymentRequest(request.id, userId, agentName);
    }

    // Notify Admins only if it's an agent request
    const admins = await prisma.user.findMany({
      where: {
        userRoles: {
          some: {
            role: { name: { in: ["ADMIN", "SUPER_ADMIN"] } },
          },
        },
      },
    });

    if (admins.length > 0) {
      const notifications = admins.map((admin) => ({
        userId: admin.id,
        title: "New Payment Request",
        message: `${agentName} submitted a payment request of £${amount} for booking ${booking.bookingReference || data.bookingId}.`,
      }));
      await prisma.notification.createMany({ data: notifications });
    }

    return request;
  }

  async getPaymentRequests(query: any) {
    const { status } = query;
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    return prisma.paymentRequest.findMany({
      where: whereClause,
      include: {
        booking: {
          select: { bookingReference: true },
        },
        createdBy: {
          select: { firstName: true, lastName: true },
        },
        reviewedBy: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async approvePaymentRequest(id: string, adminId: string, adminName: string) {
    const request = await prisma.paymentRequest.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!request) throw new NotFoundException("Payment Request not found");
    if (request.status !== "PENDING")
      throw new BadRequestException(`Request is already ${request.status}`);

    // Call recordTransaction logic
    const recordPayload = {
      type: request.type,
      amount: request.amount,
      bookingId: request.bookingId,
      paymentMethod: request.paymentMethod,
      bankAccount: request.bankAccount,
      vendorId: request.vendorId,
      cardPaymentCharges: request.cardPaymentCharges,
      isPaidByCompany: request.isPaidByCompany,
      notes: request.notes,
      transactionDate: request.transactionDate,
    };

    const transactionResult = await this.recordTransaction(
      recordPayload,
      request.createdById,
      adminName,
    );

    // Update Request status
    const updatedRequest = await prisma.paymentRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    // Clear admin notifications for this request
    await prisma.notification.deleteMany({
      where: {
        title: "New Payment Request",
        message: {
          contains: `for booking ${request.booking.bookingReference || request.bookingId}.`,
        },
      },
    });

    // Notify Agent
    await prisma.notification.create({
      data: {
        userId: request.createdById,
        title: "Payment Request Approved",
        message: `Your payment request of £${request.amount} for booking ${request.booking.bookingReference || request.bookingId} has been approved.`,
      },
    });

    return updatedRequest;
  }

  async rejectPaymentRequest(id: string, reason: string, adminId: string) {
    const request = await prisma.paymentRequest.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!request) throw new NotFoundException("Payment Request not found");
    if (request.status !== "PENDING")
      throw new BadRequestException(`Request is already ${request.status}`);

    const updatedRequest = await prisma.paymentRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    // Clear admin notifications for this request
    await prisma.notification.deleteMany({
      where: {
        title: "New Payment Request",
        message: {
          contains: `for booking ${request.booking.bookingReference || request.bookingId}.`,
        },
      },
    });

    // Notify Agent
    await prisma.notification.create({
      data: {
        userId: request.createdById,
        title: "Payment Request Rejected",
        message: `Your payment request of £${request.amount} for booking ${request.booking.bookingReference || request.bookingId} has been rejected. Reason: ${reason}.`,
      },
    });

    return updatedRequest;
  }
}

export const paymentsService = new PaymentsService();

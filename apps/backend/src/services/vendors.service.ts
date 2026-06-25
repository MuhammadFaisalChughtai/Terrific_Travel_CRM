import { prisma } from '../config';
import { NotFoundException, BadRequestException } from '../middleware/error.middleware';

export class VendorsService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 100;
    const offset = Number(query.offset) || 0;

    const [total, items] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, limit, offset, items };
  }

  async findOne(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        wallet: true,
      }
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async create(data: any) {
    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        website: data.website || null,
        supportEmail: data.supportEmail || null,
        vendorType: data.vendorType,
        walletBalance: 0.0,
      },
    });

    // Create empty wallet on creation
    await prisma.vendorWallet.create({
      data: {
        vendorId: vendor.id,
        balance: 0.0,
      }
    });

    return vendor;
  }

  async update(id: string, data: any) {
    await this.findOne(id);

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        website: data.website !== undefined ? data.website : undefined,
        supportEmail: data.supportEmail !== undefined ? data.supportEmail : undefined,
        vendorType: data.vendorType,
      },
    });

    return vendor;
  }

  async delete(id: string) {
    await this.findOne(id);

    await prisma.vendor.delete({
      where: { id },
    });
    return { id, deleted: true };
  }

  // Helper to sync BookingVendorPayment on booking updates
  async syncBookingVendorPayments(bookingId: string, tx?: any) {
    const db = tx || prisma;

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        accommodations: true,
        flightServices: true,
        transportServices: true,
        visaServices: true,
        additionalServices: true,
      }
    });

    if (!booking) return;

    // Auto-resolve any AdditionalServices with customVendorName but missing vendorId
    for (const service of booking.additionalServices || []) {
      if (!service.vendorId && service.customVendorName) {
        const customName = service.customVendorName.trim();
        let customVendor = await db.vendor.findFirst({
          where: { name: { equals: customName, mode: 'insensitive' } }
        });
        if (!customVendor) {
          customVendor = await db.vendor.create({
            data: {
              name: customName,
              vendorType: 'Custom / Other',
              phoneNumber: 'N/A',
            }
          });
        }
        await db.additionalService.update({
          where: { id: service.id },
          data: { vendorId: customVendor.id }
        });
        service.vendorId = customVendor.id; // update in memory
      }
    }

    // Aggregate costs by vendor
    const vendorCosts: Record<string, number> = {};

    booking.accommodations?.forEach((x: any) => {
      if (x.vendorId) {
        vendorCosts[x.vendorId] = (vendorCosts[x.vendorId] || 0) + (x.price * (x.qty || 1));
      }
    });
    booking.flightServices?.forEach((x: any) => {
      if (x.vendorId) {
        vendorCosts[x.vendorId] = (vendorCosts[x.vendorId] || 0) + x.price;
      }
    });
    booking.transportServices?.forEach((x: any) => {
      if (x.vendorId) {
        vendorCosts[x.vendorId] = (vendorCosts[x.vendorId] || 0) + x.price;
      }
    });
    booking.visaServices?.forEach((x: any) => {
      if (x.vendorId) {
        vendorCosts[x.vendorId] = (vendorCosts[x.vendorId] || 0) + x.price;
      }
    });
    booking.additionalServices?.forEach((x: any) => {
      if (x.vendorId) {
        vendorCosts[x.vendorId] = (vendorCosts[x.vendorId] || 0) + x.servicePrice;
      }
    });

    // Fetch existing records
    const currentRecords = await db.bookingVendorPayment.findMany({
      where: { bookingId }
    });

    const activeVendorIds = Object.keys(vendorCosts);

    // Update or create active ones
    for (const vendorId of activeVendorIds) {
      const originalCost = vendorCosts[vendorId];
      const existing = currentRecords.find((r: any) => r.vendorId === vendorId);

      if (existing) {
        const diff = originalCost - existing.originalCost;
        if (diff !== 0) {
          const amountPaid = existing.amountPaid;
          const remainingBalance = Math.max(0, originalCost - amountPaid);
          let status = 'PENDING';
          if (amountPaid >= originalCost) {
            status = 'PAID';
          } else if (amountPaid > 0) {
            status = 'PARTIAL';
          }

          const updated = await db.bookingVendorPayment.update({
            where: { id: existing.id },
            data: {
              originalCost,
              remainingBalance,
              status,
            }
          });

          // Write to ledger
          const isInitialCost = existing.originalCost === 0;
          await this.appendLedgerEntry(db, {
            vendorId,
            bookingId,
            bookingReference: booking.bookingReference,
            eventType: 'INVOICE_CREATED',
            debit: diff > 0 ? diff : 0.0,
            credit: diff < 0 ? -diff : 0.0,
            notes: isInitialCost
              ? `Initial vendor invoice cost recorded for booking #${booking.bookingReference}`
              : `Booking vendor invoice adjustment: original cost updated from ${existing.originalCost} to ${originalCost}`,
            createdById: booking.userId, // System trigger from user booking change
          });

          // Audit Log
          await this.createAuditLog(db, {
            action: 'Booking Updated',
            adminName: 'System',
            adminId: booking.userId,
            oldValues: { originalCost: existing.originalCost, remainingBalance: existing.remainingBalance, status: existing.status },
            newValues: { originalCost: updated.originalCost, remainingBalance: updated.remainingBalance, status: updated.status },
            reason: `Service segment cost adjustment inside booking #${booking.bookingReference}`
          });
        }
      } else {
        // Create new
        await db.bookingVendorPayment.create({
          data: {
            bookingId,
            vendorId,
            originalCost,
            remainingBalance: originalCost,
            status: 'PENDING',
          }
        });

        // Write to ledger
        await this.appendLedgerEntry(db, {
          vendorId,
          bookingId,
          bookingReference: booking.bookingReference,
          eventType: 'INVOICE_CREATED',
          debit: originalCost,
          credit: 0.0,
          notes: `Initial vendor invoice cost recorded for booking #${booking.bookingReference}`,
          createdById: booking.userId,
        });

        // Audit Log
        await this.createAuditLog(db, {
          action: 'Booking Updated',
          adminName: 'System',
          adminId: booking.userId,
          oldValues: null,
          newValues: { vendorId, originalCost, status: 'PENDING' },
          reason: `Added services for vendor ${vendorId} in booking #${booking.bookingReference}`
        });
      }
    }

    // Set cost to 0 for vendors that are no longer on the booking
    for (const record of currentRecords) {
      if (!activeVendorIds.includes(record.vendorId) && record.originalCost > 0) {
        const diff = -record.originalCost;
        const amountPaid = record.amountPaid;
        const remainingBalance = Math.max(0, 0 - amountPaid);
        const status = amountPaid > 0 ? 'PARTIAL' : 'PAID';

        await db.bookingVendorPayment.update({
          where: { id: record.id },
          data: {
            originalCost: 0.0,
            remainingBalance,
            status,
          }
        });

        await this.appendLedgerEntry(db, {
          vendorId: record.vendorId,
          bookingId,
          bookingReference: booking.bookingReference,
          eventType: 'INVOICE_CREATED',
          debit: 0.0,
          credit: -diff,
          notes: `Services removed for this vendor from booking #${booking.bookingReference}`,
          createdById: booking.userId,
        });

        await this.createAuditLog(db, {
          action: 'Booking Updated',
          adminName: 'System',
          adminId: booking.userId,
          oldValues: { originalCost: record.originalCost },
          newValues: { originalCost: 0.0, status },
          reason: `Removed all services for vendor ${record.vendorId} in booking #${booking.bookingReference}`
        });
      }
    }
  }

  // Load unpaid/partially paid bookings for vendor
  async getOutstandingBookings(vendorId: string) {
    const outstanding = await prisma.bookingVendorPayment.findMany({
      where: {
        vendorId,
        status: { in: ['PENDING', 'PARTIAL'] }
      },
      include: {
        booking: {
          include: {
            user: true, // For customer name details
          }
        }
      },
      orderBy: {
        booking: {
          createdAt: 'asc'
        }
      }
    });

    const items = outstanding.map(x => ({
      bookingId: x.bookingId,
      bookingReference: x.booking.bookingReference,
      customerName: `${x.booking.user.firstName} ${x.booking.user.lastName}`,
      bookingDate: x.booking.createdAt,
      vendorId: x.vendorId,
      originalCost: x.originalCost,
      amountPaid: x.amountPaid,
      remainingBalance: x.remainingBalance,
      status: x.status,
    }));

    const totalOutstanding = items.reduce((sum, item) => sum + item.remainingBalance, 0);

    return { items, totalOutstanding };
  }

  // Process a vendor payment
  async processVendorPayment(data: any, createdById: string, adminName: string) {
    const {
      vendorId,
      paymentAmount,
      paymentMethod,
      bankAccount,
      notes,
      receiptUrl,
      useWallet,
      bookingIds,
      cardPaymentCharges
    } = data;

    const amount = Number(paymentAmount) || 0;
    if (amount <= 0 && !useWallet) {
      throw new BadRequestException('Payment amount must be greater than zero or use wallet credit');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Fetch vendor wallet
      // 1. Fetch vendor wallet
      let actualVendorId = vendorId;
      if (vendorId.startsWith('custom-')) {
        const customName = vendorId.substring(7);
        let customVendor = await tx.vendor.findFirst({
          where: { name: { equals: customName, mode: 'insensitive' } }
        });
        if (!customVendor) {
          customVendor = await tx.vendor.create({
            data: {
              name: customName,
              vendorType: 'Custom / Other',
              phoneNumber: 'N/A',
            }
          });
        }
        actualVendorId = customVendor.id;

        // Update all additional services on these bookings to point to the newly created vendor
        await tx.additionalService.updateMany({
          where: {
            bookingId: { in: bookingIds },
            customVendorName: { equals: customName, mode: 'insensitive' },
          },
          data: {
            vendorId: actualVendorId,
            customVendorName: null,
          }
        });
      }

      let wallet = await tx.vendorWallet.findUnique({ where: { vendorId: actualVendorId } });
      if (!wallet) {
        wallet = await tx.vendorWallet.create({ data: { vendorId: actualVendorId, balance: 0.0 } });
      }

      // 2. Generate unique reference number
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.vendorPayment.count({
        where: { referenceNumber: { startsWith: `VP-${todayStr}` } }
      });
      const seq = String(countToday + 1).padStart(6, '0');
      const referenceNumber = `VP-${todayStr}-${seq}`;

      // 3. Create VendorPayment record
      const payment = await tx.vendorPayment.create({
        data: {
          vendorId: actualVendorId,
          amount,
          paymentMethod,
          bankAccount: bankAccount || null,
          referenceNumber,
          notes: notes || null,
          receiptUrl: receiptUrl || null,
          createdById,
        }
      });

      // Ensure BookingVendorPayment records exist for all selected bookings
      for (const bId of bookingIds) {
        const existingBVP = await tx.bookingVendorPayment.findFirst({
          where: { bookingId: bId, vendorId: actualVendorId }
        });
        if (!existingBVP) {
          const b = await tx.booking.findUnique({
            where: { id: bId },
            include: {
              accommodations: true,
              flightServices: true,
              transportServices: true,
              visaServices: true,
              additionalServices: true
            }
          });
          if (b) {
            let totalServiceCost = 0;
            b.accommodations.forEach((s: any) => { if (s.vendorId === actualVendorId) totalServiceCost += s.price; });
            b.flightServices.forEach((s: any) => { if (s.vendorId === actualVendorId) totalServiceCost += s.price; });
            b.transportServices.forEach((s: any) => { if (s.vendorId === actualVendorId) totalServiceCost += s.price; });
            b.visaServices.forEach((s: any) => { if (s.vendorId === actualVendorId) totalServiceCost += s.price; });
            b.additionalServices.forEach((s: any) => { if (s.vendorId === actualVendorId) totalServiceCost += s.servicePrice; });

            if (totalServiceCost > 0) {
              await tx.bookingVendorPayment.create({
                data: {
                  bookingId: bId,
                  vendorId: actualVendorId,
                  originalCost: totalServiceCost,
                  remainingBalance: totalServiceCost,
                  status: 'PENDING'
                }
              });
            }
          }
        }
      }

      // 4. Fetch selected bookings ordered oldest first
      const outstanding = await tx.bookingVendorPayment.findMany({
        where: {
          vendorId: actualVendorId,
          bookingId: { in: bookingIds }
        },
        include: {
          booking: true
        },
        orderBy: {
          booking: {
            createdAt: 'asc'
          }
        }
      });

      // Validate duplicate checks
      const alreadyPaidBookings = outstanding.filter(ob => ob.status === 'PAID');
      if (alreadyPaidBookings.length > 0) {
        throw new BadRequestException(`Booking reference ${alreadyPaidBookings[0].booking.bookingReference} has already been fully paid to this vendor.`);
      }

      let cashRemaining = amount;
      let walletDeducted = 0.0;

      const allocationLog: any[] = [];

      for (const ob of outstanding) {
        const need = ob.remainingBalance;
        if (need <= 0) continue;

        let walletUsageForBooking = 0.0;
        if (useWallet && (wallet.balance - walletDeducted) > 0) {
          walletUsageForBooking = Math.min(need, wallet.balance - walletDeducted);
          walletDeducted += walletUsageForBooking;
        }

        const remainingNeed = need - walletUsageForBooking;
        let cashUsageForBooking = 0.0;
        if (remainingNeed > 0 && cashRemaining > 0) {
          cashUsageForBooking = Math.min(remainingNeed, cashRemaining);
          cashRemaining -= cashUsageForBooking;
        }

        const totalAllocated = walletUsageForBooking + cashUsageForBooking;

        if (totalAllocated > 0) {
          const amountPaidNew = ob.amountPaid + totalAllocated;
          const remainingBalanceNew = Math.max(0, ob.originalCost - amountPaidNew);
          let statusNew = 'PENDING';
          if (remainingBalanceNew <= 0) {
            statusNew = 'PAID';
          } else if (amountPaidNew > 0) {
            statusNew = 'PARTIAL';
          }

          // Update booking payment record
          await tx.bookingVendorPayment.update({
            where: { id: ob.id },
            data: {
              amountPaid: amountPaidNew,
              remainingBalance: remainingBalanceNew,
              status: statusNew,
            }
          });

          await tx.bookingTransaction.create({
            data: {
              bookingId: ob.bookingId,
              amount: totalAllocated,
              paymentMethod: paymentMethod,
              notes: `Vendor Payment (Ref: ${referenceNumber}). Allocated amount: £${totalAllocated.toFixed(2)}.` + 
                     (receiptUrl ? ` Receipt: ${receiptUrl}.` : '') + 
                     (notes ? ` Notes: ${notes}` : '')
            }
          });

          // Create allocation
          await tx.vendorPaymentAllocation.create({
            data: {
              vendorPaymentId: payment.id,
              bookingId: ob.bookingId,
              amount: totalAllocated,
            }
          });

          // Ledger and Wallet entries
          if (cashUsageForBooking > 0) {
            await this.appendLedgerEntry(tx, {
              vendorId: actualVendorId,
              bookingId: ob.bookingId,
              bookingReference: ob.booking.bookingReference,
              eventType: 'VENDOR_PAYMENT',
              debit: 0.0,
              credit: cashUsageForBooking,
              referenceNumber,
              notes: `Cash payment allocation from reference ${referenceNumber}` + (receiptUrl ? ` | Receipt: ${receiptUrl}` : ''),
              createdById,
            });
          }

          if (walletUsageForBooking > 0) {
            await this.appendLedgerEntry(tx, {
              vendorId: actualVendorId,
              bookingId: ob.bookingId,
              bookingReference: ob.booking.bookingReference,
              eventType: 'WALLET_USAGE',
              debit: 0.0,
              credit: walletUsageForBooking,
              referenceNumber,
              notes: `Wallet credit allocation from transaction ${referenceNumber}` + (receiptUrl ? ` | Receipt: ${receiptUrl}` : ''),
              createdById,
            });

            // Record wallet debit transaction
            await tx.vendorWalletTransaction.create({
              data: {
                walletId: wallet.id,
                amount: -walletUsageForBooking,
                type: 'DEBIT_BOOKING_PAYMENT',
                reference: referenceNumber,
                notes: `Deducted for booking #${ob.booking.bookingReference}`,
                createdById,
              }
            });
          }

          allocationLog.push({
            bookingId: ob.bookingId,
            bookingReference: ob.booking.bookingReference,
            allocatedAmount: totalAllocated,
            fromCash: cashUsageForBooking,
            fromWallet: walletUsageForBooking,
            status: statusNew,
          });
        }
      }

      // Handle card payment charges separately if credit card selected
      if (paymentMethod === 'Credit Card' && cardPaymentCharges && Number(cardPaymentCharges) > 0) {
        const ccCharges = Number(cardPaymentCharges);
        const firstBookingId = bookingIds[0] || (outstanding[0] ? outstanding[0].bookingId : null);
        if (firstBookingId) {
          // Increment cardPaymentCharges on Booking
          await tx.booking.update({
            where: { id: firstBookingId },
            data: {
              cardPaymentCharges: { increment: ccCharges }
            }
          });

          // Create a separate BookingTransaction for the credit card charges
          await tx.bookingTransaction.create({
            data: {
              bookingId: firstBookingId,
              amount: ccCharges,
              paymentMethod: 'Credit Card',
              notes: `Credit Card Charges for vendor payment (Ref: ${referenceNumber})`
            }
          });
        }
      }

      // Handle overpayments (surplus cash goes to wallet)
      let walletCredited = 0.0;
      if (cashRemaining > 0) {
        walletCredited = cashRemaining;

        // Credit wallet transaction
        await tx.vendorWalletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: walletCredited,
            type: 'CREDIT_OVERPAYMENT',
            reference: referenceNumber,
            notes: 'Overpayment credit allocation',
            createdById,
          }
        });

        // Add to ledger
        await this.appendLedgerEntry(tx, {
          vendorId: actualVendorId,
          eventType: 'VENDOR_PAYMENT',
          debit: 0.0,
          credit: walletCredited,
          referenceNumber,
          notes: `Overpayment cash processed from payment ${referenceNumber}` + (receiptUrl ? ` | Receipt: ${receiptUrl}` : ''),
          createdById,
        });

        await this.appendLedgerEntry(tx, {
          vendorId: actualVendorId,
          eventType: 'WALLET_CREDIT',
          debit: walletCredited,
          credit: 0.0,
          referenceNumber,
          notes: `Surplus cash transferred to wallet credit` + (receiptUrl ? ` | Receipt: ${receiptUrl}` : ''),
          createdById,
        });
      }

      // Update wallet final balance
      const newWalletBalance = wallet.balance - walletDeducted + walletCredited;
      await tx.vendorWallet.update({
        where: { id: wallet.id },
        data: { balance: newWalletBalance }
      });

      await tx.vendor.update({
        where: { id: actualVendorId },
        data: { walletBalance: newWalletBalance }
      });

      // Compliance Audit
      await this.createAuditLog(tx, {
        action: 'Payment Created',
        adminName,
        adminId: createdById,
        newValues: {
          paymentId: payment.id,
          referenceNumber,
          amount,
          walletDeducted,
          walletCredited,
          allocations: allocationLog,
        },
        reason: notes || 'Processed vendor payments'
      });

      return {
        payment,
        walletDeducted,
        walletCredited,
        walletBalance: newWalletBalance,
        allocations: allocationLog,
      };
    });
  }

  // Reverse a payment
  async reversePayment(paymentId: string, reversedById: string, adminName: string, reason: string) {
    return await prisma.$transaction(async (tx) => {
      const payment = await tx.vendorPayment.findUnique({
        where: { id: paymentId },
        include: {
          allocations: {
            include: {
              booking: true,
            }
          },
          vendor: {
            include: {
              wallet: true,
            }
          }
        }
      });

      if (!payment) throw new NotFoundException('Vendor payment not found');
      if (payment.isReversed) throw new BadRequestException('This payment has already been reversed');

      const vendorId = payment.vendorId;
      const referenceNumber = payment.referenceNumber;

      // 1. Mark payment as reversed
      await tx.vendorPayment.update({
        where: { id: paymentId },
        data: {
          isReversed: true,
          reversedAt: new Date(),
          reversedById,
        }
      });

      // 2. Reverse allocations
      for (const alloc of payment.allocations) {
        await tx.vendorPaymentAllocation.update({
          where: { id: alloc.id },
          data: { isReversed: true }
        });

        const ob = await tx.bookingVendorPayment.findUnique({
          where: { bookingId_vendorId: { bookingId: alloc.bookingId, vendorId } }
        });

        if (ob) {
          const amountPaidNew = Math.max(0, ob.amountPaid - alloc.amount);
          const remainingBalanceNew = ob.originalCost - amountPaidNew;
          let statusNew = 'PENDING';
          if (remainingBalanceNew <= 0) {
            statusNew = 'PAID';
          } else if (amountPaidNew > 0) {
            statusNew = 'PARTIAL';
          }

          await tx.bookingVendorPayment.update({
            where: { id: ob.id },
            data: {
              amountPaid: amountPaidNew,
              remainingBalance: remainingBalanceNew,
              status: statusNew,
            }
          });
        }

        // Ledger reversal entry
        await this.appendLedgerEntry(tx, {
          vendorId,
          bookingId: alloc.bookingId,
          bookingReference: alloc.booking.bookingReference,
          eventType: 'REVERSAL',
          debit: alloc.amount,
          credit: 0.0,
          referenceNumber,
          notes: `Reversal of booking payment allocation from transaction ${referenceNumber}`,
          createdById: reversedById,
        });
      }

      // 3. Query wallet impacts to reverse
      const wallet = payment.vendor.wallet;
      if (wallet) {
        // Find wallet transactions linked to this payment
        const walletTransactions = await tx.vendorWalletTransaction.findMany({
          where: { reference: referenceNumber }
        });

        const walletUsed = walletTransactions
          .filter(t => t.type === 'DEBIT_BOOKING_PAYMENT')
          .reduce((sum, t) => sum - t.amount, 0); // stored as negative

        const walletCredited = walletTransactions
          .filter(t => t.type === 'CREDIT_OVERPAYMENT')
          .reduce((sum, t) => sum + t.amount, 0); // stored as positive

        // Adjust wallet balance
        // We restore what we used, and deduct what we credited
        const netAdjustment = walletUsed - walletCredited;
        const newWalletBalance = wallet.balance + netAdjustment;

        await tx.vendorWallet.update({
          where: { id: wallet.id },
          data: { balance: newWalletBalance }
        });

        await tx.vendor.update({
          where: { id: vendorId },
          data: { walletBalance: newWalletBalance }
        });

        // Wallet transactions
        if (walletUsed > 0) {
          await tx.vendorWalletTransaction.create({
            data: {
              walletId: wallet.id,
              amount: walletUsed,
              type: 'REVERSAL_DEBIT',
              reference: referenceNumber,
              notes: `Restored wallet usage from reversed payment ${referenceNumber}`,
              createdById: reversedById,
            }
          });
        }

        if (walletCredited > 0) {
          await tx.vendorWalletTransaction.create({
            data: {
              walletId: wallet.id,
              amount: -walletCredited,
              type: 'REVERSAL_CREDIT',
              reference: referenceNumber,
              notes: `Deducted wallet credit from reversed payment ${referenceNumber}`,
              createdById: reversedById,
            }
          });

          // Ledger reversals for overpayment
          await this.appendLedgerEntry(tx, {
            vendorId,
            eventType: 'REVERSAL',
            debit: walletCredited,
            credit: 0.0,
            referenceNumber,
            notes: `Reversal of overpayment cash from payment ${referenceNumber}`,
            createdById: reversedById,
          });

          await this.appendLedgerEntry(tx, {
            vendorId,
            eventType: 'REVERSAL',
            debit: 0.0,
            credit: walletCredited,
            referenceNumber,
            notes: `Reversal of wallet credit allocation for payment ${referenceNumber}`,
            createdById: reversedById,
          });
        }
      }

      // Audit Compliance
      await this.createAuditLog(tx, {
        action: 'Payment Reversed',
        adminName,
        adminId: reversedById,
        oldValues: { paymentId, referenceNumber, amount: payment.amount },
        newValues: { isReversed: true },
        reason,
      });

      return { success: true };
    });
  }

  // Get complete ledger for vendor or all vendors
  async getLedger(vendorId?: string) {
    const where: any = {};
    if (vendorId) where.vendorId = vendorId;

    const entries = await prisma.vendorLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: true,
        vendor: true
      }
    });

    return entries.map(x => ({
      id: x.id,
      timestamp: x.createdAt,
      bookingId: x.bookingId,
      bookingReference: x.bookingReference,
      eventType: x.eventType,
      debit: x.debit,
      credit: x.credit,
      runningBalance: x.runningBalance,
      referenceNumber: x.referenceNumber,
      notes: x.notes,
      vendorName: x.vendor?.name || 'Client',
      adminName: `${x.createdBy.firstName} ${x.createdBy.lastName}`,
    }));
  }

  // Fetch wallet audit history
  async getWalletHistory(vendorId: string) {
    const wallet = await prisma.vendorWallet.findUnique({
      where: { vendorId }
    });
    if (!wallet) return [];

    const txs = await prisma.vendorWalletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: true
      }
    });

    let balanceAccumulator = wallet.balance;
    const items = txs.map((x, index) => {
      const runningBalance = balanceAccumulator;
      balanceAccumulator -= x.amount; // backtrack for running balance chronology
      return {
        id: x.id,
        timestamp: x.createdAt,
        amount: x.amount,
        type: x.type,
        reference: x.reference,
        notes: x.notes,
        runningBalance,
        adminName: `${x.createdBy.firstName} ${x.createdBy.lastName}`,
      };
    });

    return items;
  }

  // Fetch KPI dashboard summary
  async getDashboardSummary(vendorId: string) {
    const payments = await prisma.bookingVendorPayment.findMany({
      where: { vendorId }
    });

    const totalOutstanding = payments.reduce((sum, p) => sum + p.remainingBalance, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    const pendingCount = payments.filter(p => p.status === 'PENDING').length;
    const partialCount = payments.filter(p => p.status === 'PARTIAL').length;
    const paidCount = payments.filter(p => p.status === 'PAID').length;

    // Fetch vendor wallet
    const wallet = await prisma.vendorWallet.findUnique({
      where: { vendorId }
    });
    const walletBalance = wallet ? wallet.balance : 0.0;

    // Fetch last payment date
    const lastPayment = await prisma.vendorPayment.findFirst({
      where: { vendorId, isReversed: false },
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalOutstanding,
      totalPaid,
      walletBalance,
      pendingCount,
      partialCount,
      paidCount,
      lastPaymentDate: lastPayment ? lastPayment.createdAt : null,
    };
  }

  // List all payments
  async getPayments(query: any) {
    const limit = Number(query.limit) || 100;
    const offset = Number(query.offset) || 0;
    const vendorId = query.vendorId as string;

    const where: any = {};
    if (vendorId) where.vendorId = vendorId;

    const [total, items] = await Promise.all([
      prisma.vendorPayment.count({ where }),
      prisma.vendorPayment.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: true,
          createdBy: true,
          allocations: {
            include: {
              booking: true,
            }
          }
        }
      })
    ]);

    return {
      total,
      limit,
      offset,
      items: items.map(p => ({
        id: p.id,
        vendorName: p.vendor.name,
        vendorId: p.vendorId,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        bankAccount: p.bankAccount,
        referenceNumber: p.referenceNumber,
        notes: p.notes,
        receiptUrl: p.receiptUrl,
        isReversed: p.isReversed,
        reversedAt: p.reversedAt,
        createdAt: p.createdAt,
        adminName: `${p.createdBy.firstName} ${p.createdBy.lastName}`,
        allocations: p.allocations.map(a => ({
          bookingId: a.bookingId,
          bookingReference: a.booking.bookingReference,
          amount: a.amount,
        }))
      }))
    };
  }

  // Public Vendor Refund Handler
  async processVendorRefund(params: {
    vendorId: string;
    amount: number;
    notes?: string;
    createdById: string;
    bookingId?: string;
    transactionDate?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const amount = Number(params.amount);
      let bookingRef: string | null = null;
      const transactionDate = params.transactionDate ? new Date(params.transactionDate) : undefined;
      
      if (params.bookingId) {
        const bvp = await tx.bookingVendorPayment.findUnique({
          where: {
            bookingId_vendorId: {
              bookingId: params.bookingId,
              vendorId: params.vendorId
            }
          },
          include: { booking: true }
        });
        
        if (bvp) {
          bookingRef = bvp.booking.bookingReference;
          const newAmountPaid = Math.max(0, bvp.amountPaid - amount);
          const newRemaining = bvp.originalCost - newAmountPaid;
          let status = 'PENDING';
          if (newAmountPaid >= bvp.originalCost) {
            status = 'PAID';
          } else if (newAmountPaid > 0) {
            status = 'PARTIAL';
          }
          
          await tx.bookingVendorPayment.update({
            where: { id: bvp.id },
            data: {
              amountPaid: newAmountPaid,
              remainingBalance: newRemaining,
              status
            }
          });

          // Create BookingTransaction record
          await tx.bookingTransaction.create({
            data: {
              bookingId: params.bookingId,
              amount: -amount, // vendor refund reduces total vendor payment allocated
              paymentMethod: 'Refund',
              notes: `Vendor Refund from Vendor (Ref: ${params.vendorId}). ` + (params.notes || ''),
              ...(transactionDate ? { paidOn: transactionDate } : {})
            }
          });
        }
      }

      let wallet = await tx.vendorWallet.findUnique({
        where: { vendorId: params.vendorId }
      });
      if (!wallet) {
        wallet = await tx.vendorWallet.create({
          data: { vendorId: params.vendorId, balance: 0 }
        });
      }
      
      const updatedWallet = await tx.vendorWallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      });

      await tx.vendorWalletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'CREDIT_OVERPAYMENT',
          notes: params.notes || 'Vendor Refund',
          createdById: params.createdById,
          ...(transactionDate ? { createdAt: transactionDate } : {})
        }
      });

      await this.appendLedgerEntry(tx, {
        vendorId: params.vendorId,
        bookingId: params.bookingId,
        bookingReference: bookingRef || undefined,
        eventType: 'VENDOR_REFUND',
        debit: 0.0,
        credit: amount,
        notes: params.notes || 'Refund from Vendor',
        createdById: params.createdById,
        createdAt: transactionDate
      });

      await tx.vendor.update({
        where: { id: params.vendorId },
        data: { walletBalance: updatedWallet.balance }
      });

      return updatedWallet;
    });
  }

  // Public Vendor Discount Handler
  async processVendorDiscount(params: {
    vendorId: string;
    amount: number;
    notes?: string;
    createdById: string;
    bookingId?: string;
    transactionDate?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const amount = Number(params.amount);
      let bookingRef: string | null = null;
      const transactionDate = params.transactionDate ? new Date(params.transactionDate) : undefined;
      
      if (params.bookingId) {
        const bvp = await tx.bookingVendorPayment.findUnique({
          where: {
            bookingId_vendorId: {
              bookingId: params.bookingId,
              vendorId: params.vendorId
            }
          },
          include: { booking: true }
        });
        
        if (bvp) {
          bookingRef = bvp.booking.bookingReference;
          // Discount reduces the original cost we owe them
          const newOriginalCost = Math.max(0, bvp.originalCost - amount);
          const newRemaining = Math.max(0, newOriginalCost - bvp.amountPaid);
          let status = 'PENDING';
          if (bvp.amountPaid >= newOriginalCost) {
            status = 'PAID';
          } else if (bvp.amountPaid > 0) {
            status = 'PARTIAL';
          }
          
          await tx.bookingVendorPayment.update({
            where: { id: bvp.id },
            data: {
              originalCost: newOriginalCost,
              remainingBalance: newRemaining,
              status
            }
          });

          // Create BookingTransaction record
          await tx.bookingTransaction.create({
            data: {
              bookingId: params.bookingId,
              amount: 0, // A discount doesn't change cash flow from the customer immediately, but affects our cost.
              paymentMethod: 'Discount',
              notes: `Discount received from Vendor (Ref: ${params.vendorId}). ` + (params.notes || ''),
              ...(transactionDate ? { paidOn: transactionDate } : {})
            }
          });
        }
      }

      // We might also add this discount to their wallet if it acts as credit, but 
      // usually a discount just reduces what we owe. If we already overpaid, it becomes credit.
      let wallet = await tx.vendorWallet.findUnique({
        where: { vendorId: params.vendorId }
      });
      if (!wallet) {
        wallet = await tx.vendorWallet.create({
          data: { vendorId: params.vendorId, balance: 0 }
        });
      }
      
      const updatedWallet = await tx.vendorWallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      });

      await tx.vendorWalletTransaction.create({
        data: {
          walletId: wallet.id,
          amount,
          type: 'CREDIT_DISCOUNT',
          notes: params.notes || 'Vendor Discount',
          createdById: params.createdById,
          ...(transactionDate ? { createdAt: transactionDate } : {})
        }
      });

      await this.appendLedgerEntry(tx, {
        vendorId: params.vendorId,
        bookingId: params.bookingId,
        bookingReference: bookingRef || undefined,
        eventType: 'VENDOR_DISCOUNT',
        debit: 0.0,
        credit: amount, // A discount increases our balance/credit with them
        notes: params.notes || 'Discount from Vendor',
        createdById: params.createdById,
        createdAt: transactionDate
      });

      await tx.vendor.update({
        where: { id: params.vendorId },
        data: { walletBalance: updatedWallet.balance }
      });

      return updatedWallet;
    });
  }

  // Public Ledger Append Helper
  public async appendLedgerEntry(tx: any, params: {
    vendorId?: string;
    bookingId?: string;
    bookingReference?: string;
    eventType: string;
    debit: number;
    credit: number;
    referenceNumber?: string;
    notes?: string;
    createdById: string;
    createdAt?: Date;
  }) {
    if (params.debit === 0 && params.credit === 0) {
      return null;
    }

    const lastLedger = await tx.vendorLedger.findFirst({
      where: { vendorId: params.vendorId || null },
      orderBy: { createdAt: 'desc' },
    });
    const lastBalance = lastLedger ? lastLedger.runningBalance : 0.0;
    const runningBalance = lastBalance + params.debit - params.credit;

    return tx.vendorLedger.create({
      data: {
        vendorId: params.vendorId || null,
        bookingId: params.bookingId || null,
        bookingReference: params.bookingReference || null,
        eventType: params.eventType,
        debit: params.debit,
        credit: params.credit,
        runningBalance,
        referenceNumber: params.referenceNumber || null,
        notes: params.notes || null,
        createdById: params.createdById,
        ...(params.createdAt ? { createdAt: params.createdAt } : {})
      }
    });
  }

  // Private Audit Trail Helper
  private async createAuditLog(tx: any, params: {
    action: string;
    adminName: string;
    adminId: string;
    oldValues?: any;
    newValues?: any;
    reason?: string;
  }) {
    return tx.vendorAuditLog.create({
      data: {
        action: params.action,
        adminName: params.adminName,
        adminId: params.adminId,
        oldValues: params.oldValues || null,
        newValues: params.newValues || null,
        reason: params.reason || null,
      }
    });
  }
}

export const vendorsService = new VendorsService();

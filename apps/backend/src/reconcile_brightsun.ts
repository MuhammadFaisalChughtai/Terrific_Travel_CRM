import { prisma } from './config';
import * as fs from 'fs';
import * as path from 'path';

interface DumpLedgerEntry {
  id?: string;
  vendorId: string;
  bookingId: string | null;
  bookingReference: string | null;
  eventType: string;
  debit: string;
  credit: string;
  runningBalance: string;
  notes: string | null;
  referenceNumber: string | null;
  createdById: string;
  createdAt: string;
  agentId: string | null;
}

async function main() {
  console.log('Starting Production Database Reconciliation for Brightsun Travel Ltd...');

  const vendorId = '1';

  // ==========================================
  // Part 1: Update Booking/Segment Data
  // ==========================================

  // 1. Booking TT00984 segment assignment
  console.log('Updating TT00984 flight service vendor assignment...');
  const segmentToMove = await prisma.flightService.findFirst({
    where: {
      booking: { bookingReference: 'TT00984' },
      price: 2136.56,
      vendorId: '5',
    },
  });

  if (segmentToMove) {
    await prisma.flightService.update({
      where: { id: segmentToMove.id },
      data: { vendorId: '1' },
    });
    console.log(`Moved flight segment ${segmentToMove.id} of price 2136.56 to vendor '1'`);
  } else {
    console.log('No segment of price 2136.56 under vendor 5 found for TT00984 (maybe already updated).');
  }

  // 2. Booking TT00846 segment assignment
  console.log('Updating TT00846 flight service vendor assignment and price...');
  const segmentToMove846 = await prisma.flightService.findFirst({
    where: {
      booking: { bookingReference: 'TT00846' },
      pnr: { in: ['FV63LM', 'Y6FS5E'] },
    },
  });

  if (segmentToMove846) {
    await prisma.flightService.update({
      where: { id: segmentToMove846.id },
      data: {
        vendorId: '1',
        price: 1770.26,
        pnr: 'Y6FS5E',
        status: 'CONFIRMED',
      },
    });
    console.log(`Updated flight segment ${segmentToMove846.id} of TT00846 to vendor '1' with price 1770.26 and PNR Y6FS5E.`);
  } else {
    console.log('No segment with PNR FV63LM/Y6FS5E found for TT00846.');
  }

  // 3. Booking TT00955 segment price
  console.log('Updating TT00955 flight service segment price...');
  const segment955 = await prisma.flightService.findFirst({
    where: {
      booking: { bookingReference: 'TT00955' },
      vendorId: '1',
    },
  });

  if (segment955) {
    await prisma.flightService.update({
      where: { id: segment955.id },
      data: { price: 862.88 },
    });
    console.log(`Updated flight segment ${segment955.id} price to 862.88`);
  }

  // 4. Booking TT00494 segment price
  console.log('Updating TT00494 flight service segment price...');
  const segment494 = await prisma.flightService.findFirst({
    where: {
      booking: { bookingReference: 'TT00494' },
      vendorId: '1',
    },
  });

  if (segment494) {
    await prisma.flightService.update({
      where: { id: segment494.id },
      data: { price: 1629.18 },
    });
    console.log(`Updated flight segment ${segment494.id} price to 1629.18`);
  }

  // 5. Delete incorrect payment allocations to TT00970
  console.log('Deleting incorrect payment allocations to TT00970...');
  const booking970 = await prisma.booking.findFirst({
    where: { bookingReference: 'TT00970' },
  });

  if (booking970) {
    const deletedAllocations = await prisma.vendorPaymentAllocation.deleteMany({
      where: {
        bookingId: booking970.id,
        vendorPayment: { vendorId: '1' },
      },
    });
    console.log(`Deleted ${deletedAllocations.count} payment allocation(s) to TT00970.`);
  }

  // ==========================================
  // Part 2: Fix BookingVendorPayment (BVP) Records
  // ==========================================
  console.log('Updating BookingVendorPayment records for statement bookings...');
  const statementBookings = [
    { ref: 'TT00981', cost: 6227.98, paid: 1054.48, remaining: 5173.50, status: 'PARTIAL' },
    { ref: 'TT00984', cost: 2443.96, paid: 0.00, remaining: 2443.96, status: 'PENDING' },
    { ref: 'TT00970', cost: 829.80, paid: 0.00, remaining: 829.80, status: 'PENDING' },
    { ref: 'TT00991', cost: 1079.20, paid: 0.00, remaining: 1079.20, status: 'PENDING' },
    { ref: 'TT00846', cost: 1770.26, paid: 0.00, remaining: 1770.26, status: 'PENDING' },
    { ref: 'TT00955', cost: 862.88, paid: 0.00, remaining: 862.88, status: 'PENDING' },
    { ref: 'TT00494', cost: 1629.18, paid: 0.00, remaining: 1629.18, status: 'PENDING' },
    { ref: 'TT00976', cost: 2931.57, paid: 3252.50, remaining: -320.93, status: 'PAID' }, // Remaining represents the credit note overpayment
  ];

  for (const item of statementBookings) {
    const booking = await prisma.booking.findFirst({
      where: { bookingReference: item.ref },
    });

    if (booking) {
      await prisma.bookingVendorPayment.upsert({
        where: {
          bookingId_vendorId: {
            bookingId: booking.id,
            vendorId: '1',
          },
        },
        update: {
          originalCost: item.cost,
          amountPaid: item.paid,
          remainingBalance: item.remaining,
          status: item.status,
        },
        create: {
          bookingId: booking.id,
          vendorId: '1',
          originalCost: item.cost,
          amountPaid: item.paid,
          remainingBalance: item.remaining,
          status: item.status,
        },
      });
      console.log(`Updated BVP for ${item.ref} to Cost: ${item.cost}, Paid: ${item.paid}, Remaining: ${item.remaining}`);
    } else {
      console.log(`WARNING: Booking ${item.ref} not found in database.`);
    }
  }

  // Clean up other Brightsun BookingVendorPayment records (set remaining balance to 0 and status to PAID)
  console.log('Cleaning up other Brightsun BookingVendorPayment records to prevent balance bloat...');
  const statementRefs = statementBookings.map((x) => x.ref);
  const otherBVPs = await prisma.bookingVendorPayment.findMany({
    where: {
      vendorId: '1',
      booking: {
        bookingReference: { notIn: statementRefs },
      },
    },
  });

  for (const bvp of otherBVPs) {
    await prisma.bookingVendorPayment.update({
      where: {
        bookingId_vendorId: {
          bookingId: bvp.bookingId,
          vendorId: '1',
        },
      },
      data: {
        remainingBalance: 0.0,
        status: 'PAID',
      },
    });
  }
  console.log(`Cleaned up ${otherBVPs.length} other BookingVendorPayment records.`);

  // ==========================================
  // Part 3: Rebuild VendorLedger
  // ==========================================
  console.log('Rebuilding VendorLedger...');

  // Delete all existing ledger entries for Brightsun
  await prisma.vendorLedger.deleteMany({
    where: { vendorId: '1' },
  });
  console.log('Deleted temporary/corrupted VendorLedger entries for vendorId = 1.');

  // Load the dumped ledger entries
  const dumpPath = path.join(__dirname, '../brightsun_dumped_ledger.json');
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dumped ledger file not found at: ${dumpPath}`);
  }
  const ledgerDump: DumpLedgerEntry[] = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  // 1. Process original entries from dump
  const newLedgerEntries: any[] = [];
  
  for (const entry of ledgerDump) {
    const ref = entry.bookingReference;
    
    // Skip the incorrect payment allocation of 829.80 for TT00970
    if (ref === 'TT00970' && entry.eventType === 'VENDOR_PAYMENT' && parseFloat(entry.credit) === 829.80) {
      console.log('Skipping incorrect payment allocation of 829.80 for TT00970 in ledger');
      continue;
    }
    
    // Update TT00955 invoice debit from 1384.78 to 862.88
    if (ref === 'TT00955' && entry.eventType === 'INVOICE_CREATED' && parseFloat(entry.debit) === 1384.78) {
      console.log('Updating TT00955 invoice debit to 862.88 in ledger');
      entry.debit = '862.88';
    }

    newLedgerEntries.push(entry);
  }

  // 2. Add balancing entries for historical non-statement bookings
  const historicalBalances: { [key: string]: number } = {};
  const statementRefsSet = new Set(statementRefs);
  
  for (const entry of newLedgerEntries) {
    const ref = entry.bookingReference;
    if (!ref || statementRefsSet.has(ref)) continue;
    
    const debit = parseFloat(entry.debit || '0');
    const credit = parseFloat(entry.credit || '0');
    historicalBalances[ref] = (historicalBalances[ref] || 0) + debit - credit;
  }

  for (const [ref, bal] of Object.entries(historicalBalances)) {
    if (Math.abs(bal) > 0.01) {
      if (bal > 0) {
        // Debit surplus: add a credit entry to balance to 0
        newLedgerEntries.push({
          bookingReference: ref,
          eventType: 'VENDOR_PAYMENT',
          debit: '0.00',
          credit: bal.toFixed(2),
          notes: `Reconciliation adjustment to balance historical settled booking #${ref}`,
          createdAt: '2026-07-21 11:43:00.000',
          createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
        });
      } else {
        // Credit surplus: add a debit entry to balance to 0
        newLedgerEntries.push({
          bookingReference: ref,
          eventType: 'INVOICE_CREATED',
          debit: (-bal).toFixed(2),
          credit: '0.00',
          notes: `Reconciliation adjustment to balance historical settled booking #${ref}`,
          createdAt: '2026-07-21 11:43:00.000',
          createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
        });
      }
    }
  }

  // 3. Add entries for new statement bookings or missing events
  // TT00981: Needs credit of 1054.48 (payment allocation)
  newLedgerEntries.push({
    bookingReference: 'TT00981',
    eventType: 'VENDOR_PAYMENT',
    debit: '0.00',
    credit: '1054.48',
    notes: 'Cash payment allocation from reference VP-20260709-000001 (reconciled)',
    createdAt: '2026-07-09 14:10:06.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // TT00984: Add moved flight segment debit of 2136.56
  newLedgerEntries.push({
    bookingReference: 'TT00984',
    eventType: 'INVOICE_CREATED',
    debit: '2136.56',
    credit: '0.00',
    notes: 'Flight segment vendor reassignment from Polani (reconciled)',
    createdAt: '2026-07-13 00:00:01.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // TT00846: Add moved booking debit of 1770.26
  newLedgerEntries.push({
    bookingReference: 'TT00846',
    eventType: 'INVOICE_CREATED',
    debit: '1770.26',
    credit: '0.00',
    notes: 'Flight segment vendor reassignment and price update from Polani (reconciled)',
    createdAt: '2026-07-03 13:50:23.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // TT00494: Add booking debit of 1629.18
  newLedgerEntries.push({
    bookingReference: 'TT00494',
    eventType: 'INVOICE_CREATED',
    debit: '1629.18',
    credit: '0.00',
    notes: 'Initial vendor invoice cost recorded (reconciled)',
    createdAt: '2026-07-03 13:49:51.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // TT00976: Add cash payment credit of 3252.50
  newLedgerEntries.push({
    bookingReference: 'TT00976',
    eventType: 'VENDOR_PAYMENT',
    debit: '0.00',
    credit: '3252.50',
    notes: 'Cash payment allocation (reconciled)',
    createdAt: '2026-07-04 12:00:00.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // TT00976: Add credit note credit of 320.93
  newLedgerEntries.push({
    bookingReference: 'TT00976',
    eventType: 'REVERSAL',
    debit: '0.00',
    credit: '320.93',
    notes: 'Credit Note CRN15290742 (Refund from Vendor)',
    createdAt: '2026-07-04 12:00:01.000',
    createdById: 'baf4459c-aeb3-464e-b39e-7a1b26430b59'
  });

  // 4. Sort entries chronologically
  newLedgerEntries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // 5. Look up booking IDs from database and insert sequentially
  console.log('Inserting sorted entries with recalculated running balances...');
  let runningBalance = 0.0;
  
  for (let i = 0; i < newLedgerEntries.length; i++) {
    const entry = newLedgerEntries[i];
    const debit = parseFloat(entry.debit || '0');
    const credit = parseFloat(entry.credit || '0');
    runningBalance = runningBalance + debit - credit;

    let bookingId = entry.bookingId;
    if (!bookingId && entry.bookingReference) {
      const bObj = await prisma.booking.findUnique({
        where: { bookingReference: entry.bookingReference }
      });
      bookingId = bObj ? bObj.id : null;
    }

    // Resolve identical timestamps by adding millisecond offset
    let createdAt = new Date(entry.createdAt);
    if (i > 0) {
      const prevLedger = await prisma.vendorLedger.findFirst({
        where: { vendorId: '1' },
        orderBy: { createdAt: 'desc' },
      });
      if (prevLedger && createdAt.getTime() <= prevLedger.createdAt.getTime()) {
        createdAt = new Date(prevLedger.createdAt.getTime() + 1);
      }
    }

    await prisma.vendorLedger.create({
      data: {
        vendorId: '1',
        bookingId: bookingId || null,
        bookingReference: entry.bookingReference || null,
        eventType: entry.eventType,
        debit,
        credit,
        runningBalance,
        notes: entry.notes || null,
        referenceNumber: entry.referenceNumber || null,
        createdById: entry.createdById || 'baf4459c-aeb3-464e-b39e-7a1b26430b59',
        createdAt,
      },
    });
  }

  console.log(`Reconciliation ledger build completed. Final Running Balance: £${runningBalance.toFixed(2)}`);
  console.log('Production database reconciliation executed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during reconciliation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

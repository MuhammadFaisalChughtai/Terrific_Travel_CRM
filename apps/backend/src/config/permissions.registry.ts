export interface SystemPermissionDef {
  name: string;
  module: string;
  displayName: string;
  description: string;
}

export const SYSTEM_PERMISSIONS: SystemPermissionDef[] = [
  // ── Bookings & Operations ──────────────────────────────────────────
  {
    name: 'bookings:read',
    module: 'Bookings',
    displayName: 'View All Bookings',
    description: 'Allows viewing all bookings across the entire company.',
  },
  {
    name: 'bookings:read_own',
    module: 'Bookings',
    displayName: 'View Own Bookings',
    description: 'Allows viewing only bookings registered by or assigned to the user.',
  },
  {
    name: 'bookings:create',
    module: 'Bookings',
    displayName: 'Create Bookings',
    description: 'Allows creating new bookings.',
  },
  {
    name: 'bookings:edit_any',
    module: 'Bookings',
    displayName: 'Edit Any Booking',
    description: 'Allows updating details, passengers, and services on any booking.',
  },
  {
    name: 'bookings:edit_own',
    module: 'Bookings',
    displayName: 'Edit Own Bookings',
    description: 'Allows updating details and services on own assigned bookings.',
  },
  {
    name: 'bookings:cancel',
    module: 'Bookings',
    displayName: 'Cancel Bookings',
    description: 'Allows soft-cancelling a booking.',
  },
  {
    name: 'bookings:lock',
    module: 'Bookings',
    displayName: 'Lock / Unlock Bookings',
    description: 'Allows locking or unlocking bookings to restrict editing.',
  },
  {
    name: 'bookings:adjust_price',
    module: 'Bookings',
    displayName: 'Adjust Hotel Rates (Savings)',
    description: 'Allows adjusting hotel rates for cheaper free-cancellation supplier rates.',
  },
  {
    name: 'flights:manage',
    module: 'Bookings',
    displayName: 'Manage Flights Across Bookings',
    description: 'Allows flight executives to add and edit flight services across all bookings.',
  },
  {
    name: 'issuance:manage',
    module: 'Bookings',
    displayName: 'Manage Ticket & Voucher Issuance',
    description: 'Allows issuing tickets, hotel vouchers, and closing issuance board requests.',
  },

  // ── Invoices ───────────────────────────────────────────────────────
  {
    name: 'invoices:read',
    module: 'Invoices',
    displayName: 'View Invoices',
    description: 'Allows viewing customer invoices and receipts.',
  },
  {
    name: 'invoices:edit',
    module: 'Invoices',
    displayName: 'Edit Invoices',
    description: 'Allows editing invoice line items and charges.',
  },
  {
    name: 'invoices:download',
    module: 'Invoices',
    displayName: 'Download Invoices & Vouchers',
    description: 'Allows downloading invoice and voucher PDFs.',
  },
  {
    name: 'invoices:print',
    module: 'Invoices',
    displayName: 'Print Documents',
    description: 'Allows printing invoices, tickets, and vouchers.',
  },

  // ── Payment Approvals ──────────────────────────────────────────────
  {
    name: 'payments:read',
    module: 'Payment Approvals',
    displayName: 'View Payment Approvals',
    description: 'Allows viewing pending customer payment requests and approval queues.',
  },
  {
    name: 'payments:approve',
    module: 'Payment Approvals',
    displayName: 'Approve & Reject Payment Requests',
    description: 'Allows approving or rejecting customer payments and posting ledger entries.',
  },

  // ── Agent Access & Registry ─────────────────────────────────────────
  {
    name: 'agents:read',
    module: 'Agent Access',
    displayName: 'View Agents & Timetables',
    description: 'Allows viewing agent profiles, rosters, client mappings, and timetables to assign leads.',
  },
  {
    name: 'agents:manage',
    module: 'Agent Access',
    displayName: 'Register & Edit Agents',
    description: 'Allows registering agents and updating shift timetables and commission slabs.',
  },
  {
    name: 'agents:delete',
    module: 'Agent Access',
    displayName: 'Delete Agents',
    description: 'Allows permanently deleting or removing agent profiles.',
  },

  // ── Vendors & Suppliers ────────────────────────────────────────────
  {
    name: 'vendors:read',
    module: 'Vendors',
    displayName: 'View Vendors & Balances',
    description: 'Allows viewing vendor profiles, wallet balances, and ledgers.',
  },
  {
    name: 'vendors:create',
    module: 'Vendors',
    displayName: 'Create Vendors',
    description: 'Allows registering new vendors and suppliers.',
  },
  {
    name: 'vendors:edit',
    module: 'Vendors',
    displayName: 'Edit Vendors',
    description: 'Allows updating vendor information and contact details.',
  },
  {
    name: 'vendors:delete',
    module: 'Vendors',
    displayName: 'Delete Vendors',
    description: 'Allows deactivating or deleting vendors.',
  },
  {
    name: 'vendors:pay',
    module: 'Vendors',
    displayName: 'Process Vendor Payments',
    description: 'Allows recording payments and allocating balances to vendors.',
  },
  {
    name: 'vendors:reverse',
    module: 'Vendors',
    displayName: 'Reverse Vendor Payments',
    description: 'Allows reversing posted vendor payment transactions.',
  },

  // ── Agent Margins & Profit ─────────────────────────────────────────
  {
    name: 'margins:view',
    module: 'Agent Margins',
    displayName: 'View Margin & Company Profit',
    description: 'Allows viewing agent margins, slabs, and net company profit figures.',
  },
  {
    name: 'margins:calculate',
    module: 'Agent Margins',
    displayName: 'Run Margin Calculations',
    description: 'Allows running monthly or date-range commission calculation jobs.',
  },
  {
    name: 'margins:pay',
    module: 'Agent Margins',
    displayName: 'Record Margin Payouts',
    description: 'Allows marking agent margins and additional hotel margins as paid.',
  },
  {
    name: 'margins:void',
    module: 'Agent Margins',
    displayName: 'Void / Unvoid Margin Qualification',
    description: 'Allows disqualifying or restoring a booking for agent commission.',
  },

  // ── Leads & CRM ────────────────────────────────────────────────────
  {
    name: 'leads:read',
    module: 'Leads CRM',
    displayName: 'View Leads',
    description: 'Allows viewing CRM enquiry leads.',
  },
  {
    name: 'leads:create',
    module: 'Leads CRM',
    displayName: 'Create Leads',
    description: 'Allows manually entering new sales leads.',
  },
  {
    name: 'leads:edit',
    module: 'Leads CRM',
    displayName: 'Edit & Follow Up Leads',
    description: 'Allows updating lead status, notes, and assigning agents.',
  },
  {
    name: 'leads:delete',
    module: 'Leads CRM',
    displayName: 'Delete Leads',
    description: 'Allows deleting CRM leads.',
  },

  // ── Attendance & HR ────────────────────────────────────────────────
  {
    name: 'attendance:read',
    module: 'Attendance & HR',
    displayName: 'View Staff Attendance',
    description: 'Allows viewing staff attendance logs and hours.',
  },
  {
    name: 'attendance:log',
    module: 'Attendance & HR',
    displayName: 'Log Own Attendance',
    description: 'Allows checking in and out for daily work.',
  },
  {
    name: 'attendance:manage',
    module: 'Attendance & HR',
    displayName: 'Manage Staff Attendance & Fines',
    description: 'Allows adjusting attendance logs, issuing fines or bonuses.',
  },
  {
    name: 'payroll:read',
    module: 'Attendance & HR',
    displayName: 'View Staff Payslips',
    description: 'Allows viewing generated staff salary payslips.',
  },
  {
    name: 'payroll:manage',
    module: 'Attendance & HR',
    displayName: 'Manage & Generate Payroll',
    description: 'Allows creating, editing, and dispatching payslips by email.',
  },

  // ── Financials & Reports ───────────────────────────────────────────
  {
    name: 'ledger:read',
    module: 'Financials',
    displayName: 'View Global Financial Ledger',
    description: 'Allows viewing double-entry journal ledgers and transactions.',
  },
  {
    name: 'reports:financials',
    module: 'Financials',
    displayName: 'View Executive Financial Reports',
    description: 'Allows accessing gross profit, cash flow, and executive analytics.',
  },
  {
    name: 'reports:agent_performance',
    module: 'Financials',
    displayName: 'View Agent Performance Analytics',
    description: 'Allows viewing sales volume and performance summaries by agent.',
  },

  // ── Security, DLP & Workstations ───────────────────────────────────
  {
    name: 'security:audit',
    module: 'Security & DLP',
    displayName: 'View Security Audit & DLP Logs',
    description: 'Allows viewing clipboard DLP logs, audit trails, and workstation heartbeats.',
  },

  // ── Catalog & Inventory ────────────────────────────────────────────
  {
    name: 'catalog:manage',
    module: 'Catalog & Inventory',
    displayName: 'Manage Catalog & Inventory',
    description: 'Allows updating airline catalogs, hotel inventory, and tour packages.',
  },

  // ── System Administration ──────────────────────────────────────────
  {
    name: 'users:read',
    module: 'Administration',
    displayName: 'View Staff Operators',
    description: 'Allows viewing system users, staff profiles, and roles.',
  },
  {
    name: 'users:manage',
    module: 'Administration',
    displayName: 'Manage Staff Accounts',
    description: 'Allows creating, updating, resetting passwords, and deactivating users.',
  },
  {
    name: 'roles:manage',
    module: 'Administration',
    displayName: 'Manage Custom Roles & Permissions',
    description: 'Allows creating custom roles and configuring the permission matrix.',
  },
  {
    name: 'settings:manage',
    module: 'Administration',
    displayName: 'Manage System Configurations',
    description: 'Allows editing system settings, commission slabs, and email templates.',
  },
];

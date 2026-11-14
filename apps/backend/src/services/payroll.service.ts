import { prisma, logger } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import { emailService } from './email.service';

export class PayrollService {
  /**
   * Helper to generate a guaranteed unique payslip number like PAY-202611-0001
   */
  private async generatePayslipNumber(monthYear?: string): Promise<string> {
    const cleanDate = new Date();
    const yearMonth = `${cleanDate.getFullYear()}${String(cleanDate.getMonth() + 1).padStart(2, '0')}`;
    const prefix = `PAY-${yearMonth}-`;

    const latestSlip = await prisma.payslip.findFirst({
      where: {
        payslipNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        payslipNumber: 'desc',
      },
      select: {
        payslipNumber: true,
      },
    });

    let nextSeq = 1;
    if (latestSlip && latestSlip.payslipNumber) {
      const parts = latestSlip.payslipNumber.split('-');
      const lastSeqStr = parts[parts.length - 1];
      const parsed = parseInt(lastSeqStr, 10);
      if (!isNaN(parsed)) {
        nextSeq = parsed + 1;
      }
    }

    let candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    let exists = await prisma.payslip.findUnique({
      where: { payslipNumber: candidate },
      select: { id: true },
    });

    while (exists) {
      nextSeq++;
      candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
      exists = await prisma.payslip.findUnique({
        where: { payslipNumber: candidate },
        select: { id: true },
      });
    }

    return candidate;
  }

  /**
   * Helper to calculate totals from basic fields and custom JSON items
   */
  private calculateTotals(data: {
    basicSalary?: number;
    houseRentAllowance?: number;
    travelAllowance?: number;
    otherAllowances?: number;
    earningsJson?: any;
    taxDeduction?: number;
    fineDeduction?: number;
    otherDeductions?: number;
    deductionsJson?: any;
  }) {
    const basic = Number(data.basicSalary || 0);
    const hra = Number(data.houseRentAllowance || 0);
    const travel = Number(data.travelAllowance || 0);
    const otherEarn = Number(data.otherAllowances || 0);

    let extraEarn = 0;
    if (Array.isArray(data.earningsJson)) {
      extraEarn = data.earningsJson.reduce((sum: number, item: any) => sum + Number(item?.amount || 0), 0);
    }

    const totalEarnings = basic + hra + travel + otherEarn + extraEarn;

    const tax = Number(data.taxDeduction || 0);
    const fines = Number(data.fineDeduction || 0);
    const otherDed = Number(data.otherDeductions || 0);

    let extraDed = 0;
    if (Array.isArray(data.deductionsJson)) {
      extraDed = data.deductionsJson.reduce((sum: number, item: any) => sum + Number(item?.amount || 0), 0);
    }

    const totalDeductions = tax + fines + otherDed + extraDed;
    const netSalary = Math.max(0, totalEarnings - totalDeductions);

    return {
      basicSalary: basic,
      houseRentAllowance: hra,
      travelAllowance: travel,
      otherAllowances: otherEarn,
      taxDeduction: tax,
      fineDeduction: fines,
      otherDeductions: otherDed,
      totalEarnings,
      totalDeductions,
      netSalary,
    };
  }

  /**
   * List all payslips with filters & pagination
   */
  async getPayslips(queryParams: {
    search?: string;
    agentId?: string;
    monthYear?: string;
    status?: string;
    limit?: number | string;
    offset?: number | string;
  }) {
    const { search, agentId, monthYear, status, limit = 50, offset = 0 } = queryParams;

    const where: any = {};

    if (agentId && agentId !== 'all') {
      where.agentId = agentId;
    }

    if (monthYear && monthYear !== 'all') {
      where.monthYear = monthYear;
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { employeeName: { contains: search, mode: 'insensitive' } },
        { payslipNumber: { contains: search, mode: 'insensitive' } },
        { employeeEmail: { contains: search, mode: 'insensitive' } },
        { payrollEmail: { contains: search, mode: 'insensitive' } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.payslip.count({ where }),
      prisma.payslip.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Number(limit),
        skip: Number(offset),
        include: {
          agent: {
            select: { id: true, name: true, email: true, payrollEmail: true, phoneNumber: true },
          },
          createdBy: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
    ]);

    // Compute summary metrics
    const allSlips = await prisma.payslip.findMany({
      where: monthYear && monthYear !== 'all' ? { monthYear } : {},
      select: { totalEarnings: true, totalDeductions: true, netSalary: true, status: true },
    });

    const totalNetDisbursed = allSlips.reduce((sum: number, s: any) => sum + (s.netSalary || 0), 0);
    const totalGross = allSlips.reduce((sum: number, s: any) => sum + (s.totalEarnings || 0), 0);
    const totalDeductions = allSlips.reduce((sum: number, s: any) => sum + (s.totalDeductions || 0), 0);
    const sentCount = allSlips.filter((s: any) => s.status === 'Sent' || s.status === 'Paid').length;
    const draftCount = allSlips.filter((s: any) => s.status === 'Draft').length;

    return {
      items,
      total,
      summary: {
        totalNetDisbursed,
        totalGross,
        totalDeductions,
        totalSlips: allSlips.length,
        sentCount,
        draftCount,
      },
    };
  }

  /**
   * Get single payslip by ID
   */
  async getPayslipById(id: string) {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        agent: true,
        user: true,
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!payslip) {
      throw new NotFoundException('Salary slip not found');
    }

    return payslip;
  }

  /**
   * Parse monthYear string (e.g. "October 2026", "2026-10", "Oct 2026") into UTC Date range
   */
  parseMonthYearRange(monthYear: string): { startDate: Date; endDate: Date } | null {
    if (!monthYear || typeof monthYear !== 'string') return null;
    const trimmed = monthYear.trim();

    const months: Record<string, number> = {
      january: 0, jan: 0,
      february: 1, feb: 1,
      march: 2, mar: 2,
      april: 3, apr: 3,
      may: 4,
      june: 5, jun: 5,
      july: 6, jul: 6,
      august: 7, aug: 7,
      september: 8, sep: 8, sept: 8,
      october: 9, oct: 9,
      november: 10, nov: 10,
      december: 11, dec: 11,
    };

    const parts = trimmed.split(/[\s,/-]+/);
    let year: number | null = null;
    let monthIndex: number | null = null;

    for (const part of parts) {
      const lower = part.toLowerCase();
      if (months[lower] !== undefined) {
        monthIndex = months[lower];
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) {
          if (num >= 2000 && num <= 2100) {
            year = num;
          } else if (num >= 1 && num <= 12 && monthIndex === null) {
            monthIndex = num - 1;
          }
        }
      }
    }

    if (year !== null && monthIndex !== null) {
      const startDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999));
      return { startDate, endDate };
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const y = parsed.getUTCFullYear();
      const m = parsed.getUTCMonth();
      return {
        startDate: new Date(Date.UTC(y, m, 1, 0, 0, 0, 0)),
        endDate: new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999)),
      };
    }

    return null;
  }

  /**
   * Get agent fines for a payroll month, with currency conversion to the payslip currency
   */
  async getAgentFinesForPayroll(agentId: string, monthYear: string, targetCurrency: string = 'PKR') {
    if (!agentId) {
      throw new BadRequestException('Agent ID is required');
    }
    if (!monthYear) {
      throw new BadRequestException('Month & Year is required');
    }

    const range = this.parseMonthYearRange(monthYear);
    if (!range) {
      return {
        fines: [],
        totalFineDeduction: 0,
        count: 0,
        monthYear,
        targetCurrency,
      };
    }

    // Query non-waived fines for this agent in this date range
    const fines = await prisma.agentFine.findMany({
      where: {
        agentId,
        date: {
          gte: range.startDate,
          lte: range.endDate,
        },
        status: {
          not: 'WAIVED',
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        issuedBy: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    const CONVERSION_RATES_TO_PKR: Record<string, number> = {
      PKR: 1,
      GBP: 360,
      USD: 280,
      EUR: 305,
      SAR: 75,
      AED: 76,
    };

    const convertAmount = (amt: number, from: string, to: string) => {
      const f = (from || 'PKR').toUpperCase();
      const t = (to || 'PKR').toUpperCase();
      if (f === t) return amt;
      const rateFrom = CONVERSION_RATES_TO_PKR[f] || 1;
      const rateTo = CONVERSION_RATES_TO_PKR[t] || 1;
      const inPkr = amt * rateFrom;
      return Math.round((inPkr / rateTo) * 100) / 100;
    };

    const formattedFines = fines.map((f) => {
      const converted = convertAmount(f.amount, f.currency, targetCurrency);
      return {
        id: f.id,
        date: f.date,
        fineType: f.fineType,
        reason: f.reason,
        amount: f.amount,
        currency: f.currency,
        convertedAmount: converted,
        status: f.status,
        issuedBy: f.issuedBy,
      };
    });

    const totalFineDeduction = formattedFines.reduce((sum, f) => sum + (f.convertedAmount || 0), 0);

    return {
      fines: formattedFines,
      totalFineDeduction: Math.round(totalFineDeduction * 100) / 100,
      count: formattedFines.length,
      targetCurrency,
      monthYear,
    };
  }

  /**
   * Create a new payslip
   */
  async createPayslip(data: any, createdById?: string) {
    if (!data.employeeName) {
      throw new BadRequestException('Employee name is required');
    }
    if (!data.monthYear) {
      throw new BadRequestException('Month & Year is required');
    }

    let agent = null;
    if (data.agentId) {
      agent = await prisma.agent.findUnique({ where: { id: data.agentId } });
    }

    // Auto-check agent fines for the payroll month if fineDeduction is not explicitly provided or is 0
    if (data.agentId && data.monthYear && (data.fineDeduction === undefined || data.fineDeduction === null || Number(data.fineDeduction) === 0)) {
      try {
        const finesInfo = await this.getAgentFinesForPayroll(data.agentId, data.monthYear, data.currency || 'PKR');
        if (finesInfo.totalFineDeduction > 0) {
          logger.info(`Auto-applying ${finesInfo.count} fine(s) totaling ${finesInfo.totalFineDeduction} ${data.currency || 'PKR'} for agent ${data.agentId} (${data.monthYear})`);
          data.fineDeduction = finesInfo.totalFineDeduction;
        }
      } catch (err: any) {
        logger.warn(`Could not auto-fetch agent fines during payslip creation: ${err.message}`);
      }
    }

    let payslipNumber = data.payslipNumber ? String(data.payslipNumber).trim() : '';
    if (!payslipNumber) {
      payslipNumber = await this.generatePayslipNumber(data.monthYear);
    } else {
      const existing = await prisma.payslip.findUnique({
        where: { payslipNumber },
        select: { id: true },
      });
      if (existing) {
        payslipNumber = await this.generatePayslipNumber(data.monthYear);
      }
    }

    const totals = this.calculateTotals(data);

    let payslip: any = null;
    let attempts = 0;
    while (!payslip && attempts < 5) {
      attempts++;
      try {
        payslip = await prisma.payslip.create({
          data: {
            payslipNumber,
            agentId: data.agentId || null,
            userId: data.userId || null,
            createdById: createdById || null,
            employeeName: data.employeeName || agent?.name || 'Employee',
            designation: data.designation || 'Operations Manager',
            department: data.department || 'Operations',
            passportNumber: data.passportNumber || '',
            employeeEmail: data.employeeEmail || agent?.email || '',
            payrollEmail: data.payrollEmail || agent?.payrollEmail || agent?.email || '',
            companyName: data.companyName || 'Terrific Travel (Private) Limited',
            companyAddress: data.companyAddress || 'Plot # 78, 3 Street 6, I-10/3 Islamabad, 44000, Pakistan',
            companyPhone: data.companyPhone || '+441215291630',
            companyEmail: data.companyEmail || 'office@terrifictravel.co.uk',
            monthYear: data.monthYear,
            payDate: data.payDate ? new Date(data.payDate) : new Date(),
            paymentMethod: data.paymentMethod || 'Bank Transfer',
            currency: data.currency || 'PKR',
            currencySymbol: data.currencySymbol || 'Rs.',
            basicSalary: totals.basicSalary,
            houseRentAllowance: totals.houseRentAllowance,
            travelAllowance: totals.travelAllowance,
            otherAllowances: totals.otherAllowances,
            earningsJson: data.earningsJson || [],
            taxDeduction: totals.taxDeduction,
            fineDeduction: totals.fineDeduction,
            otherDeductions: totals.otherDeductions,
            deductionsJson: data.deductionsJson || [],
            totalEarnings: totals.totalEarnings,
            totalDeductions: totals.totalDeductions,
            netSalary: totals.netSalary,
            status: data.status || 'Draft',
            notes: data.notes || null,
          },
          include: {
            agent: true,
          },
        });
      } catch (err: any) {
        if (err.code === 'P2002' && attempts < 5) {
          logger.warn(`Collision on payslipNumber ${payslipNumber}, generating fresh number (attempt ${attempts})...`);
          payslipNumber = await this.generatePayslipNumber(data.monthYear);
        } else {
          throw err;
        }
      }
    }

    // Automatically update agent record with latest payrollEmail for future payslips
    if (data.agentId && data.payrollEmail) {
      await prisma.agent.update({
        where: { id: data.agentId },
        data: { payrollEmail: data.payrollEmail },
      }).catch((err) => {
        logger.warn(`Could not update agent payrollEmail: ${err.message}`);
      });
    }

    // Mark the agent's fines for this month as DEDUCTED
    if (data.agentId && data.monthYear && totals.fineDeduction > 0) {
      const range = this.parseMonthYearRange(data.monthYear);
      if (range) {
        await prisma.agentFine.updateMany({
          where: {
            agentId: data.agentId,
            date: {
              gte: range.startDate,
              lte: range.endDate,
            },
            status: {
              not: 'WAIVED',
            },
          },
          data: {
            status: 'DEDUCTED',
            deductedAt: new Date(),
          },
        }).catch((err) => {
          logger.warn(`Could not mark agent fines as DEDUCTED: ${err.message}`);
        });
      }
    }

    // If autoSend is requested at creation time
    if (data.sendImmediately) {
      const emailTarget = payslip.payrollEmail || payslip.employeeEmail || agent?.payrollEmail || agent?.email;
      if (emailTarget) {
        await this.sendPayslipEmail(payslip.id, emailTarget);
      }
    }

    return payslip;
  }

  /**
   * Update an existing payslip
   */
  async updatePayslip(id: string, data: any) {
    const existing = await prisma.payslip.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Salary slip not found');
    }

    const totals = this.calculateTotals({
      basicSalary: data.basicSalary !== undefined ? data.basicSalary : existing.basicSalary,
      houseRentAllowance: data.houseRentAllowance !== undefined ? data.houseRentAllowance : existing.houseRentAllowance,
      travelAllowance: data.travelAllowance !== undefined ? data.travelAllowance : existing.travelAllowance,
      otherAllowances: data.otherAllowances !== undefined ? data.otherAllowances : existing.otherAllowances,
      earningsJson: data.earningsJson !== undefined ? data.earningsJson : (existing.earningsJson as any),
      taxDeduction: data.taxDeduction !== undefined ? data.taxDeduction : existing.taxDeduction,
      fineDeduction: data.fineDeduction !== undefined ? data.fineDeduction : existing.fineDeduction,
      otherDeductions: data.otherDeductions !== undefined ? data.otherDeductions : existing.otherDeductions,
      deductionsJson: data.deductionsJson !== undefined ? data.deductionsJson : (existing.deductionsJson as any),
    });

    const updated = await prisma.payslip.update({
      where: { id },
      data: {
        employeeName: data.employeeName !== undefined ? data.employeeName : existing.employeeName,
        designation: data.designation !== undefined ? data.designation : existing.designation,
        department: data.department !== undefined ? data.department : existing.department,
        passportNumber: data.passportNumber !== undefined ? data.passportNumber : existing.passportNumber,
        employeeEmail: data.employeeEmail !== undefined ? data.employeeEmail : existing.employeeEmail,
        payrollEmail: data.payrollEmail !== undefined ? data.payrollEmail : existing.payrollEmail,
        companyName: data.companyName !== undefined ? data.companyName : existing.companyName,
        companyAddress: data.companyAddress !== undefined ? data.companyAddress : existing.companyAddress,
        companyPhone: data.companyPhone !== undefined ? data.companyPhone : (existing as any).companyPhone,
        companyEmail: data.companyEmail !== undefined ? data.companyEmail : (existing as any).companyEmail,
        monthYear: data.monthYear !== undefined ? data.monthYear : existing.monthYear,
        payDate: data.payDate ? new Date(data.payDate) : existing.payDate,
        paymentMethod: data.paymentMethod !== undefined ? data.paymentMethod : existing.paymentMethod,
        currency: data.currency !== undefined ? data.currency : existing.currency,
        currencySymbol: data.currencySymbol !== undefined ? data.currencySymbol : existing.currencySymbol,
        basicSalary: totals.basicSalary,
        houseRentAllowance: totals.houseRentAllowance,
        travelAllowance: totals.travelAllowance,
        otherAllowances: totals.otherAllowances,
        earningsJson: data.earningsJson !== undefined ? data.earningsJson : (existing.earningsJson as any),
        taxDeduction: totals.taxDeduction,
        fineDeduction: totals.fineDeduction,
        otherDeductions: totals.otherDeductions,
        deductionsJson: data.deductionsJson !== undefined ? data.deductionsJson : (existing.deductionsJson as any),
        totalEarnings: totals.totalEarnings,
        totalDeductions: totals.totalDeductions,
        netSalary: totals.netSalary,
        status: data.status !== undefined ? data.status : existing.status,
        notes: data.notes !== undefined ? data.notes : existing.notes,
      },
      include: {
        agent: true,
      },
    });

    // Update agent's payrollEmail if linked
    const targetAgentId = data.agentId || existing.agentId;
    if (targetAgentId && data.payrollEmail) {
      await prisma.agent.update({
        where: { id: targetAgentId },
        data: { payrollEmail: data.payrollEmail },
      }).catch((err) => {
        logger.warn(`Could not update agent payrollEmail: ${err.message}`);
      });
    }

    return updated;
  }

  /**
   * Delete payslip
   */
  async deletePayslip(id: string) {
    const existing = await prisma.payslip.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Salary slip not found');
    }

    // Revert deducted fines back to PENDING if deleting payslip
    if (existing.agentId && existing.monthYear && existing.fineDeduction > 0) {
      const range = this.parseMonthYearRange(existing.monthYear);
      if (range) {
        await prisma.agentFine.updateMany({
          where: {
            agentId: existing.agentId,
            date: {
              gte: range.startDate,
              lte: range.endDate,
            },
            status: 'DEDUCTED',
          },
          data: {
            status: 'PENDING',
            deductedAt: null,
          },
        }).catch((err) => {
          logger.warn(`Could not revert agent fines on payslip deletion: ${err.message}`);
        });
      }
    }

    await prisma.payslip.delete({ where: { id } });
    return { success: true, message: 'Salary slip deleted successfully' };
  }

  /**
   * Send salary slip directly to agent/employee via SMTP
   */
  async sendPayslipEmail(id: string, overrideEmail?: string, pdfBase64?: string) {
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: { agent: true },
    });

    if (!payslip) {
      throw new NotFoundException('Salary slip not found');
    }

    const recipientEmail =
      overrideEmail ||
      payslip.payrollEmail ||
      payslip.employeeEmail ||
      payslip.agent?.payrollEmail ||
      payslip.agent?.email;

    if (!recipientEmail || !recipientEmail.includes('@')) {
      throw new BadRequestException('No valid recipient or payroll email address found for this salary slip');
    }

    const emailResult = await emailService.sendSalarySlipEmail({
      toEmail: recipientEmail,
      employeeName: payslip.employeeName,
      payslipNumber: payslip.payslipNumber,
      monthYear: payslip.monthYear,
      payDate: payslip.payDate,
      paymentMethod: payslip.paymentMethod,
      designation: payslip.designation,
      department: payslip.department,
      companyName: payslip.companyName,
      companyAddress: payslip.companyAddress,
      companyPhone: (payslip as any).companyPhone,
      companyEmail: (payslip as any).companyEmail,
      currency: payslip.currency,
      currencySymbol: payslip.currencySymbol,
      basicSalary: payslip.basicSalary,
      houseRentAllowance: payslip.houseRentAllowance,
      travelAllowance: payslip.travelAllowance,
      otherAllowances: payslip.otherAllowances,
      earningsJson: payslip.earningsJson as any,
      taxDeduction: payslip.taxDeduction,
      fineDeduction: payslip.fineDeduction,
      otherDeductions: payslip.otherDeductions,
      deductionsJson: payslip.deductionsJson as any,
      totalEarnings: payslip.totalEarnings,
      totalDeductions: payslip.totalDeductions,
      netSalary: payslip.netSalary,
      notes: payslip.notes,
      pdfBase64: pdfBase64 || null,
    });

    if (!emailResult.success) {
      throw new BadRequestException('Failed to dispatch salary slip email via SMTP: ' + JSON.stringify(emailResult));
    }

    // Update payslip status to 'Sent' and record timestamp & sent email
    const updated = await prisma.payslip.update({
      where: { id },
      data: {
        status: 'Sent',
        sentToEmail: recipientEmail,
        sentAt: new Date(),
      },
      include: { agent: true },
    });

    return {
      success: true,
      message: `Salary slip email sent successfully to ${recipientEmail}`,
      payslip: updated,
    };
  }

  /**
   * Get all payslips for a specific agent
   */
  async getAgentPayslips(agentId: string) {
    const items = await prisma.payslip.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return items;
  }
}

export const payrollService = new PayrollService();

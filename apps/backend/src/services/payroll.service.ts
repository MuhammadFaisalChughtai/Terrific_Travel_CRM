import { prisma, logger } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import { emailService } from './email.service';

export class PayrollService {
  /**
   * Helper to generate a unique payslip number like PAY-202606-0001
   */
  private async generatePayslipNumber(monthYear: string): Promise<string> {
    const cleanDate = new Date();
    const yearMonth = `${cleanDate.getFullYear()}${String(cleanDate.getMonth() + 1).padStart(2, '0')}`;
    const count = await prisma.payslip.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `PAY-${yearMonth}-${sequence}`;
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

    const payslipNumber = data.payslipNumber || (await this.generatePayslipNumber(data.monthYear));

    const totals = this.calculateTotals(data);

    const payslip = await prisma.payslip.create({
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

    await prisma.payslip.delete({ where: { id } });
    return { success: true, message: 'Salary slip deleted successfully' };
  }

  /**
   * Send salary slip directly to agent/employee via SMTP
   */
  async sendPayslipEmail(id: string, overrideEmail?: string) {
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
      passportNumber: payslip.passportNumber,
      department: payslip.department,
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

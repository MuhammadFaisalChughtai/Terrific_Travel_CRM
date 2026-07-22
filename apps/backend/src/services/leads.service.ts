import { prisma } from '../config';
import { BadRequestException, ForbiddenException, NotFoundException } from '../middleware/error.middleware';
import { LeadStatus } from '@prisma/client';

export interface GetLeadsQueryParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
  status?: string;
  assignedAgentId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class LeadsService {
  private selectUser = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    agentId: true,
  };

  private statusLogsInclude = {
    orderBy: { createdAt: 'desc' as const },
    include: {
      createdBy: { select: this.selectUser },
    },
  };

  async getLeads(query: GetLeadsQueryParams) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const andConditions: any[] = [];

    // Search filter across fullName, phoneNumber, notes, statusLogs, and assignedAgent name
    if (query.search && query.search.trim()) {
      const search = query.search.trim();
      andConditions.push({
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
          { assignedAgent: { firstName: { contains: search, mode: 'insensitive' } } },
          { assignedAgent: { lastName: { contains: search, mode: 'insensitive' } } },
          { statusLogs: { some: { notes: { contains: search, mode: 'insensitive' } } } },
        ],
      });
    }

    // Status filter
    if (query.status && query.status.trim()) {
      const statusUpper = query.status.trim().toUpperCase();
      if (Object.values(LeadStatus).includes(statusUpper as LeadStatus)) {
        andConditions.push({ status: statusUpper as LeadStatus });
      }
    }

    // Assigned Agent filter (matches User ID or linked Agent ID)
    if (query.assignedAgentId && query.assignedAgentId.trim()) {
      const agentVal = query.assignedAgentId.trim();
      if (agentVal === 'UNASSIGNED') {
        andConditions.push({ assignedAgentId: null });
      } else {
        andConditions.push({
          OR: [
            { assignedAgentId: agentVal },
            { assignedAgent: { id: agentVal } },
            { assignedAgent: { agentId: agentVal } },
          ],
        });
      }
    }

    // Date range filter on createdAt
    if (query.startDate || query.endDate) {
      const dateFilter: any = {};
      if (query.startDate) {
        dateFilter.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
      }
      andConditions.push({ createdAt: dateFilter });
    }

    const where: any = andConditions.length > 0 ? { AND: andConditions } : {};

    // Sorting
    const sortOrder: 'asc' | 'desc' = query.sortOrder === 'asc' ? 'asc' : 'desc';
    let orderBy: any = { createdAt: 'desc' };

    if (query.sortBy) {
      switch (query.sortBy) {
        case 'fullName':
        case 'name':
          orderBy = { fullName: sortOrder };
          break;
        case 'createdAt':
          orderBy = { createdAt: sortOrder };
          break;
        case 'updatedAt':
          orderBy = { updatedAt: sortOrder };
          break;
        case 'assignedAgent':
          orderBy = { assignedAgent: { firstName: sortOrder } };
          break;
        default:
          orderBy = { createdAt: 'desc' };
          break;
      }
    }

    const [total, data] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          assignedAgent: { select: this.selectUser },
          createdBy: { select: this.selectUser },
          updatedBy: { select: this.selectUser },
          statusLogs: this.statusLogsInclude,
        },
      }),
    ]);

    // Synthesize fallback log for leads created before statusLogs existed
    data.forEach((lead: any) => {
      if ((!lead.statusLogs || lead.statusLogs.length === 0) && lead.notes) {
        lead.statusLogs = [
          {
            id: `legacy-${lead.id}`,
            leadId: lead.id,
            status: lead.status,
            notes: `Initial lead record created. Note: "${lead.notes}"`,
            createdById: lead.createdById,
            createdBy: lead.createdBy || lead.updatedBy || null,
            createdAt: lead.createdAt,
          },
        ];
      }
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getLeadById(id: string) {
    const lead: any = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedAgent: { select: this.selectUser },
        createdBy: { select: this.selectUser },
        updatedBy: { select: this.selectUser },
        statusLogs: this.statusLogsInclude,
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID "${id}" was not found.`);
    }

    // Synthesize fallback log for leads created before statusLogs existed
    if ((!lead.statusLogs || lead.statusLogs.length === 0) && lead.notes) {
      lead.statusLogs = [
        {
          id: `legacy-${lead.id}`,
          leadId: lead.id,
          status: lead.status,
          notes: `Initial lead record created. Note: "${lead.notes}"`,
          createdById: lead.createdById,
          createdBy: lead.createdBy || lead.updatedBy || null,
          createdAt: lead.createdAt,
        },
      ];
    }

    return lead;
  }

  async createLead(data: any, currentUserId?: string) {
    if (!data.fullName || !data.fullName.trim()) {
      throw new BadRequestException('Lead full name is required.');
    }
    if (!data.phoneNumber || !data.phoneNumber.trim()) {
      throw new BadRequestException('Lead phone number is required.');
    }

    let status: LeadStatus = LeadStatus.NEW;
    if (data.status) {
      const statusUpper = data.status.toString().toUpperCase();
      if (Object.values(LeadStatus).includes(statusUpper as LeadStatus)) {
        status = statusUpper as LeadStatus;
      }
    }

    const initialNote = data.notes && data.notes.trim() !== ''
      ? `Lead created with status: ${status}. Initial Note: "${data.notes.trim()}"`
      : `Lead created with status: ${status}.`;

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        notes: data.notes ? data.notes.trim() : null,
        status,
        assignedAgentId: data.assignedAgentId && data.assignedAgentId.trim() ? data.assignedAgentId.trim() : null,
        createdById: currentUserId || null,
        updatedById: currentUserId || null,
        statusLogs: {
          create: {
            status,
            notes: initialNote,
            createdById: currentUserId || null,
          },
        },
      },
      include: {
        assignedAgent: { select: this.selectUser },
        createdBy: { select: this.selectUser },
        updatedBy: { select: this.selectUser },
        statusLogs: this.statusLogsInclude,
      },
    });

    return lead;
  }

  async updateLead(id: string, data: any, currentUserId?: string) {
    const existing = await prisma.lead.findUnique({
      where: { id },
      include: { assignedAgent: { select: this.selectUser } },
    });
    if (!existing) {
      throw new NotFoundException(`Lead with ID "${id}" was not found.`);
    }

    const changes: string[] = [];
    const updateData: any = {
      updatedById: currentUserId || null,
    };

    if (data.fullName !== undefined && data.fullName.trim() !== existing.fullName) {
      if (!data.fullName || !data.fullName.trim()) {
        throw new BadRequestException('Lead full name cannot be empty.');
      }
      changes.push(`Name changed from "${existing.fullName}" to "${data.fullName.trim()}"`);
      updateData.fullName = data.fullName.trim();
    }

    if (data.phoneNumber !== undefined && data.phoneNumber.trim() !== existing.phoneNumber) {
      if (!data.phoneNumber || !data.phoneNumber.trim()) {
        throw new BadRequestException('Lead phone number cannot be empty.');
      }
      changes.push(`Phone changed from "${existing.phoneNumber}" to "${data.phoneNumber.trim()}"`);
      updateData.phoneNumber = data.phoneNumber.trim();
    }

    if (data.status !== undefined) {
      const statusUpper = data.status.toString().toUpperCase();
      if (Object.values(LeadStatus).includes(statusUpper as LeadStatus) && statusUpper !== existing.status) {
        changes.push(`Status changed from ${existing.status} to ${statusUpper}`);
        updateData.status = statusUpper as LeadStatus;
      }
    }

    const newAgentId = data.assignedAgentId && data.assignedAgentId.trim() !== "UNASSIGNED" ? data.assignedAgentId.trim() : null;
    if (data.assignedAgentId !== undefined && newAgentId !== existing.assignedAgentId) {
      let oldAgentName = existing.assignedAgent ? `${existing.assignedAgent.firstName} ${existing.assignedAgent.lastName}` : "Unassigned";
      let newAgentName = "Unassigned";
      if (newAgentId) {
        const newAgentUser = await prisma.user.findUnique({ where: { id: newAgentId } });
        if (newAgentUser) newAgentName = `${newAgentUser.firstName} ${newAgentUser.lastName}`;
      }
      changes.push(`Agent reassigned from ${oldAgentName} to ${newAgentName}`);
      updateData.assignedAgentId = newAgentId;
    }

    if (data.notes !== undefined) {
      const trimmedNotes = data.notes ? data.notes.trim() : '';
      updateData.notes = trimmedNotes !== '' ? trimmedNotes : null;
      if (trimmedNotes !== '') {
        changes.push(`Activity Note: "${trimmedNotes}"`);
      }
    }

    await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    // Create detailed audit log entry
    const logStatus = updateData.status || existing.status;
    const logDetails = changes.length > 0
      ? changes.join(' • ')
      : `Lead information updated. Status: ${logStatus}`;

    await prisma.leadStatusLog.create({
      data: {
        leadId: id,
        status: logStatus,
        notes: logDetails,
        createdById: currentUserId || null,
      },
    });

    return this.getLeadById(id);
  }

  async deleteLead(id: string, userRoles: string[] = []) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Lead with ID "${id}" was not found.`);
    }

    // Role check: Only ADMIN / SUPER_ADMIN can delete leads
    const isAdmin = userRoles.some(
      (r) =>
        r.toUpperCase() === 'ADMIN' ||
        r.toUpperCase() === 'SUPER_ADMIN' ||
        r.toUpperCase() === 'SUPERADMIN'
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only Administrators are authorized to delete leads.');
    }

    await prisma.lead.delete({
      where: { id },
    });

    return { success: true, message: `Lead "${existing.fullName}" deleted successfully.` };
  }
}

export const leadsService = new LeadsService();

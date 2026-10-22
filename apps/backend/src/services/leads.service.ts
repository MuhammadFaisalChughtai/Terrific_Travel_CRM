import { prisma, redis, logger, config } from '../config';
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

    const isFollowUp = status === LeadStatus.FOLLOW_UP || status === LeadStatus.CALL_BACK;
    const nextFollowUpAt = isFollowUp && data.nextFollowUpAt ? new Date(data.nextFollowUpAt) : null;

    const initialNote = data.notes && data.notes.trim() !== ''
      ? `Lead created with status: ${status}. Initial Note: "${data.notes.trim()}"` + (nextFollowUpAt ? ` (Follow-up scheduled for ${nextFollowUpAt.toLocaleString("en-GB")})` : '')
      : `Lead created with status: ${status}.` + (nextFollowUpAt ? ` (Follow-up scheduled for ${nextFollowUpAt.toLocaleString("en-GB")})` : '');

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        notes: data.notes ? data.notes.trim() : null,
        status,
        assignedAgentId: data.assignedAgentId && data.assignedAgentId.trim() ? data.assignedAgentId.trim() : null,
        nextFollowUpAt,
        followUpReminderSent: false,
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

    const targetStatus = updateData.status || existing.status;
    const isFollowUpStatus = targetStatus === LeadStatus.FOLLOW_UP || targetStatus === LeadStatus.CALL_BACK;

    if (isFollowUpStatus) {
      if (data.nextFollowUpAt) {
        const parsedDate = new Date(data.nextFollowUpAt);
        updateData.nextFollowUpAt = parsedDate;
        updateData.followUpReminderSent = false;
        changes.push(`Follow-up scheduled for ${parsedDate.toLocaleString("en-GB")}`);
      }
    } else {
      updateData.nextFollowUpAt = null;
      updateData.followUpReminderSent = false;
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

  async processInboundWebhookLead(payload: any) {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Invalid lead payload received.');
    }

    // Direct Meta Webhook format: { object: 'page', entry: [ { changes: [ { field: 'leadgen', value: { leadgen_id } } ] } ] }
    if (payload.object === 'page' && Array.isArray(payload.entry)) {
      const results: any[] = [];
      for (const entry of payload.entry) {
        if (!Array.isArray(entry.changes)) continue;
        for (const change of entry.changes) {
          if (change.field === 'leadgen' && change.value) {
            const val = change.value;
            const leadgenId = val.leadgen_id;
            const formId = val.form_id;
            const pageId = val.page_id;
            const adId = val.ad_id;

            let leadPayload: any = {
              metaLeadId: leadgenId,
              platform: 'Meta Lead Ads',
              notes: `Meta Lead ID: ${leadgenId}${formId ? `\nForm ID: ${formId}` : ''}${pageId ? `\nPage ID: ${pageId}` : ''}${adId ? `\nAd ID: ${adId}` : ''}`,
            };

            // If a Meta Page Access Token is configured, automatically fetch full contact details from Graph API
            if (config.metaPageAccessToken && leadgenId) {
              try {
                const graphUrl = `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${config.metaPageAccessToken}`;
                const resp = await fetch(graphUrl);
                if (resp.ok) {
                  const graphData: any = await resp.json();
                  leadPayload = {
                    ...leadPayload,
                    ...graphData,
                    metaLeadId: leadgenId,
                  };
                } else {
                  const errText = await resp.text();
                  logger.error(`[Meta Graph API Error for ${leadgenId}]: ${errText}`);
                }
              } catch (graphErr: any) {
                logger.error(`[Meta Graph API fetch failed for ${leadgenId}]: ${graphErr.message}`);
              }
            }

            const created = await this.saveInboundLead(leadPayload);
            results.push(created);
          }
        }
      }
      return results.length === 1 ? results[0] : results;
    }

    return this.saveInboundLead(payload);
  }

  private async saveInboundLead(payload: any) {
    // Extract Lead Name
    let fullName =
      payload.fullName ||
      payload.full_name ||
      payload.name ||
      [payload.firstName || payload.first_name, payload.lastName || payload.last_name].filter(Boolean).join(' ') ||
      '';

    // Extract Phone Number
    let phoneNumber =
      payload.phoneNumber ||
      payload.phone_number ||
      payload.phone ||
      payload.mobile ||
      '';

    // Extract Email
    let email = payload.email || payload.email_address || '';

    // If Meta payload sends field_data array (standard Facebook Graph API webhook format)
    if (Array.isArray(payload.field_data)) {
      for (const field of payload.field_data) {
        const fieldName = (field.name || '').toLowerCase();
        const value = Array.isArray(field.values) ? field.values.join(', ') : (field.values || '');
        if (!value) continue;

        if (!fullName && (fieldName.includes('name') || fieldName === 'full_name')) {
          fullName = value;
        } else if (!phoneNumber && (fieldName.includes('phone') || fieldName.includes('mobile'))) {
          phoneNumber = value;
        } else if (!email && fieldName.includes('email')) {
          email = value;
        }
      }
    }

    // Fallbacks
    if (!fullName.trim()) {
      fullName = email ? `Lead (${email.split('@')[0]})` : 'Meta Lead (Pending Info)';
    }
    if (!phoneNumber.trim()) {
      phoneNumber = 'Not provided';
    }

    // Build comprehensive notes from Meta campaign/ad/form metadata
    const notesParts: string[] = [];
    if (payload.notes && typeof payload.notes === 'string' && payload.notes.trim()) {
      notesParts.push(payload.notes.trim());
    }
    if (email) {
      notesParts.push(`Email: ${email.trim()}`);
    }

    const campaign = payload.campaignName || payload.campaign_name || payload.campaign;
    if (campaign) notesParts.push(`Campaign: ${campaign}`);

    const adSet = payload.adSetName || payload.adset_name || payload.adSet;
    if (adSet) notesParts.push(`Ad Set: ${adSet}`);

    const ad = payload.adName || payload.ad_name || payload.ad;
    if (ad) notesParts.push(`Ad: ${ad}`);

    const form = payload.formName || payload.form_name || payload.form;
    if (form) notesParts.push(`Form: ${form}`);

    const platform = payload.platform || 'Meta Lead Ads';
    if (platform) notesParts.push(`Platform: ${platform}`);

    const leadId = payload.metaLeadId || payload.lead_id || payload.id;
    if (leadId) notesParts.push(`Meta Lead ID: ${leadId}`);

    // Parse custom fields or any extra questions answered in the Meta form
    if (Array.isArray(payload.field_data)) {
      for (const field of payload.field_data) {
        const fieldName = (field.name || '').toLowerCase();
        if (['full_name', 'name', 'phone_number', 'phone', 'email'].includes(fieldName)) continue;
        const val = Array.isArray(field.values) ? field.values.join(', ') : (field.values || '');
        if (val) {
          notesParts.push(`${field.name}: ${val}`);
        }
      }
    } else if (payload.customFields && typeof payload.customFields === 'object') {
      for (const [k, v] of Object.entries(payload.customFields)) {
        notesParts.push(`${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`);
      }
    }

    const finalNotes = notesParts.join('\n');

    // Query active agents eligible for round-robin lead assignment
    let eligibleAgents = await prisma.user.findMany({
      where: {
        isActive: true,
        userRoles: {
          some: {
            role: {
              name: {
                in: [
                  'Agent',
                  'TRAVEL_AGENT',
                  'Travel Agent',
                  'TravelAgent',
                  'Flight Executive',
                  'Manager',
                ],
                mode: 'insensitive',
              },
            },
          },
        },
      },
      select: this.selectUser,
      orderBy: { createdAt: 'asc' },
    });

    // Fallback: If no users with specific agent roles are configured, pick from any active user
    if (eligibleAgents.length === 0) {
      eligibleAgents = await prisma.user.findMany({
        where: { isActive: true },
        select: this.selectUser,
        orderBy: { createdAt: 'asc' },
      });
    }

    // Round-robin / random distribution among active agents
    let assignedAgent: any = null;
    if (eligibleAgents.length > 0) {
      try {
        const counter = await redis.incr('tms:leads:meta_round_robin_counter');
        const agentIndex = (counter - 1) % eligibleAgents.length;
        assignedAgent = eligibleAgents[agentIndex];
      } catch (err) {
        // Fallback to random assignment if Redis is momentarily unreachable
        const randomIndex = Math.floor(Math.random() * eligibleAgents.length);
        assignedAgent = eligibleAgents[randomIndex];
      }
    }

    const logNote = assignedAgent
      ? `Lead received from ${platform} via n8n automation. Assigned to agent ${assignedAgent.firstName} ${assignedAgent.lastName} (${assignedAgent.email || assignedAgent.agentId || 'Agent'}).`
      : `Lead received from ${platform} via n8n automation. Unassigned (no active agents currently available).`;

    const lead = await prisma.lead.create({
      data: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        notes: finalNotes || null,
        status: LeadStatus.NEW,
        assignedAgentId: assignedAgent ? assignedAgent.id : null,
        createdById: assignedAgent ? assignedAgent.id : null,
        statusLogs: {
          create: {
            status: LeadStatus.NEW,
            notes: logNote,
            createdById: assignedAgent ? assignedAgent.id : null,
          },
        },
      },
      include: {
        assignedAgent: { select: this.selectUser },
        statusLogs: this.statusLogsInclude,
      },
    });

    logger.info(`[LeadWebhook] Inbound lead "${lead.fullName}" created with ID: ${lead.id}, assigned to: ${assignedAgent ? assignedAgent.email : 'None'}`);

    return lead;
  }

  async syncWebsiteLeads() {
    const websiteApiUrl = process.env.WEBSITE_ENQUIRY_URL || 'https://terrifictravel.co.uk/api/enquiry';
    const apiKey = process.env.WEBSITE_CRM_KEY || 'terrific_crm_leads_secret_2026';

    try {
      const response = await fetch(`${websiteApiUrl}?limit=100`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Website returned HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data: any = await response.json();
      const leadsList = Array.isArray(data.leads) ? data.leads : (Array.isArray(data) ? data : []);

      if (leadsList.length === 0) {
        return {
          success: true,
          syncedCount: 0,
          totalWebsiteLeads: 0,
          message: 'No leads found to sync from website.',
        };
      }

      let syncedCount = 0;
      for (const enquiry of leadsList) {
        const enquiryId = enquiry.id || enquiry._id;
        const name = (enquiry.name || enquiry.fullName || '').trim();
        const phone = (enquiry.phone || enquiry.phoneNumber || '').trim();
        const email = (enquiry.email || '').trim();

        if (!name && !phone && !email) continue;

        // Check if lead already exists in CRM
        const existing = await prisma.lead.findFirst({
          where: {
            OR: [
              ...(enquiryId ? [{ notes: { contains: `[Website ID: ${enquiryId}]` } }] : []),
              {
                AND: [
                  { fullName: name },
                  { phoneNumber: phone || 'Not provided' },
                ],
              },
            ],
          },
        });

        if (!existing) {
          const notesParts: string[] = [
            `Source: Website Enquiry (${enquiry.type || 'General'})`,
          ];
          if (enquiryId) notesParts.push(`[Website ID: ${enquiryId}]`);
          if (email) notesParts.push(`Email: ${email}`);
          if (enquiry.message) notesParts.push(`Message: ${enquiry.message}`);

          if (enquiry.tripDetails) {
            const details = typeof enquiry.tripDetails === 'string'
              ? (() => { try { return JSON.parse(enquiry.tripDetails); } catch { return enquiry.tripDetails; } })()
              : enquiry.tripDetails;

            if (typeof details === 'object' && details !== null) {
              for (const [k, v] of Object.entries(details)) {
                if (v) notesParts.push(`${k}: ${v}`);
              }
            } else if (typeof details === 'string' && details.trim()) {
              notesParts.push(`Trip Details: ${details}`);
            }
          }

          await this.processInboundWebhookLead({
            fullName: name || (email ? email.split('@')[0] : 'Website Lead'),
            phoneNumber: phone || 'Not provided',
            email,
            notes: notesParts.join('\n'),
            platform: 'Website (terrifictravel.co.uk)',
            metaLeadId: enquiryId || undefined,
          });

          syncedCount++;
        }
      }

      return {
        success: true,
        syncedCount,
        totalWebsiteLeads: leadsList.length,
        message: `Successfully synced ${syncedCount} new lead(s) from website into Leads Log Book.`,
      };
    } catch (err: any) {
      logger.error('[WebsiteSyncError]', err);
      throw new BadRequestException(`Website lead sync failed: ${err.message}`);
    }
  }

  async deleteLead(id: string, userRoles: string[] = []) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Lead with ID "${id}" was not found.`);
    }

    // Role check: Only ADMIN / SUPER_ADMIN / MANAGER can delete leads
    const canDelete = userRoles.some((r) => {
      const up = (r || '').toUpperCase().replace(/[\s_-]+/g, '');
      return ['ADMIN', 'SUPERADMIN', 'ROOT', 'ADMINISTRATOR', 'MANAGER', 'BRANCHMANAGER'].includes(up);
    });

    if (!canDelete) {
      throw new ForbiddenException('Only Administrators and Managers are authorized to delete leads.');
    }

    await prisma.lead.delete({
      where: { id },
    });

    return { success: true, message: `Lead "${existing.fullName}" deleted successfully.` };
  }
}

export const leadsService = new LeadsService();

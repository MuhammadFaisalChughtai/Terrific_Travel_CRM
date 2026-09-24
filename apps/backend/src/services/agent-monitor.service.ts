import { prisma, logger } from '../config';
import { minioService } from './minio.service';
import http from 'http';

interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
}

export interface ProductivityItem {
  id: string;
  agentId: string;
  userId: string;
  agentName: string;
  agentEmail: string;
  role: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  totalShiftMinutes: number;
  activeMinutes: number;
  idleMinutes: number;
  productivityScore: number;
}

const geoCache = new Map<string, { data: GeoLocation; expiresAt: number }>();

async function resolveGeoLocation(ip: string): Promise<GeoLocation> {
  const cleanIp = ip.replace(/^::ffff:/, '').trim();

  // Ignore private and local IPs
  if (
    !cleanIp ||
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp.startsWith('192.168.') ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('172.16.')
  ) {
    return { city: 'Local Network', country: 'United Kingdom' };
  }

  // Check cache (12 hours)
  const cached = geoCache.get(cleanIp);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({ country: 'Unknown' });
    }, 2000);

    const req = http.get(`http://ip-api.com/json/${cleanIp}?fields=status,country,regionName,city,isp`, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        clearTimeout(timer);
        try {
          const parsed = JSON.parse(raw);
          if (parsed.status === 'success') {
            const loc: GeoLocation = {
              city: parsed.city,
              region: parsed.regionName,
              country: parsed.country,
              isp: parsed.isp,
            };
            geoCache.set(cleanIp, { data: loc, expiresAt: Date.now() + 12 * 60 * 60 * 1000 });
            return resolve(loc);
          }
        } catch {
          // ignore parsing error
        }
        resolve({ country: 'Unknown' });
      });
    });

    req.on('error', () => {
      clearTimeout(timer);
      resolve({ country: 'Unknown' });
    });
  });
}

export class AgentMonitorService {
  async recordHeartbeat(params: {
    userId: string;
    machineId: string;
    hostname?: string;
    ipAddress: string;
    activeWindow?: string;
    appVersion?: string;
    isIdle?: boolean;
    activeSeconds?: number;
    idleSeconds?: number;
  }) {
    const {
      userId,
      machineId,
      hostname,
      ipAddress,
      activeWindow,
      appVersion,
      isIdle,
      activeSeconds,
      idleSeconds,
    } = params;

    const geo = await resolveGeoLocation(ipAddress);

    const heartbeat = await prisma.agentWorkstationHeartbeat.upsert({
      where: {
        userId_machineId: {
          userId,
          machineId,
        },
      },
      update: {
        hostname: hostname || undefined,
        ipAddress,
        city: geo.city || undefined,
        region: geo.region || undefined,
        country: geo.country || undefined,
        isp: geo.isp || undefined,
        activeWindow: activeWindow || undefined,
        appVersion: appVersion || undefined,
        isIdle: typeof isIdle === 'boolean' ? isIdle : false,
        activeSeconds: activeSeconds ? { increment: activeSeconds } : undefined,
        idleSeconds: idleSeconds ? { increment: idleSeconds } : undefined,
        lastPingAt: new Date(),
      },
      create: {
        userId,
        machineId,
        hostname,
        ipAddress,
        city: geo.city,
        region: geo.region,
        country: geo.country,
        isp: geo.isp,
        activeWindow,
        appVersion,
        isIdle: typeof isIdle === 'boolean' ? isIdle : false,
        activeSeconds: activeSeconds || 0,
        idleSeconds: idleSeconds || 0,
        lastPingAt: new Date(),
      },
    });

    // Check today's attendance for the user (or manager) to determine if shift is active
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, agentId: true, email: true, firstName: true, lastName: true },
    });

    let agentId = user?.agentId;
    if (!agentId && user?.email) {
      let agent = await prisma.agent.findUnique({
        where: { email: user.email },
        select: { id: true },
      });
      if (!agent) {
        const agentName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff / Manager';
        agent = await prisma.agent.create({
          data: {
            name: agentName,
            email: user.email,
            phoneNumber: 'N/A',
            gdsSystem: 'N/A',
            client: 'N/A',
            pcc: 'N/A',
            passwordHash: 'N/A',
          },
          select: { id: true },
        });
      }
      agentId = agent.id;
      await prisma.user.update({
        where: { id: userId },
        data: { agentId },
      });
    }

    let isCheckedIn = false;
    let checkInTime: Date | null = null;
    let checkOutTime: Date | null = null;

    if (agentId) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      let attendanceRecord = await prisma.attendance.findUnique({
        where: {
          agentId_date: {
            agentId,
            date: today,
          },
        },
      });

      if (!attendanceRecord) {
        // Automatically start active shift for manager/agent working on companion workstation
        attendanceRecord = await prisma.attendance.create({
          data: {
            agentId,
            date: today,
            checkInTime: new Date(),
            status: 'PRESENT',
            activeMinutes: Math.floor((heartbeat.activeSeconds || 0) / 60),
            idleMinutes: Math.floor((heartbeat.idleSeconds || 0) / 60),
          },
        });
      }

      checkInTime = attendanceRecord.checkInTime;
      checkOutTime = attendanceRecord.checkOutTime;
      // Shift is active if checked in and not checked out
      isCheckedIn = Boolean(attendanceRecord.checkInTime && !attendanceRecord.checkOutTime);

      // Accumulate activeMinutes / idleMinutes accurately from cumulative heartbeat seconds
      if (isCheckedIn) {
        const totalActiveMins = Math.floor((heartbeat.activeSeconds || 0) / 60);
        const totalIdleMins = Math.floor((heartbeat.idleSeconds || 0) / 60);

        await prisma.attendance.update({
          where: { id: attendanceRecord.id },
          data: {
            activeMinutes: Math.max(attendanceRecord.activeMinutes || 0, totalActiveMins),
            idleMinutes: Math.max(attendanceRecord.idleMinutes || 0, totalIdleMins),
          },
        });
      }
    }

    return {
      heartbeat,
      isCheckedIn: true, // Always return true so companion workstation continuous capture never halts
      checkInTime,
      checkOutTime,
    };
  }

  async recordClipboardEvent(params: {
    userId: string;
    action: string;
    textSnippet: string;
    charCount?: number;
    sourceWindow?: string;
    targetWindow?: string;
    screenshotBuffer?: Buffer;
    screenshotMimeType?: string;
    ipAddress: string;
  }) {
    const {
      userId,
      action,
      textSnippet,
      charCount,
      sourceWindow,
      targetWindow,
      screenshotBuffer,
      screenshotMimeType,
      ipAddress,
    } = params;

    let screenshotKey: string | undefined;
    let screenshotUrl: string | undefined;

    if (screenshotBuffer && screenshotBuffer.length > 0) {
      try {
        const mime = screenshotMimeType || 'image/jpeg';
        const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
        const candidateKey = `dlp-screenshots/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

        await minioService.uploadFile(
          'documents',
          candidateKey,
          screenshotBuffer,
          screenshotBuffer.length,
          mime
        );
        screenshotKey = candidateKey;
        screenshotUrl = `/agent-monitor/screenshot/${candidateKey}`;
      } catch (uploadErr) {
        logger.error('Failed to store DLP screenshot in MinIO:', uploadErr);
      }
    }

    const geo = await resolveGeoLocation(ipAddress);

    return prisma.dlpClipboardLog.create({
      data: {
        userId,
        action: action.toUpperCase(),
        textSnippet: textSnippet.slice(0, 10000), // Max 10k chars
        charCount: charCount || textSnippet.length,
        sourceWindow,
        targetWindow,
        screenshotKey,
        screenshotUrl,
        ipAddress,
        city: geo.city,
        country: geo.country,
      },
    });
  }

  async getLiveAgents() {
    const heartbeats = await prisma.agentWorkstationHeartbeat.findMany({
      orderBy: {
        lastPingAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userRoles: {
              include: {
                role: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    const now = Date.now();
    return (heartbeats as any[]).map((hb) => {
      const lastPingTime = new Date(hb.lastPingAt).getTime();
      const elapsedSeconds = Math.round((now - lastPingTime) / 1000);
      const isOnline = elapsedSeconds <= 45;

      return {
        id: hb.id,
        userId: hb.userId,
        userName: `${hb.user?.firstName || ''} ${hb.user?.lastName || ''}`.trim() || 'Unknown Agent',
        userEmail: hb.user?.email || '',
        roles: (hb.user?.userRoles || []).map((ur: any) => ur.role?.name || ''),
        machineId: hb.machineId,
        hostname: hb.hostname,
        ipAddress: hb.ipAddress,
        city: hb.city || 'Unknown',
        region: hb.region,
        country: hb.country || 'United Kingdom',
        isp: hb.isp,
        activeWindow: hb.activeWindow || 'Desktop / Idle',
        appVersion: hb.appVersion || '1.0.0',
        isIdle: Boolean(hb.isIdle),
        activeMinutes: Math.floor((hb.activeSeconds || 0) / 60),
        idleMinutes: Math.floor((hb.idleSeconds || 0) / 60),
        lastPingAt: hb.lastPingAt,
        elapsedSeconds,
        isOnline,
      };
    });
  }

  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    userId?: string;
    agentId?: string;
    action?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    let targetUserId = params.userId;
    if (!targetUserId && params.agentId) {
      let agentEmail: string | undefined;
      const agentRecord = await prisma.agent.findUnique({
        where: { id: params.agentId },
        select: { email: true },
      });
      if (agentRecord) agentEmail = agentRecord.email;

      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: params.agentId },
            { agentId: params.agentId },
            ...(agentEmail ? [{ email: { equals: agentEmail, mode: 'insensitive' as const } }] : []),
          ],
        },
        select: { id: true },
      });
      if (user) {
        targetUserId = user.id;
      }
    }

    if (targetUserId) {
      where.userId = targetUserId;
    }
    if (params.action) {
      where.action = params.action.toUpperCase();
    }
    if (params.search) {
      where.OR = [
        { textSnippet: { contains: params.search, mode: 'insensitive' } },
        { sourceWindow: { contains: params.search, mode: 'insensitive' } },
        { targetWindow: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [total, logs] = await Promise.all([
      prisma.dlpClipboardLog.count({ where }),
      prisma.dlpClipboardLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      data: logs.map((log) => ({
        id: log.id,
        userId: log.userId,
        agentName: `${log.user?.firstName || ''} ${log.user?.lastName || ''}`.trim() || 'Agent',
        agentEmail: log.user?.email,
        action: log.action,
        textSnippet: log.textSnippet,
        charCount: log.charCount,
        sourceWindow: log.sourceWindow || 'N/A',
        targetWindow: log.targetWindow || 'N/A',
        screenshotUrl: log.screenshotKey ? `/agent-monitor/screenshot/log/${log.id}` : (log.screenshotUrl || null),
        hasScreenshot: Boolean(log.screenshotKey),
        ipAddress: log.ipAddress,
        city: log.city,
        country: log.country,
        createdAt: log.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductivityReports(params: {
    startDate?: string;
    endDate?: string;
    agentId?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    let targetAgentId = params.agentId;
    let targetUserId = params.userId;

    if (!targetAgentId && targetUserId) {
      const user = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { agentId: true },
      });
      if (user?.agentId) {
        targetAgentId = user.agentId;
      }
    } else if (targetAgentId && !targetUserId) {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: targetAgentId }, { agentId: targetAgentId }] },
        select: { id: true },
      });
      if (user) {
        targetUserId = user.id;
      }
    }

    if (targetAgentId) where.agentId = targetAgentId;
    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = new Date(params.startDate);
      if (params.endDate) where.date.lte = new Date(params.endDate);
    }

    const [records, heartbeats, allAgents, allUsers] = await Promise.all([
      prisma.attendance.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.agentWorkstationHeartbeat.findMany({
        include: {
          user: {
            select: {
              id: true,
              agentId: true,
              email: true,
              firstName: true,
              lastName: true,
              userRoles: {
                include: {
                  role: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
      prisma.agent.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          users: {
            select: {
              id: true,
              userRoles: {
                include: { role: { select: { name: true } } },
              },
            },
          },
        },
      }),
      prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          agentId: true,
          firstName: true,
          lastName: true,
          email: true,
          userRoles: {
            include: { role: { select: { name: true } } },
          },
        },
      }),
    ]);

    const heartbeatMap = new Map<string, any>();
    for (const hb of heartbeats) {
      if (hb.userId) heartbeatMap.set(hb.userId, hb);
      if (hb.user?.agentId) heartbeatMap.set(hb.user.agentId, hb);
      if (hb.user?.email) heartbeatMap.set(hb.user.email.toLowerCase(), hb);
    }

    // Build unified active staff catalog (Agents & Managers)
    interface StaffInfo {
      id: string;
      agentId: string;
      userId: string;
      name: string;
      email: string;
      role: string;
    }
    const staffMap = new Map<string, StaffInfo>();

    for (const u of allUsers) {
      const roles = (u.userRoles || []).map((ur) => ur.role?.name || '');
      const primaryRole =
        roles.find((r) => /manager/i.test(r)) ||
        roles.find((r) => /admin/i.test(r)) ||
        roles[0] ||
        'Agent';

      const key = (u.email || u.id).toLowerCase();
      staffMap.set(key, {
        id: u.id,
        agentId: u.agentId || u.id,
        userId: u.id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Staff Member',
        email: u.email,
        role: primaryRole,
      });
    }

    for (const a of allAgents) {
      const key = (a.email || a.id).toLowerCase();
      const existing = staffMap.get(key);
      const user = a.users?.[0];
      const roles = (user?.userRoles || []).map((ur) => ur.role?.name || '');
      const primaryRole =
        existing?.role ||
        roles.find((r) => /manager/i.test(r)) ||
        roles.find((r) => /admin/i.test(r)) ||
        roles[0] ||
        'Agent';

      staffMap.set(key, {
        id: a.id,
        agentId: a.id,
        userId: user?.id || existing?.userId || a.id,
        name: a.name || existing?.name || 'Staff Member',
        email: a.email,
        role: primaryRole,
      });
    }

    const recordedStaffEmailKeys = new Set<string>();

    const attendedItems: ProductivityItem[] = records.map((rec) => {
      let totalShiftMinutes = 0;
      if (rec.checkInTime) {
        const end = rec.checkOutTime ? new Date(rec.checkOutTime) : new Date();
        const start = new Date(rec.checkInTime);
        totalShiftMinutes = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
      }

      let activeMinutes = rec.activeMinutes || 0;
      let idleMinutes = rec.idleMinutes || 0;

      const emailKey = (rec.agent?.email || '').toLowerCase();
      if (emailKey) recordedStaffEmailKeys.add(emailKey);

      const staff = staffMap.get(emailKey);
      const hb = heartbeatMap.get(rec.agentId) || (emailKey ? heartbeatMap.get(emailKey) : null);
      if (hb) {
        const hbActiveMins = Math.floor((hb.activeSeconds || 0) / 60);
        const hbIdleMins = Math.floor((hb.idleSeconds || 0) / 60);
        activeMinutes = Math.max(activeMinutes, hbActiveMins);
        idleMinutes = Math.max(idleMinutes, hbIdleMins);
      }

      // If activeMinutes and idleMinutes are still 0 but user has an active shift:
      if (activeMinutes === 0 && idleMinutes === 0 && totalShiftMinutes > 0) {
        activeMinutes = Math.round(totalShiftMinutes * 0.85);
        idleMinutes = Math.max(0, totalShiftMinutes - activeMinutes);
      }

      const totalTracked = activeMinutes + idleMinutes;
      const productivityScore =
        totalTracked > 0 ? Math.min(100, Math.round((activeMinutes / totalTracked) * 100)) : 0;

      const roles = (hb?.user?.userRoles || []).map((ur: any) => ur.role?.name || '');
      const primaryRole =
        staff?.role ||
        roles.find((r: string) => /manager/i.test(r)) ||
        roles.find((r: string) => /admin/i.test(r)) ||
        roles[0] ||
        'Agent';

      return {
        id: rec.id,
        agentId: rec.agentId,
        userId: staff?.userId || hb?.userId || rec.agentId,
        agentName: rec.agent?.name || staff?.name || 'Agent',
        agentEmail: rec.agent?.email || staff?.email || '',
        role: primaryRole,
        date: rec.date.toISOString().split('T')[0],
        checkInTime: rec.checkInTime ? rec.checkInTime.toISOString() : null,
        checkOutTime: rec.checkOutTime ? rec.checkOutTime.toISOString() : null,
        status: rec.status,
        totalShiftMinutes,
        activeMinutes,
        idleMinutes,
        productivityScore,
      };
    });

    // Determine query date for un-checked-in staff synthesis
    const queryDateStr =
      params.startDate || params.endDate || new Date().toISOString().split('T')[0];

    const unCheckedInItems: ProductivityItem[] = [];

    // If viewing the entire team (or a specific agent who hasn't checked in yet)
    for (const [emailKey, staff] of staffMap.entries()) {
      if (targetAgentId && staff.agentId !== targetAgentId && staff.userId !== targetAgentId) {
        continue;
      }
      if (targetUserId && staff.userId !== targetUserId) {
        continue;
      }

      if (!recordedStaffEmailKeys.has(emailKey)) {
        const hb =
          heartbeatMap.get(staff.agentId) ||
          heartbeatMap.get(staff.userId) ||
          heartbeatMap.get(emailKey);

        const hbActiveMins = hb ? Math.floor((hb.activeSeconds || 0) / 60) : 0;
        const hbIdleMins = hb ? Math.floor((hb.idleSeconds || 0) / 60) : 0;
        const totalMins = hbActiveMins + hbIdleMins;
        const prodScore =
          totalMins > 0 ? Math.min(100, Math.round((hbActiveMins / totalMins) * 100)) : 0;

        unCheckedInItems.push({
          id: hb?.id || `unregistered-${staff.agentId || staff.userId}-${queryDateStr}`,
          agentId: staff.agentId,
          userId: staff.userId,
          agentName: staff.name,
          agentEmail: staff.email,
          role: staff.role,
          date: queryDateStr,
          checkInTime: null,
          checkOutTime: null,
          status: totalMins > 0 ? 'PRESENT' : 'NOT_CHECKED_IN',
          totalShiftMinutes: totalMins,
          activeMinutes: hbActiveMins,
          idleMinutes: hbIdleMins,
          productivityScore: prodScore,
        });
      }
    }

    // Merge all records and sort nicely:
    // 1. Actively working staff (checked in or with PC active minutes) first
    // 2. Managers and Admins first
    // 3. Alphabetical by name
    const allCombined = [...attendedItems, ...unCheckedInItems].sort((a, b) => {
      const aActive = (a.activeMinutes || 0) > 0 || Boolean(a.checkInTime);
      const bActive = (b.activeMinutes || 0) > 0 || Boolean(b.checkInTime);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      const aMgr = /manager|admin/i.test(a.role || '');
      const bMgr = /manager|admin/i.test(b.role || '');
      if (aMgr && !bMgr) return -1;
      if (!aMgr && bMgr) return 1;

      return a.agentName.localeCompare(b.agentName);
    });

    const total = allCombined.length;
    const paginatedData = allCombined.slice(skip, skip + limit);

    return {
      data: paginatedData,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async isUserCompanionActive(userId: string): Promise<boolean> {
    const latest = await prisma.agentWorkstationHeartbeat.findFirst({
      where: { userId },
      orderBy: { lastPingAt: 'desc' },
      select: { lastPingAt: true },
    });

    if (!latest) return false;
    const elapsedMs = Date.now() - new Date(latest.lastPingAt).getTime();
    return elapsedMs <= 45000; // 45 seconds
  }
}

export const agentMonitorService = new AgentMonitorService();

import { prisma, logger } from '../config';
import { minioService } from './minio.service';
import http from 'http';

interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
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

    // Check today's attendance for the user to determine if shift is active
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { agentId: true },
    });

    let isCheckedIn = false;
    let checkInTime: Date | null = null;
    let checkOutTime: Date | null = null;

    if (user?.agentId) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const attendanceRecord = await prisma.attendance.findUnique({
        where: {
          agentId_date: {
            agentId: user.agentId,
            date: today,
          },
        },
      });

      if (attendanceRecord) {
        checkInTime = attendanceRecord.checkInTime;
        checkOutTime = attendanceRecord.checkOutTime;
        // Shift is active if checked in and not checked out
        isCheckedIn = Boolean(attendanceRecord.checkInTime && !attendanceRecord.checkOutTime);

        // If shift is active, accumulate activeMinutes / idleMinutes
        if (isCheckedIn && ((activeSeconds || 0) > 0 || (idleSeconds || 0) > 0)) {
          const addActiveMins = Math.round((activeSeconds || 0) / 60);
          const addIdleMins = Math.round((idleSeconds || 0) / 60);
          if (addActiveMins > 0 || addIdleMins > 0) {
            await prisma.attendance.update({
              where: { id: attendanceRecord.id },
              data: {
                activeMinutes: { increment: addActiveMins },
                idleMinutes: { increment: addIdleMins },
              },
            });
          }
        }
      }
    }

    return {
      heartbeat,
      isCheckedIn,
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
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ id: params.agentId }, { agentId: params.agentId }],
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
    if (!targetAgentId && params.userId) {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { agentId: true },
      });
      if (user?.agentId) {
        targetAgentId = user.agentId;
      }
    }

    if (targetAgentId) where.agentId = targetAgentId;
    if (params.startDate || params.endDate) {
      where.date = {};
      if (params.startDate) where.date.gte = new Date(params.startDate);
      if (params.endDate) where.date.lte = new Date(params.endDate);
    }

    const [total, records] = await Promise.all([
      prisma.attendance.count({ where }),
      prisma.attendance.findMany({
        where,
        skip,
        take: limit,
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
    ]);

    const data = records.map((rec) => {
      let totalShiftMinutes = 0;
      if (rec.checkInTime) {
        const end = rec.checkOutTime ? new Date(rec.checkOutTime) : new Date();
        const start = new Date(rec.checkInTime);
        totalShiftMinutes = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
      }

      const activeMinutes = rec.activeMinutes || 0;
      const idleMinutes = rec.idleMinutes || 0;
      const totalTracked = activeMinutes + idleMinutes;
      const productivityScore =
        totalTracked > 0 ? Math.min(100, Math.round((activeMinutes / totalTracked) * 100)) : 0;

      return {
        id: rec.id,
        agentId: rec.agentId,
        agentName: rec.agent?.name || 'Agent',
        agentEmail: rec.agent?.email || '',
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

    return {
      data,
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

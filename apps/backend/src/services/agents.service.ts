import { prisma } from '../config';
import { BadRequestException, NotFoundException } from '../middleware/error.middleware';
import * as bcrypt from 'bcrypt';

export class AgentsService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 100;
    const offset = Number(query.offset) || 0;

    const [total, items] = await Promise.all([
      prisma.agent.count(),
      prisma.agent.findMany({
        take: limit,
        skip: offset,
        include: {
          slabs: {
            orderBy: { minSales: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, limit, offset, items };
  }

  async findOne(id: string) {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        slabs: {
          orderBy: { minSales: 'asc' },
        },
      },
    });
    if (!agent) throw new NotFoundException('Agent not found');
    return agent;
  }

  async create(data: any) {
    const passwordHash = await bcrypt.hash(data.password || 'agent123', 10);
    
    const slabsList = data.slabs && Array.isArray(data.slabs) ? data.slabs : [
      { minSales: 1000, maxSales: 2000, commissionRate: 5 },
      { minSales: 2001, maxSales: 3000, commissionRate: 6 },
      { minSales: 3001, maxSales: 4000, commissionRate: 7 },
      { minSales: 4001, maxSales: 5000, commissionRate: 8 },
      { minSales: 5001, maxSales: null, commissionRate: 10 },
    ];

    const slabsCreate = slabsList.map((s: any) => ({
      minSales: Number(s.minSales),
      maxSales: s.maxSales !== undefined && s.maxSales !== null && s.maxSales !== '' ? Number(s.maxSales) : null,
      commissionRate: Number(s.commissionRate),
    }));

    const existingAgent = await prisma.agent.findUnique({ where: { email: data.email } });
    if (existingAgent) {
      throw new BadRequestException(`An agent with the email "${data.email}" is already registered.`);
    }

    try {
      const agent = await prisma.agent.create({
        data: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          payrollEmail: data.payrollEmail || null,
          gdsSystem: data.gdsSystem,
          client: data.client,
          pcc: data.pcc,
          jobStatus: data.jobStatus || 'Active',
          passwordHash,
          walletBalance: 0.0, // Initial wallet balance defaults to 0.0, non-editable
          slabs: {
            create: slabsCreate,
          },
        },
        include: {
          slabs: {
            orderBy: { minSales: 'asc' },
          },
        },
      });
      return agent;
    } catch (err: any) {
      // Prisma unique constraint violation (P2002)
      if (err?.code === 'P2002') {
        const field = err?.meta?.target?.[0] || 'field';
        if (field === 'email') {
          throw new BadRequestException(
            `An agent with the email "${data.email}" is already registered. Please use a different email address.`
          );
        }
        throw new BadRequestException(`A unique constraint was violated on the "${field}" field.`);
      }
      throw err;
    }
  }

  async update(id: string, data: any) {
    // Ensure agent exists
    await this.findOne(id);

    const updateData: any = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      payrollEmail: data.payrollEmail !== undefined ? data.payrollEmail : undefined,
      gdsSystem: data.gdsSystem,
      client: data.client,
      pcc: data.pcc,
      jobStatus: data.jobStatus,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    try {
      const agent = await prisma.$transaction(async (tx) => {
        if (data.slabs && Array.isArray(data.slabs)) {
          // Delete all old slabs
          await tx.agentSlab.deleteMany({
            where: { agentId: id },
          });

          // Map and create new slabs
          const slabsCreate = data.slabs.map((s: any) => ({
            minSales: Number(s.minSales),
            maxSales: s.maxSales !== undefined && s.maxSales !== null && s.maxSales !== '' ? Number(s.maxSales) : null,
            commissionRate: Number(s.commissionRate),
          }));

          await tx.agentSlab.createMany({
            data: slabsCreate.map((s: any) => ({
              ...s,
              agentId: id,
            })),
          });
        }

        return tx.agent.update({
          where: { id },
          data: updateData,
          include: {
            slabs: {
              orderBy: { minSales: 'asc' },
            },
          },
        });
      });

      return agent;
    } catch (err: any) {
      // Prisma unique constraint violation (P2002)
      if (err?.code === 'P2002') {
        const field = err?.meta?.target?.[0] || 'field';
        if (field === 'email') {
          throw new BadRequestException(
            `The email "${data.email}" is already in use by another agent.`
          );
        }
        throw new BadRequestException(`A unique constraint was violated on the "${field}" field.`);
      }
      throw err;
    }
  }

  async delete(id: string) {
    // Ensure agent exists
    await this.findOne(id);

    await prisma.agent.delete({
      where: { id },
    });
    return { id, deleted: true };
  }
}

export const agentsService = new AgentsService();

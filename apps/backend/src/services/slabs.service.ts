import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';

export class SlabsService {
  async findAll() {
    return prisma.agentSlab.findMany({
      orderBy: { minSales: 'asc' },
    });
  }

  async findOne(id: string) {
    const slab = await prisma.agentSlab.findUnique({
      where: { id },
    });
    if (!slab) throw new NotFoundException('Commission slab not found');
    return slab;
  }

  async create(data: any) {
    return prisma.agentSlab.create({
      data: {
        agentId: data.agentId || '',
        minSales: Number(data.minSales),
        maxSales: data.maxSales !== undefined && data.maxSales !== null && data.maxSales !== '' ? Number(data.maxSales) : null,
        commissionRate: Number(data.commissionRate),
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);

    return prisma.agentSlab.update({
      where: { id },
      data: {
        minSales: data.minSales !== undefined ? Number(data.minSales) : undefined,
        maxSales: data.maxSales !== undefined ? (data.maxSales !== null && data.maxSales !== '' ? Number(data.maxSales) : null) : undefined,
        commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    await prisma.agentSlab.delete({
      where: { id },
    });
    return { id, deleted: true };
  }
}

export const slabsService = new SlabsService();

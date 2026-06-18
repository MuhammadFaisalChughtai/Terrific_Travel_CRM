import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';

export class VendorsService {
  async findAll(query: any) {
    const limit = Number(query.limit) || 100;
    const offset = Number(query.offset) || 0;

    const [total, items] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.findMany({
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, limit, offset, items };
  }

  async findOne(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });
    if (!vendor) throw new NotFoundException('Vendor not found');
    return vendor;
  }

  async create(data: any) {
    const vendor = await prisma.vendor.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        website: data.website || null,
        supportEmail: data.supportEmail || null,
        vendorType: data.vendorType,
        walletBalance: 0.0, // Non-editable on creation
      },
    });
    return vendor;
  }

  async update(id: string, data: any) {
    // Ensure vendor exists
    await this.findOne(id);

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        website: data.website !== undefined ? data.website : undefined,
        supportEmail: data.supportEmail !== undefined ? data.supportEmail : undefined,
        vendorType: data.vendorType,
      },
    });

    return vendor;
  }

  async delete(id: string) {
    // Ensure vendor exists
    await this.findOne(id);

    await prisma.vendor.delete({
      where: { id },
    });
    return { id, deleted: true };
  }
}

export const vendorsService = new VendorsService();

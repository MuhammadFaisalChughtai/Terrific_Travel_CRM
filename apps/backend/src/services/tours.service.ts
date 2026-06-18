import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';

export class ToursService {
  async create(data: any) {
    return prisma.tour.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        durationDays: Number(data.durationDays),
        category: data.category,
        destination: {
          create: {
            name: data.destinationName,
            country: data.destinationCountry,
            description: data.destinationDescription || '',
          },
        },
      },
      include: {
        destination: true,
      },
    });
  }

  async findAll(query: any) {
    const { category, duration, limit = 10, offset = 0 } = query;
    const where: any = {};
    if (category) where.category = category;
    if (duration) where.durationDays = Number(duration);

    const [total, items] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({
        where,
        include: {
          destination: true,
        },
        take: Number(limit),
        skip: Number(offset),
      }),
    ]);

    return { total, limit: Number(limit), offset: Number(offset), items };
  }

  async findOne(id: string) {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: { destination: true },
    });
    if (!tour) throw new NotFoundException('Tour package not found');
    return tour;
  }

  async update(id: string, data: any) {
    return prisma.tour.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price !== undefined ? Number(data.price) : undefined,
        durationDays: data.durationDays !== undefined ? Number(data.durationDays) : undefined,
        category: data.category,
      },
    });
  }

  async delete(id: string) {
    await prisma.tour.delete({ where: { id } });
    return { success: true };
  }
}

export const toursService = new ToursService();

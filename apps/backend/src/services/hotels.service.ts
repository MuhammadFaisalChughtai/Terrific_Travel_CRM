import { prisma } from '../config';
import { NotFoundException } from '../middleware/error.middleware';

export class HotelsService {
  async create(data: any) {
    return prisma.hotel.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
        rating: Number(data.rating || 0.0),
      },
    });
  }

  async findAll(query: any) {
    const { search, name, city, country, rating, limit = 100, offset = 0 } = query;
    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (rating) where.rating = { gte: Number(rating) };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({
        where,
        include: { rooms: true },
        take: Number(limit),
        skip: Number(offset),
      }),
    ]);

    return { total, limit: Number(limit), offset: Number(offset), items };
  }

  async findOne(id: string) {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async update(id: string, data: any) {
    return prisma.hotel.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
        rating: data.rating !== undefined ? Number(data.rating) : undefined,
      },
    });
  }

  async delete(id: string) {
    await prisma.hotel.delete({ where: { id } });
    return { success: true };
  }

  // Room Management
  async createRoom(hotelId: string, data: any) {
    await this.findOne(hotelId);
    return prisma.room.create({
      data: {
        hotelId,
        roomType: data.roomType,
        price: Number(data.price),
        maxOccupancy: Number(data.maxOccupancy),
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
      },
    });
  }

  async updateRoom(roomId: string, data: any) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new NotFoundException('Room not found');
    return prisma.room.update({
      where: { id: roomId },
      data: {
        roomType: data.roomType,
        price: data.price !== undefined ? Number(data.price) : undefined,
        maxOccupancy: data.maxOccupancy !== undefined ? Number(data.maxOccupancy) : undefined,
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : undefined,
      },
    });
  }

  async deleteRoom(roomId: string) {
    await prisma.room.delete({ where: { id: roomId } });
    return { success: true };
  }
}

export const hotelsService = new HotelsService();

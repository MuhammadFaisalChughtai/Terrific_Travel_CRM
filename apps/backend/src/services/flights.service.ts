import { prisma } from '../config';
import { redisService } from './redis.service';
import { NotFoundException } from '../middleware/error.middleware';

export class FlightsService {
  async create(data: any) {
    const flight = await prisma.flight.create({
      data: {
        flightNumber: data.flightNumber,
        price: Number(data.price),
        departureTime: new Date(data.departureTime),
        arrivalTime: new Date(data.arrivalTime),
        availableSeats: Number(data.availableSeats),
        airline: {
          connectOrCreate: {
            where: { code: data.airlineCode },
            create: { name: data.airlineName, code: data.airlineCode, country: data.airlineCountry },
          },
        },
        departureAirport: {
          connectOrCreate: {
            where: { code: data.departureAirportCode },
            create: { name: data.departureAirportName, code: data.departureAirportCode, city: data.departureCity, country: data.departureCountry },
          },
        },
        arrivalAirport: {
          connectOrCreate: {
            where: { code: data.arrivalAirportCode },
            create: { name: data.arrivalAirportName, code: data.arrivalAirportCode, city: data.arrivalCity, country: data.arrivalCountry },
          },
        },
      },
      include: {
        airline: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });

    await redisService.flushall();
    return flight;
  }

  async search(query: any) {
    const { departureCity, arrivalCity, departureTime, limit = 10, offset = 0, sort = 'price', order = 'asc' } = query;
    
    const cacheKey = `flights:search:${JSON.stringify(query)}`;
    const cached = await redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const where: any = {};
    if (departureCity) {
      where.departureAirport = { city: { contains: departureCity, mode: 'insensitive' } };
    }
    if (arrivalCity) {
      where.arrivalAirport = { city: { contains: arrivalCity, mode: 'insensitive' } };
    }
    if (departureTime) {
      const startOfDay = new Date(departureTime);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(departureTime);
      endOfDay.setHours(23, 59, 59, 999);
      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const [total, items] = await Promise.all([
      prisma.flight.count({ where }),
      prisma.flight.findMany({
        where,
        include: {
          airline: true,
          departureAirport: true,
          arrivalAirport: true,
        },
        orderBy: { [sort]: order },
        take: Number(limit),
        skip: Number(offset),
      }),
    ]);

    const result = { total, limit: Number(limit), offset: Number(offset), items };
    await redisService.set(cacheKey, JSON.stringify(result), 300);

    return result;
  }

  async findOne(id: string) {
    const flight = await prisma.flight.findUnique({
      where: { id },
      include: {
        airline: true,
        departureAirport: true,
        arrivalAirport: true,
      },
    });
    if (!flight) throw new NotFoundException('Flight not found');
    return flight;
  }

  async update(id: string, data: any) {
    const flight = await prisma.flight.update({
      where: { id },
      data: {
        flightNumber: data.flightNumber,
        price: data.price !== undefined ? Number(data.price) : undefined,
        departureTime: data.departureTime ? new Date(data.departureTime) : undefined,
        arrivalTime: data.arrivalTime ? new Date(data.arrivalTime) : undefined,
        availableSeats: data.availableSeats !== undefined ? Number(data.availableSeats) : undefined,
      },
    });
    await redisService.flushall();
    return flight;
  }

  async delete(id: string) {
    await prisma.flight.delete({ where: { id } });
    await redisService.flushall();
    return { success: true };
  }

  async findAirportByCode(code: string) {
    const airport = await prisma.airport.findUnique({
      where: { code: code.toUpperCase() },
    });
    if (!airport) throw new NotFoundException('Airport not found');
    return airport;
  }
}

export const flightsService = new FlightsService();

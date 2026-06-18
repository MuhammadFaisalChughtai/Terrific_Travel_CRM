import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', description: 'System Root Administrator' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Enterprise Admin' },
  });

  const agentRole = await prisma.role.upsert({
    where: { name: 'TRAVEL_AGENT' },
    update: {},
    create: { name: 'TRAVEL_AGENT', description: 'Travel Booking Agent' },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Client Account' },
  });

  const permissionsList = [
    { name: 'users:read', description: 'Read users' },
    { name: 'users:write', description: 'Manage users' },
    { name: 'flights:read', description: 'View flights' },
    { name: 'flights:write', description: 'Manage flights' },
    { name: 'hotels:read', description: 'View hotels' },
    { name: 'hotels:write', description: 'Manage hotels' },
    { name: 'tours:read', description: 'View tours' },
    { name: 'tours:write', description: 'Manage tours' },
    { name: 'bookings:read', description: 'View bookings' },
    { name: 'bookings:write', description: 'Create bookings' },
    { name: 'payments:read', description: 'View transactions' },
    { name: 'payments:write', description: 'Checkout bookings' },
    { name: 'reports:read', description: 'View analytics' },
  ];

  for (const perm of permissionsList) {
    const createdPerm = await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: createdPerm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: createdPerm.id,
      },
    });

    if (['flights:read', 'hotels:read', 'tours:read', 'bookings:read', 'bookings:write', 'payments:write'].includes(perm.name)) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: agentRole.id,
            permissionId: createdPerm.id,
          },
        },
        update: {},
        create: {
          roleId: agentRole.id,
          permissionId: createdPerm.id,
        },
      });
    }
  }

  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tms.com' },
    update: {},
    create: {
      email: 'admin@tms.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      isEmailVerified: true,
      userRoles: {
        create: {
          roleId: superAdminRole.id,
        },
      },
    },
  });

  const dlAirline = await prisma.airline.upsert({
    where: { code: 'DL' },
    update: {},
    create: { name: 'Delta Air Lines', code: 'DL', country: 'United States' },
  });
  const lhAirline = await prisma.airline.upsert({
    where: { code: 'LH' },
    update: {},
    create: { name: 'Lufthansa', code: 'LH', country: 'Germany' },
  });

  const jfkAirport = await prisma.airport.upsert({
    where: { code: 'JFK' },
    update: {},
    create: { name: 'John F. Kennedy Intl', code: 'JFK', city: 'New York', country: 'United States' },
  });
  const laxAirport = await prisma.airport.upsert({
    where: { code: 'LAX' },
    update: {},
    create: { name: 'Los Angeles International', code: 'LAX', city: 'Los Angeles', country: 'United States' },
  });
  const fraAirport = await prisma.airport.upsert({
    where: { code: 'FRA' },
    update: {},
    create: { name: 'Frankfurt Airport', code: 'FRA', city: 'Frankfurt', country: 'Germany' },
  });

  await prisma.flight.upsert({
    where: { flightNumber: 'DL102' },
    update: {},
    create: {
      flightNumber: 'DL102',
      airlineId: dlAirline.id,
      departureAirportId: jfkAirport.id,
      arrivalAirportId: laxAirport.id,
      departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      arrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      price: 350.0,
      availableSeats: 120,
    },
  });

  await prisma.flight.upsert({
    where: { flightNumber: 'LH430' },
    update: {},
    create: {
      flightNumber: 'LH430',
      airlineId: lhAirline.id,
      departureAirportId: fraAirport.id,
      arrivalAirportId: jfkAirport.id,
      departureTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      arrivalTime: new Date(Date.now() + 48 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      price: 680.0,
      availableSeats: 85,
    },
  });

  const existingHotels = await prisma.hotel.findMany();
  if (existingHotels.length === 0) {
    const luxuryHotel = await prisma.hotel.create({
      data: {
        name: 'Grand Hyatt Regency',
        description: 'Ultra-luxurious 5-star lodging with majestic city vistas.',
        address: '109 Park Avenue',
        city: 'New York',
        country: 'United States',
        rating: 4.8,
        rooms: {
          createMany: {
            data: [
              { roomType: 'Deluxe Suite', price: 450.0, maxOccupancy: 2 },
              { roomType: 'Executive Room', price: 320.0, maxOccupancy: 2 },
            ],
          },
        },
      },
    });
  }

  const existingDestinations = await prisma.destination.findMany();
  if (existingDestinations.length === 0) {
    const parisDest = await prisma.destination.create({
      data: {
        name: 'Paris',
        country: 'France',
        description: 'The City of Lights, famous for arts, fashion, and history.',
        tours: {
          create: {
            name: 'Classic Paris Sightseeing',
            description: 'A comprehensive guided tour of the Eiffel Tower, Louvre, and Seine Cruise.',
            durationDays: 4,
            price: 599.0,
            category: 'Cultural',
          },
        },
      },
    });
  }

  const existingAgents = await prisma.agent.findMany();
  if (existingAgents.length === 0) {
    const agentPasswordHash = await bcrypt.hash('agent123', 10);
    const defaultAgent = await prisma.agent.create({
      data: {
        name: 'Jane Agent',
        email: 'agent@tms.com',
        phoneNumber: '+44 7911 123456',
        gdsSystem: 'Amadeus',
        client: 'Terrific Travel Ltd',
        pcc: '1A2B',
        jobStatus: 'Active',
        passwordHash: agentPasswordHash,
        walletBalance: 1500.0,
      },
    });

    await prisma.agentSlab.createMany({
      data: [
        { agentId: defaultAgent.id, minSales: 1000, maxSales: 2000, commissionRate: 5 },
        { agentId: defaultAgent.id, minSales: 2001, maxSales: 3000, commissionRate: 6 },
        { agentId: defaultAgent.id, minSales: 3001, maxSales: 4000, commissionRate: 7 },
        { agentId: defaultAgent.id, minSales: 4001, maxSales: 5000, commissionRate: 8 },
        { agentId: defaultAgent.id, minSales: 5001, maxSales: null, commissionRate: 10 },
      ],
    });
    console.log('Default Agent and Slabs Seeded.');
  }

  console.log('Database Seeding Completed Successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

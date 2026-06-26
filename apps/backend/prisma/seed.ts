import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN', description: 'System Root Administrator' },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'System Administrator' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Manager' },
    update: {},
    create: { name: 'Manager', description: 'Operations Manager' },
  });

  const agentRole = await prisma.role.upsert({
    where: { name: 'Agent' },
    update: {},
    create: { name: 'Agent', description: 'Booking Agent' },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'Customer' },
    update: {},
    create: { name: 'Customer', description: 'Client Account' },
  });

  const legacyAdminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: { name: 'ADMIN', description: 'Enterprise Admin (Legacy)' },
  });

  const legacyAgentRole = await prisma.role.upsert({
    where: { name: 'TRAVEL_AGENT' },
    update: {},
    create: { name: 'TRAVEL_AGENT', description: 'Travel Agent (Legacy)' },
  });

  const legacyCustomerRole = await prisma.role.upsert({
    where: { name: 'CUSTOMER' },
    update: {},
    create: { name: 'CUSTOMER', description: 'Customer (Legacy)' },
  });

  const permissionsList = [
    // Bookings
    { name: 'bookings:read', description: 'View all bookings' },
    { name: 'bookings:create', description: 'Create bookings' },
    { name: 'bookings:edit_any', description: 'Edit any booking' },
    { name: 'bookings:edit_own', description: 'Edit own booking' },
    { name: 'bookings:delete', description: 'Delete booking (soft-delete/archive)' },
    // Invoices
    { name: 'invoices:read', description: 'View all invoices' },
    { name: 'invoices:edit', description: 'Edit invoices' },
    { name: 'invoices:delete', description: 'Delete invoices (soft-delete/archive)' },
    { name: 'invoices:download', description: 'Download invoices' },
    { name: 'invoices:print', description: 'Print invoices' },
    // Customers
    { name: 'customers:read', description: 'View customers' },
    { name: 'customers:create', description: 'Create customers' },
    { name: 'customers:edit', description: 'Edit customers' },
    { name: 'customers:delete', description: 'Delete customers (deactivate)' },
    // Reports
    { name: 'reports:read_all', description: 'View all company financial reports' },
    { name: 'reports:read_own', description: 'View personal performance reports' },
    // Users
    { name: 'users:manage', description: 'Create and edit users, reset passwords, activate/deactivate users' },
    { name: 'roles:assign', description: 'Assign roles' },
    { name: 'permissions:manage', description: 'Manage permissions' },
    // Settings
    { name: 'settings:manage', description: 'Full system settings access' },
  ];

  // Map permissions to roles
  const adminPermissions = [
    'bookings:read', 'bookings:create', 'bookings:edit_any', 'bookings:edit_own',
    'invoices:read', 'invoices:edit', 'invoices:download', 'invoices:print',
    'customers:read', 'customers:create', 'customers:edit',
    'reports:read_all', 'reports:read_own',
    'users:manage', 'roles:assign', 'permissions:manage',
    'settings:manage'
  ];

  const managerPermissions = [
    'bookings:read', 'bookings:create', 'bookings:edit_any', 'bookings:edit_own',
    'invoices:read', 'invoices:edit', 'invoices:download', 'invoices:print',
    'customers:read', 'customers:create', 'customers:edit',
    'reports:read_all', 'reports:read_own'
  ];

  const agentPermissions = [
    'bookings:read', 'bookings:create', 'bookings:edit_own',
    'invoices:read', 'invoices:download', 'invoices:print',
    'customers:read', 'customers:create',
    'reports:read_own'
  ];

  for (const perm of permissionsList) {
    const createdPerm = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });

    // Assign to Admin role
    if (adminPermissions.includes(perm.name)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: createdPerm.id },
      });
      // Legacy compatibility
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: superAdminRole.id, permissionId: createdPerm.id },
      });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: legacyAdminRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: legacyAdminRole.id, permissionId: createdPerm.id },
      });
    }

    // Assign to Manager role
    if (managerPermissions.includes(perm.name)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: managerRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: managerRole.id, permissionId: createdPerm.id },
      });
    }

    // Assign to Agent role
    if (agentPermissions.includes(perm.name)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: agentRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: agentRole.id, permissionId: createdPerm.id },
      });
      // Legacy compatibility
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: legacyAgentRole.id, permissionId: createdPerm.id } },
        update: {},
        create: { roleId: legacyAgentRole.id, permissionId: createdPerm.id },
      });
    }
  }


  console.log('Roles, permissions, airports, and infrastructure seeded. No default users created.');

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

  // Seed Airports from data/airport.txt
  const filePath = path.join(__dirname, '../../../data/airport.txt');
  console.log('Reading airports from:', filePath);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    console.log(`Found ${lines.length} airport lines. Seeding...`);
    
    const multiWordCountries = [
      'united kingdom', 'united states', 'saudi arabia', 'ivory coast', 
      'south australia', 'new zealand', 'south africa', 'costa rica', 
      'sri lanka', 'united arab emirates', 'puerto rico', 'papua new guinea', 
      'dominican republic', 'el salvador', 'czech republic', 'hong kong',
      'bosnia and herzegovina', 'trinidad and tobago', 'caboverde',
      'são tomé and príncipe', 'sao tome and principe'
    ];

    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || i === 0) continue; // Skip header/empty lines
      
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      
      const code = parts[0].toUpperCase();
      if (code.length !== 3) continue;
      
      const rest = parts.slice(1);
      const fullName = rest.join(' ');
      
      let country = '';
      let city = '';
      let name = '';
      
      const lowerName = fullName.toLowerCase();
      let foundCountry = '';
      for (const c of multiWordCountries) {
        if (lowerName.endsWith(c)) {
          foundCountry = c;
          break;
        }
      }
      
      if (foundCountry) {
        country = foundCountry.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const withoutCountry = fullName.slice(0, -foundCountry.length).trim();
        const subParts = withoutCountry.split(/\s+/);
        if (subParts.length > 0) {
          city = subParts[subParts.length - 1];
          city = city.charAt(0).toUpperCase() + city.slice(1);
          name = subParts.slice(0, -1).join(' ');
        } else {
          city = 'Unknown';
          name = withoutCountry;
        }
      } else {
        const len = rest.length;
        if (len >= 3) {
          country = rest[len - 1];
          country = country.charAt(0).toUpperCase() + country.slice(1);
          city = rest[len - 2];
          city = city.charAt(0).toUpperCase() + city.slice(1);
          name = rest.slice(0, len - 2).join(' ');
        } else if (len === 2) {
          country = rest[1];
          country = country.charAt(0).toUpperCase() + country.slice(1);
          city = rest[0];
          city = city.charAt(0).toUpperCase() + city.slice(1);
          name = rest.join(' ');
        } else {
          country = rest[0];
          country = country.charAt(0).toUpperCase() + country.slice(1);
          city = rest[0];
          city = city.charAt(0).toUpperCase() + city.slice(1);
          name = rest[0];
        }
      }
      
      name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!name) name = fullName;
      
      let countryUpper = country.toUpperCase();
      if (countryUpper === 'UK') country = 'United Kingdom';
      else if (countryUpper === 'USA') country = 'United States';
      
      await prisma.airport.upsert({
        where: { code },
        update: { name, city, country },
        create: { code, name, city, country }
      });
      
      count++;
    }
    console.log(`Successfully seeded ${count} airports from airport.txt.`);
  } else {
    console.warn('Airport file not found at:', filePath);
  }

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



  // Seed Golden Crown Transport Vendor
  const goldenCrownVendor = await prisma.vendor.upsert({
    where: { id: '5f298e6a-ca20-4742-9a73-13f5d9abde00' },
    update: {
      vendorType: 'Transport',
    },
    create: {
      id: '5f298e6a-ca20-4742-9a73-13f5d9abde00',
      name: 'Golden Crown Umrah Transport',
      phoneNumber: '+966500000000',
      vendorType: 'Transport',
      walletBalance: 0,
    }
  });

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

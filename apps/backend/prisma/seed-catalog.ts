import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CATALOG_VEHICLES = [
  { name: 'FORD OR EQUIVALENT 3 SEATER', capacity: '3 Seater', sortOrder: 1 },
  { name: 'GMC EXECUTIVE XL YAKUN', capacity: 'Executive XL', sortOrder: 2 },
  { name: 'STARIA 6 PERSON', capacity: '6 Person', sortOrder: 3 },
  { name: 'MINI BUS / HIACE 09 SEATER', capacity: '09 Seater', sortOrder: 4 },
  { name: 'COASTER 15 SEATER', capacity: '15 Seater', sortOrder: 5 },
  { name: 'BUS 47 SEATER', capacity: '47 Seater', sortOrder: 6 },
  { name: 'BUS NEW 49 SEATER', capacity: '49 Seater', sortOrder: 7 },
];

export const CATALOG_ROUTES = [
  { name: 'JED-MKH', fromLocation: 'Jeddah (JED / Airport)', toLocation: 'Makkah (Hotel)', sortOrder: 1 },
  { name: 'MKH-JED', fromLocation: 'Makkah (Hotel)', toLocation: 'Jeddah (JED / Airport)', sortOrder: 2 },
  { name: 'MAKAH TO MADINA', fromLocation: 'Makkah (Hotel)', toLocation: 'Madinah (Hotel)', sortOrder: 3 },
  { name: 'JED APT TO MED HTL', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Madinah Hotel', sortOrder: 4 },
  { name: 'MAKKAH TO JEDDAH APT/CITY', fromLocation: 'Makkah Hotel', toLocation: 'Jeddah Airport / City', sortOrder: 5 },
  { name: 'MAKAH ZIYARAT', fromLocation: 'Makkah Hotel', toLocation: 'Makkah Holy Sites (Ziyarat)', sortOrder: 6 },
  { name: 'MADINA ZIYARAT', fromLocation: 'Madinah Hotel', toLocation: 'Madinah Holy Sites (Ziyarat)', sortOrder: 7 },
  { name: 'MADINAH APT-MADINAH HTL', fromLocation: 'Madinah Airport (MED)', toLocation: 'Madinah Hotel', sortOrder: 8 },
  { name: 'JEDDAH AIRPORT-JEDDAH CITY', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Jeddah City', sortOrder: 9 },
  { name: 'MKH TO TAIF VISIT', fromLocation: 'Makkah Hotel', toLocation: 'Taif City / Visit', sortOrder: 10 },
  { name: 'MKH HTL TO MKH STN', fromLocation: 'Makkah Hotel', toLocation: 'Makkah Train Station (Haramain)', sortOrder: 11 },
  { name: 'MED STN TO MED HTL', fromLocation: 'Madinah Train Station (Haramain)', toLocation: 'Madinah Hotel', sortOrder: 12 },
  { name: 'MKH TO MED VIA BADAR EXTRA', fromLocation: 'Makkah Hotel', toLocation: 'Madinah Hotel via Badr', sortOrder: 13 },
  { name: 'MKH ZIYARAT WITH JURANA', fromLocation: 'Makkah Hotel', toLocation: "Makkah Ziyarat with Ji'rana", sortOrder: 14 },
  { name: 'MED APT TO MKH HTL', fromLocation: 'Madinah Airport (MED)', toLocation: 'Makkah Hotel', sortOrder: 15 },
  { name: 'TAIF AIRPORT TO MKH HTL', fromLocation: 'Taif Airport', toLocation: 'Makkah Hotel', sortOrder: 16 },
];

export const CATALOG_RATES_MATRIX: Record<string, number[]> = {
  'JED-MKH': [260, 410, 325, 375, 550, 800, 900],
  'MKH-JED': [195, 350, 290, 280, 450, 700, 800],
  'MAKAH TO MADINA': [425, 830, 520, 575, 790, 1050, 1150],
  'JED APT TO MED HTL': [520, 870, 600, 650, 900, 1150, 1250],
  'MAKKAH TO JEDDAH APT/CITY': [195, 350, 290, 280, 450, 700, 800],
  'MAKAH ZIYARAT': [190, 350, 260, 295, 350, 450, 500],
  'MADINA ZIYARAT': [190, 350, 260, 295, 350, 450, 500],
  'MADINAH APT-MADINAH HTL': [180, 260, 220, 270, 330, 450, 500],
  'JEDDAH AIRPORT-JEDDAH CITY': [180, 330, 250, 280, 300, 450, 500],
  'MKH TO TAIF VISIT': [600, 950, 690, 750, 830, 1000, 1100],
  'MKH HTL TO MKH STN': [150, 250, 210, 290, 310, 350, 400],
  'MED STN TO MED HTL': [150, 250, 210, 290, 310, 350, 400],
  'MKH TO MED VIA BADAR EXTRA': [220, 300, 230, 270, 280, 300, 350],
  'MKH ZIYARAT WITH JURANA': [250, 450, 400, 395, 400, 450, 500],
  'MED APT TO MKH HTL': [700, 980, 800, 875, 1150, 1400, 1550],
  'TAIF AIRPORT TO MKH HTL': [600, 900, 700, 750, 850, 950, 1050],
};

export const AL_SULTAN_ROUTES = [
  { name: 'JEDDAH AIRPORT TO MAKKAH', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Makkah Hotel', sortOrder: 101 },
  { name: 'MAKKAH TO MADINAH', fromLocation: 'Makkah Hotel', toLocation: 'Madinah Hotel', sortOrder: 102 },
  { name: 'JEDDAH TO MADINAH', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Madinah Hotel', sortOrder: 103 },
  { name: 'MAK HOTEL TO MAK TRS', fromLocation: 'Makkah Hotel', toLocation: 'Makkah Train Station (Haramain)', sortOrder: 104 },
  { name: 'MAD HOTEL TO MAD TRS', fromLocation: 'Madinah Hotel', toLocation: 'Madinah Train Station (Haramain)', sortOrder: 105 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Jeddah Airport (Circuit)', sortOrder: 106 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT WITH MAZARAT', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Jeddah Airport (Circuit with Ziyarat)', sortOrder: 107 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Madinah Airport (Circuit)', sortOrder: 108 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT WITH MAZARAT', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Madinah Airport (Circuit with Ziyarat)', sortOrder: 109 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH', fromLocation: 'Jeddah', toLocation: 'Jeddah (Full Circuit)', sortOrder: 110 },
  { name: 'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH WITH MAZARAT', fromLocation: 'Jeddah', toLocation: 'Jeddah (Full Circuit with Ziyarat)', sortOrder: 111 },
  { name: 'JEDDAH AIRPORT TO JEDDAH CITY TO JEDDAH AIRPORT', fromLocation: 'Jeddah Airport (JED)', toLocation: 'Jeddah City & Return', sortOrder: 112 },
  { name: 'MAKKAH ZIARAT', fromLocation: 'Makkah Hotel', toLocation: 'Makkah Holy Sites (Ziyarat)', sortOrder: 113 },
  { name: 'MADINAH ZIARAT', fromLocation: 'Madinah Hotel', toLocation: 'Madinah Holy Sites (Ziyarat)', sortOrder: 114 },
  { name: 'MADINAH AIRPORT TO MADINAH HOTEL', fromLocation: 'Madinah Airport (MED)', toLocation: 'Madinah Hotel', sortOrder: 115 },
  { name: 'MADINAH HOTEL TO MADINAH AIRPORT', fromLocation: 'Madinah Hotel', toLocation: 'Madinah Airport (MED)', sortOrder: 116 },
];

export const AL_SULTAN_RATES_MATRIX: Record<string, number[]> = {
  'JEDDAH AIRPORT TO MAKKAH': [220, 390, 275, 325, 470, 820, 820],
  'MAKKAH TO MADINAH': [405, 800, 500, 575, 780, 1100, 1100],
  'JEDDAH TO MADINAH': [420, 820, 520, 620, 900, 1120, 1120],
  'MAK HOTEL TO MAK TRS': [110, 270, 130, 220, 270, 520, 520],
  'MAD HOTEL TO MAD TRS': [100, 270, 130, 220, 270, 520, 520],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT': [1045, 2010, 1295, 1520, 2150, 3040, 3040],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO JEDDAH AIRPORT WITH MAZARAT': [1355, 2610, 1735, 2060, 2890, 3940, 3940],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT': [745, 1440, 945, 1160, 1570, 2370, 2370],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MADINAH AIRPORT WITH MAZARAT': [1055, 2040, 1385, 1700, 2310, 3270, 3270],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH': [1250, 2380, 1550, 1800, 2500, 3840, 3840],
  'ROUND TRIP JEDDAH TO MAKKAH TO MADINAH TO MAKKAH TO JEDDAH WITH MAZARAT': [1560, 2980, 1990, 2340, 3240, 4740, 4740],
  'JEDDAH AIRPORT TO JEDDAH CITY TO JEDDAH AIRPORT': [150, 370, 200, 220, 370, 570, 570],
  'MAKKAH ZIARAT': [155, 300, 220, 270, 370, 450, 450],
  'MADINAH ZIARAT': [155, 300, 220, 270, 370, 450, 450],
  'MADINAH AIRPORT TO MADINAH HOTEL': [120, 250, 170, 260, 320, 450, 450],
  'MADINAH HOTEL TO MADINAH AIRPORT': [120, 250, 170, 260, 320, 450, 450],
};

export const CATALOG_VISAS = [
  {
    country: 'Saudi Arabia',
    visaType: 'Umrah Tourist E-Visa (1 Year Multiple Entry)',
    price: 130.0,
    currency: 'GBP',
    insuranceIncluded: true,
    insurancePrice: 0.0,
    insuranceDetails: 'Full COVID & Medical Emergency Travel Insurance included covering up to 100,000 SAR across KSA hospitals',
    validity: '1 Year (Multiple Entry)',
    stayDuration: '90 Days per visit',
    processingTime: '24 - 48 Hours',
    documentsRequired: 'Valid Passport (minimum 6 months validity), Digital Passport-sized Photo (White background), UK/EU Residence proof (if non-UK passport holder)',
    notes: 'Allows performing Umrah, tourism, and travel across all Saudi cities',
  },
  {
    country: 'Saudi Arabia',
    visaType: 'Umrah Visa (30 Days Single Entry)',
    price: 110.0,
    currency: 'GBP',
    insuranceIncluded: true,
    insurancePrice: 0.0,
    insuranceDetails: 'Standard Ministry of Hajj & Umrah health insurance included',
    validity: '30 Days',
    stayDuration: '30 Days Single Entry',
    processingTime: '2 - 3 Working Days',
    documentsRequired: 'Valid Passport (minimum 6 months validity), Digital Photo with white background, Confirmed Hotel & Flight booking',
    notes: 'Official Umrah single entry visa under approved Umrah operator',
  },
  {
    country: 'Saudi Arabia',
    visaType: 'Electronic Visa Waiver (EVW)',
    price: 45.0,
    currency: 'GBP',
    insuranceIncluded: false,
    insurancePrice: 0.0,
    insuranceDetails: 'Not included, optional standalone insurance',
    validity: '6 Months Single Entry',
    stayDuration: 'Up to 6 Months',
    processingTime: 'Under 24 Hours',
    documentsRequired: 'British Citizen Passport copy, Confirmed Flight booking',
    notes: 'Available exclusively for British citizens traveling for tourism, business, or Umrah',
  },
  {
    country: 'United Arab Emirates',
    visaType: 'Dubai Tourist Visa (30 Days Single Entry)',
    price: 95.0,
    currency: 'GBP',
    insuranceIncluded: true,
    insurancePrice: 0.0,
    insuranceDetails: 'UAE COVID-19 & Medical travel insurance included',
    validity: '60 Days from issue',
    stayDuration: '30 Days Single Entry',
    processingTime: '24 - 48 Hours',
    documentsRequired: 'Clear Passport scan (bio page), Passport photo on white background',
    notes: 'Single entry tourist visa for all 7 UAE Emirates',
  },
  {
    country: 'United Arab Emirates',
    visaType: 'Dubai Tourist Visa (60 Days Multiple Entry)',
    price: 220.0,
    currency: 'GBP',
    insuranceIncluded: true,
    insurancePrice: 0.0,
    insuranceDetails: 'UAE Multi-entry comprehensive medical insurance included',
    validity: '60 Days',
    stayDuration: '60 Days Multiple Entry',
    processingTime: '2 - 4 Working Days',
    documentsRequired: 'Passport copy (minimum 6 months validity), White background photograph',
    notes: 'Ideal for frequent business and leisure travelers',
  },
  {
    country: 'Turkey',
    visaType: 'Turkey E-Visa (Multiple Entry)',
    price: 55.0,
    currency: 'GBP',
    insuranceIncluded: false,
    insurancePrice: 0.0,
    insuranceDetails: 'Optional travel insurance recommended',
    validity: '180 Days',
    stayDuration: 'Up to 90 Days',
    processingTime: 'Instant / Same Day',
    documentsRequired: 'Valid Passport copy, Return flight details',
    notes: 'Fast electronic visa for transit or tourism in Turkey',
  },
];

export async function seedCatalogData(db: PrismaClient = prisma) {
  console.log('Resolving Default Vendors for Catalog...');
  // Find or create default Transport Vendor: Basma Transport
  let transportVendor = await db.vendor.findFirst({
    where: {
      name: { contains: 'Basma Transport', mode: 'insensitive' },
    },
  });

  if (!transportVendor) {
    transportVendor = await db.vendor.findFirst({
      where: {
        name: { contains: 'Basma', mode: 'insensitive' },
      },
    });
  }

  if (!transportVendor) {
    transportVendor = await db.vendor.upsert({
      where: { id: '50fd9f2d-4964-4b67-bfa9-9bc09d46282b' },
      update: { name: 'Basma Transport', vendorType: 'Transportation' },
      create: {
        id: '50fd9f2d-4964-4b67-bfa9-9bc09d46282b',
        name: 'Basma Transport',
        phoneNumber: '00966 54 512 1968',
        vendorType: 'Transportation',
        walletBalance: 0,
      },
    });
  }

  // Find or create Al Sultan Transfer Vendor
  let alSultanVendor = await db.vendor.findFirst({
    where: {
      name: { contains: 'Al Sultan', mode: 'insensitive' },
    },
  });

  if (!alSultanVendor) {
    alSultanVendor = await db.vendor.findFirst({
      where: {
        name: { contains: 'Sultan', mode: 'insensitive' },
      },
    });
  }

  if (!alSultanVendor) {
    alSultanVendor = await db.vendor.upsert({
      where: { id: '61fe8f3e-5a75-4c78-cba0-8bc19d57393c' },
      update: { name: 'Al Sultan Transfer', vendorType: 'Transportation' },
      create: {
        id: '61fe8f3e-5a75-4c78-cba0-8bc19d57393c',
        name: 'Al Sultan Transfer',
        phoneNumber: '+966 50 000 0000',
        vendorType: 'Transportation',
        walletBalance: 0,
      },
    });
  }

  // Find or create default Visa Vendor
  let visaVendor = await db.vendor.findFirst({
    where: {
      OR: [
        { vendorType: { in: ['VISA', 'visa', 'Visa'] } },
        { name: { contains: 'Visa', mode: 'insensitive' } },
      ],
    },
  });

  if (!visaVendor) {
    visaVendor = await db.vendor.create({
      data: {
        name: 'Global Visa & Umrah Services',
        phoneNumber: '+442080000000',
        vendorType: 'VISA',
        walletBalance: 0,
      },
    });
  }

  console.log('Seeding Transport Vehicles...');
  const vehicleMap: Record<string, string> = {};
  for (const v of CATALOG_VEHICLES) {
    const vehicle = await db.transportVehicle.upsert({
      where: { name: v.name },
      update: { capacity: v.capacity, sortOrder: v.sortOrder },
      create: { name: v.name, capacity: v.capacity, sortOrder: v.sortOrder },
    });
    vehicleMap[v.name] = vehicle.id;
  }

  console.log('Seeding Transport Routes...');
  const routeMap: Record<string, string> = {};
  const allRoutesToSeed = [...CATALOG_ROUTES, ...AL_SULTAN_ROUTES];
  for (const r of allRoutesToSeed) {
    const route = await db.transportRoute.upsert({
      where: { name: r.name },
      update: { fromLocation: r.fromLocation, toLocation: r.toLocation, sortOrder: r.sortOrder },
      create: { name: r.name, fromLocation: r.fromLocation, toLocation: r.toLocation, sortOrder: r.sortOrder },
    });
    routeMap[r.name] = route.id;
  }

  console.log('Seeding Transport Rates Matrix for Basma Transport (1448H-(2026-2027))...');
  const season = '1448H-(2026-2027)';
  for (const [routeName, rates] of Object.entries(CATALOG_RATES_MATRIX)) {
    const routeId = routeMap[routeName];
    if (!routeId) continue;

    for (let i = 0; i < rates.length; i++) {
      const vehicleDef = CATALOG_VEHICLES[i];
      if (!vehicleDef) continue;
      const vehicleId = vehicleMap[vehicleDef.name];
      if (!vehicleId) continue;

      const price = rates[i];
      const existing = await db.transportRate.findFirst({
        where: {
          routeId,
          vehicleId,
          season,
          vendorId: transportVendor.id,
        },
      });

      if (existing) {
        await db.transportRate.update({
          where: { id: existing.id },
          data: { price, currency: 'SAR', vendorId: transportVendor.id },
        });
      } else {
        await db.transportRate.create({
          data: {
            routeId,
            vehicleId,
            price,
            currency: 'SAR',
            season,
            vendorId: transportVendor.id,
          },
        });
      }
    }
  }

  console.log('Seeding Transport Rates Matrix for Al Sultan Transfer (1448H-(2026-2027))...');
  for (const [routeName, rates] of Object.entries(AL_SULTAN_RATES_MATRIX)) {
    const routeId = routeMap[routeName];
    if (!routeId) continue;

    for (let i = 0; i < rates.length; i++) {
      const vehicleDef = CATALOG_VEHICLES[i];
      if (!vehicleDef) continue;
      const vehicleId = vehicleMap[vehicleDef.name];
      if (!vehicleId) continue;

      const price = rates[i];
      const existing = await db.transportRate.findFirst({
        where: {
          routeId,
          vehicleId,
          season,
          vendorId: alSultanVendor.id,
        },
      });

      if (existing) {
        await db.transportRate.update({
          where: { id: existing.id },
          data: { price, currency: 'SAR', vendorId: alSultanVendor.id },
        });
      } else {
        await db.transportRate.create({
          data: {
            routeId,
            vehicleId,
            price,
            currency: 'SAR',
            season,
            vendorId: alSultanVendor.id,
          },
        });
      }
    }
  }

  // Ensure any orphaned transport rates for this season have Basma Transport assigned
  await db.transportRate.updateMany({
    where: { season, vendorId: null },
    data: { vendorId: transportVendor.id },
  });

  console.log('Seeding Visa Catalog Products...');
  for (const v of CATALOG_VISAS) {
    const existing = await db.visaCatalog.findFirst({
      where: { country: v.country, visaType: v.visaType },
    });
    if (existing) {
      await db.visaCatalog.update({
        where: { id: existing.id },
        data: {
          ...v,
          vendorId: existing.vendorId || visaVendor.id,
        },
      });
    } else {
      await db.visaCatalog.create({
        data: {
          ...v,
          vendorId: visaVendor.id,
        },
      });
    }
  }

  console.log('Catalog seeding finished successfully!');
}

if (require.main === module) {
  seedCatalogData()
    .catch((err) => {
      console.error('Error seeding catalog:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

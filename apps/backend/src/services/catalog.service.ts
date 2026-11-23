import { prisma } from '../config';
import { seedCatalogData } from '../../prisma/seed-catalog';
import { BadRequestException } from '../middleware/error.middleware';

export class CatalogService {
  /**
   * Get transport matrix: vehicles, routes, and all rates for selected vendor
   * Auto-seeds if database is empty.
   */
  async getTransportMatrix(season: string = '1448H-(2026-2027)', vendorId?: string) {
    // 1. Fetch all transport vendors
    let transportVendors = await prisma.vendor.findMany({
      where: {
        OR: [
          { vendorType: { in: ['Transportation', 'transportation', 'TRANSPORTATION', 'Transport', 'transport'] } },
          { name: { in: ['Basma Transport', 'Al Sultan Transfer', 'Al Sultan'] } },
        ],
      },
      orderBy: { name: 'asc' },
    });

    // Check if defaults exist
    const hasBasma = transportVendors.some((v) => v.name.toLowerCase().includes('basma'));
    const hasSultan = transportVendors.some((v) => v.name.toLowerCase().includes('sultan'));
    const ratesCount = await prisma.transportRate.count({ where: { season } });

    if (transportVendors.length === 0 || !hasBasma || !hasSultan || ratesCount < 100) {
      await seedCatalogData(prisma);
      transportVendors = await prisma.vendor.findMany({
        where: {
          OR: [
            { vendorType: { in: ['Transportation', 'transportation', 'TRANSPORTATION', 'Transport', 'transport'] } },
            { name: { in: ['Basma Transport', 'Al Sultan Transfer', 'Al Sultan'] } },
          ],
        },
        orderBy: { name: 'asc' },
      });
    }

    // Determine active vendor
    const activeVendor =
      (vendorId ? transportVendors.find((v) => v.id === vendorId) : null) ||
      transportVendors.find((v) => v.name.toLowerCase().includes('basma')) ||
      transportVendors[0];
    const activeVendorId = activeVendor?.id;

    // Fetch vehicles, routes, and rates for active vendor
    const whereRates: any = { season };
    if (activeVendorId) {
      whereRates.vendorId = activeVendorId;
    }

    const [vehicles, allRoutes, rates] = await Promise.all([
      prisma.transportVehicle.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.transportRoute.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.transportRate.findMany({
        where: whereRates,
        include: { vehicle: true, route: true, vendor: true },
      }),
    ]);

    // Build 2D matrix indexed by routeId and vehicleId
    const matrix: Record<string, Record<string, any>> = {};
    const routeRateCount: Record<string, number> = {};
    for (const r of rates) {
      if (!matrix[r.routeId]) {
        matrix[r.routeId] = {};
      }
      matrix[r.routeId][r.vehicleId] = {
        id: r.id,
        price: r.price,
        currency: r.currency || 'SAR',
        notes: r.notes,
        vendorId: r.vendorId,
        vendor: r.vendor,
      };
      routeRateCount[r.routeId] = (routeRateCount[r.routeId] || 0) + 1;
    }

    // Prioritize routes that have rates for this vendor, followed by other catalog routes
    const routesWithRates = allRoutes.filter((route) => (routeRateCount[route.id] || 0) > 0);
    const routesWithoutRates = allRoutes.filter((route) => !routeRateCount[route.id]);
    const routes = routesWithRates.length > 0 ? [...routesWithRates, ...routesWithoutRates] : allRoutes;

    return {
      season,
      vendors: transportVendors,
      selectedVendorId: activeVendorId,
      vehicles,
      routes,
      rates,
      matrix,
    };
  }

  /**
   * Get flat list of transport options for booking modal dropdowns
   */
  async getTransportOptions(season: string = '1448H-(2026-2027)', vendorId?: string) {
    const { routes, vehicles, rates } = await this.getTransportMatrix(season, vendorId);

    const rateMap: Record<string, number> = {};
    const currencyMap: Record<string, string> = {};
    const vendorIdMap: Record<string, string | null> = {};
    const vendorNameMap: Record<string, string | null> = {};
    for (const r of rates) {
      const key = `${r.routeId}_${r.vehicleId}`;
      rateMap[key] = r.price;
      currencyMap[key] = r.currency || 'SAR';
      vendorIdMap[key] = r.vendorId || null;
      vendorNameMap[key] = r.vendor?.name || null;
    }

    const options: any[] = [];
    for (const route of routes) {
      for (const vehicle of vehicles) {
        const key = `${route.id}_${vehicle.id}`;
        const price = rateMap[key] ?? 0;
        const currency = currencyMap[key] || 'SAR';
        const optVendorId = vendorIdMap[key] || null;
        const vendorName = vendorNameMap[key] || null;

        options.push({
          id: key,
          routeId: route.id,
          routeName: route.name,
          fromLocation: route.fromLocation || route.name.split('TO')[0]?.trim() || '',
          toLocation: route.toLocation || route.name.split('TO')[1]?.trim() || '',
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          capacity: vehicle.capacity || '',
          price,
          currency,
          vendorId: optVendorId,
          vendorName,
          label: `${route.name} | ${vehicle.name} (${currency} ${price})${vendorName ? ` [${vendorName}]` : ''}`,
        });
      }
    }

    return options;
  }

  /**
   * Upsert a rate in the matrix
   */
  async upsertTransportRate(data: {
    routeId: string;
    vehicleId: string;
    price: number;
    currency?: string;
    season?: string;
    notes?: string;
    vendorId?: string | null;
  }) {
    const season = data.season || '1448H-(2026-2027)';
    const currency = data.currency || 'SAR';
    const vendorId = data.vendorId || null;

    const existing = await prisma.transportRate.findFirst({
      where: {
        routeId: data.routeId,
        vehicleId: data.vehicleId,
        season,
        vendorId,
      },
    });

    if (existing) {
      return prisma.transportRate.update({
        where: { id: existing.id },
        data: {
          price: Number(data.price),
          currency,
          notes: data.notes,
        },
        include: {
          vehicle: true,
          route: true,
          vendor: true,
        },
      });
    }

    return prisma.transportRate.create({
      data: {
        routeId: data.routeId,
        vehicleId: data.vehicleId,
        price: Number(data.price),
        currency,
        season,
        notes: data.notes,
        vendorId,
      },
      include: {
        vehicle: true,
        route: true,
        vendor: true,
      },
    });
  }

  /**
   * Create a new transport vendor/company
   */
  async createTransportCompany(data: {
    name: string;
    phoneNumber?: string;
    companyManagerName?: string;
    copyFromVendorId?: string;
  }) {
    const cleanName = data.name.trim();
    if (!cleanName) throw new BadRequestException('Company name is required');

    let vendor = await prisma.vendor.findFirst({
      where: { name: { equals: cleanName, mode: 'insensitive' } },
    });

    if (vendor) {
      if (vendor.vendorType !== 'Transportation') {
        vendor = await prisma.vendor.update({
          where: { id: vendor.id },
          data: { vendorType: 'Transportation' },
        });
      }
    } else {
      vendor = await prisma.vendor.create({
        data: {
          name: cleanName,
          phoneNumber: data.phoneNumber ? data.phoneNumber.trim() : '+966000000000',
          companyManagerName: data.companyManagerName ? data.companyManagerName.trim() : null,
          vendorType: 'Transportation',
          walletBalance: 0,
        },
      });
    }

    // Optional: copy routes and rates from existing template
    if (data.copyFromVendorId) {
      const season = '1448H-(2026-2027)';
      const sourceRates = await prisma.transportRate.findMany({
        where: { season, vendorId: data.copyFromVendorId },
      });
      for (const src of sourceRates) {
        const existing = await prisma.transportRate.findFirst({
          where: {
            routeId: src.routeId,
            vehicleId: src.vehicleId,
            season,
            vendorId: vendor.id,
          },
        });
        if (!existing) {
          await prisma.transportRate.create({
            data: {
              routeId: src.routeId,
              vehicleId: src.vehicleId,
              price: src.price,
              currency: src.currency || 'SAR',
              season,
              vendorId: vendor.id,
            },
          });
        }
      }
    }

    return vendor;
  }

  /**
   * Route management
   */
  async createRoute(data: { name: string; fromLocation?: string; toLocation?: string; sortOrder?: number }) {
    const count = await prisma.transportRoute.count();
    return prisma.transportRoute.create({
      data: {
        name: data.name.trim().toUpperCase(),
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        sortOrder: data.sortOrder ?? count + 1,
      },
    });
  }

  async updateRoute(id: string, data: { name?: string; fromLocation?: string; toLocation?: string; sortOrder?: number }) {
    return prisma.transportRoute.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim().toUpperCase() } : {}),
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
  }

  async deleteRoute(id: string) {
    return prisma.transportRoute.delete({ where: { id } });
  }

  /**
   * Vehicle management
   */
  async createVehicle(data: { name: string; capacity?: string; sortOrder?: number; imageUrl?: string }) {
    const count = await prisma.transportVehicle.count();
    return prisma.transportVehicle.create({
      data: {
        name: data.name.trim().toUpperCase(),
        capacity: data.capacity,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder ?? count + 1,
      },
    });
  }

  async updateVehicle(id: string, data: { name?: string; capacity?: string; sortOrder?: number; imageUrl?: string }) {
    return prisma.transportVehicle.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name.trim().toUpperCase() } : {}),
        capacity: data.capacity,
        imageUrl: data.imageUrl,
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
  }

  async deleteVehicle(id: string) {
    return prisma.transportVehicle.delete({ where: { id } });
  }

  private sanitizeDocumentsRequired(docs: any): string | null | undefined {
    if (docs === undefined) return undefined;
    if (docs === null) return null;
    if (Array.isArray(docs)) {
      return docs
        .filter(Boolean)
        .map((s: any) => String(s).trim())
        .filter((s: string) => s.length > 0)
        .join(', ');
    }
    if (typeof docs === 'string') {
      return docs.trim();
    }
    return String(docs);
  }

  /**
   * Visa Catalog
   */
  async getVisaCatalog(includeInactive = false) {
    let visas = await prisma.visaCatalog.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        vendor: {
          select: { id: true, name: true, vendorType: true },
        },
      },
      orderBy: [{ country: 'asc' }, { price: 'asc' }],
    });

    if (visas.length === 0) {
      await seedCatalogData(prisma);
      visas = await prisma.visaCatalog.findMany({
        where: includeInactive ? {} : { isActive: true },
        include: {
          vendor: {
            select: { id: true, name: true, vendorType: true },
          },
        },
        orderBy: [{ country: 'asc' }, { price: 'asc' }],
      });
    }

    return visas.map((v) => ({
      ...v,
      description: v.notes,
    }));
  }

  async createVisa(data: {
    country: string;
    visaType: string;
    price: number;
    currency?: string;
    insuranceIncluded?: boolean;
    insurancePrice?: number;
    insuranceCost?: number;
    insuranceDetails?: string;
    validity?: string;
    stayDuration?: string;
    processingTime?: string;
    documentsRequired?: any;
    notes?: string;
    description?: string;
    vendorId?: string | null;
    isActive?: boolean;
  }) {
    const docs = this.sanitizeDocumentsRequired(data.documentsRequired);
    return prisma.visaCatalog.create({
      data: {
        country: data.country.trim(),
        visaType: data.visaType.trim(),
        price: Number(data.price) || 0,
        currency: data.currency || 'GBP',
        insuranceIncluded: data.insuranceIncluded !== undefined ? Boolean(data.insuranceIncluded) : true,
        insurancePrice:
          data.insurancePrice !== undefined
            ? Number(data.insurancePrice)
            : data.insuranceCost !== undefined
            ? Number(data.insuranceCost)
            : 0,
        insuranceDetails: data.insuranceDetails,
        validity: data.validity,
        stayDuration: data.stayDuration,
        processingTime: data.processingTime,
        documentsRequired: docs ?? null,
        notes: data.notes || data.description,
        vendorId: data.vendorId || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
      include: {
        vendor: {
          select: { id: true, name: true, vendorType: true },
        },
      },
    });
  }

  async updateVisa(id: string, data: any) {
    const updateData: any = {};
    if (data.country !== undefined) updateData.country = data.country.trim();
    if (data.visaType !== undefined) updateData.visaType = data.visaType.trim();
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.insuranceIncluded !== undefined) updateData.insuranceIncluded = Boolean(data.insuranceIncluded);
    if (data.insurancePrice !== undefined) updateData.insurancePrice = Number(data.insurancePrice);
    else if (data.insuranceCost !== undefined) updateData.insurancePrice = Number(data.insuranceCost);
    if (data.insuranceDetails !== undefined) updateData.insuranceDetails = data.insuranceDetails;
    if (data.validity !== undefined) updateData.validity = data.validity;
    if (data.stayDuration !== undefined) updateData.stayDuration = data.stayDuration;
    if (data.processingTime !== undefined) updateData.processingTime = data.processingTime;
    if (data.documentsRequired !== undefined) {
      updateData.documentsRequired = this.sanitizeDocumentsRequired(data.documentsRequired);
    }
    if (data.notes !== undefined) updateData.notes = data.notes;
    else if (data.description !== undefined) updateData.notes = data.description;
    if (data.vendorId !== undefined) {
      updateData.vendorId = data.vendorId || null;
    }
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    return prisma.visaCatalog.update({
      where: { id },
      data: updateData,
      include: {
        vendor: {
          select: { id: true, name: true, vendorType: true },
        },
      },
    });
  }

  async deleteVisa(id: string) {
    return prisma.visaCatalog.delete({ where: { id } });
  }

  async resetToDefault() {
    await seedCatalogData(prisma);
    return { success: true, message: 'Catalog reloaded with default rates and visas' };
  }
}

export const catalogService = new CatalogService();

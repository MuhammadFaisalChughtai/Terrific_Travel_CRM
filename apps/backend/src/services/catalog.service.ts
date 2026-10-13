import { prisma } from '../config';
import { seedCatalogData } from '../../prisma/seed-catalog';

export class CatalogService {
  /**
   * Get transport matrix: vehicles, routes, and all rates
   * Auto-seeds if database is empty.
   */
  async getTransportMatrix(season: string = '1448H-(2026-2027)') {
    let [vehicles, routes, rates] = await Promise.all([
      prisma.transportVehicle.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.transportRoute.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.transportRate.findMany({
        where: { season },
        include: { vehicle: true, route: true },
      }),
    ]);

    // If empty or incomplete (< 105 rates), auto-seed and reload
    if (vehicles.length === 0 || routes.length === 0 || rates.length < 105) {
      await seedCatalogData(prisma);
      [vehicles, routes, rates] = await Promise.all([
        prisma.transportVehicle.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.transportRoute.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.transportRate.findMany({
          where: { season },
          include: { vehicle: true, route: true },
        }),
      ]);
    }

    // Build 2D matrix indexed by routeId and vehicleId
    const matrix: Record<string, Record<string, any>> = {};
    for (const r of rates) {
      if (!matrix[r.routeId]) {
        matrix[r.routeId] = {};
      }
      matrix[r.routeId][r.vehicleId] = {
        id: r.id,
        price: r.price,
        currency: r.currency || 'SAR',
        notes: r.notes,
      };
    }

    return {
      season,
      vehicles,
      routes,
      rates,
      matrix,
    };
  }

  /**
   * Get flat list of transport options for booking modal dropdowns
   */
  async getTransportOptions(season: string = '1448H-(2026-2027)') {
    const { routes, vehicles, rates } = await this.getTransportMatrix(season);

    const rateMap: Record<string, number> = {};
    const currencyMap: Record<string, string> = {};
    for (const r of rates) {
      rateMap[`${r.routeId}_${r.vehicleId}`] = r.price;
      currencyMap[`${r.routeId}_${r.vehicleId}`] = r.currency || 'SAR';
    }

    const options: any[] = [];
    for (const route of routes) {
      for (const vehicle of vehicles) {
        const key = `${route.id}_${vehicle.id}`;
        const price = rateMap[key] ?? 0;
        const currency = currencyMap[key] || 'SAR';

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
          label: `${route.name} | ${vehicle.name} (${currency} ${price})`,
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
  }) {
    const season = data.season || '1448H-(2026-2027)';
    const currency = data.currency || 'SAR';

    return prisma.transportRate.upsert({
      where: {
        routeId_vehicleId_season: {
          routeId: data.routeId,
          vehicleId: data.vehicleId,
          season,
        },
      },
      update: {
        price: Number(data.price),
        currency,
        notes: data.notes,
      },
      create: {
        routeId: data.routeId,
        vehicleId: data.vehicleId,
        price: Number(data.price),
        currency,
        season,
        notes: data.notes,
      },
      include: {
        vehicle: true,
        route: true,
      },
    });
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
      orderBy: [{ country: 'asc' }, { price: 'asc' }],
    });

    if (visas.length === 0) {
      await seedCatalogData(prisma);
      visas = await prisma.visaCatalog.findMany({
        where: includeInactive ? {} : { isActive: true },
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
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
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
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    return prisma.visaCatalog.update({
      where: { id },
      data: updateData,
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

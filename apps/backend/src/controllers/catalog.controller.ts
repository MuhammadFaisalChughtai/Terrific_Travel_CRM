import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/async.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all transport rates
export const getTransportRates = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const rates = await prisma.transportRate.findMany({
    include: {
      vendor: true,
    },
    orderBy: {
      route: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: rates,
  });
});

// Add transport rate
export const addTransportRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { vendorId, route, carPrice, h1Price, gmcPrice, hiacePrice, coasterPrice, busPrice } = req.body;

  const rate = await prisma.transportRate.create({
    data: {
      vendorId,
      route,
      carPrice: Number(carPrice) || 0,
      h1Price: Number(h1Price) || 0,
      gmcPrice: Number(gmcPrice) || 0,
      hiacePrice: Number(hiacePrice) || 0,
      coasterPrice: Number(coasterPrice) || 0,
      busPrice: Number(busPrice) || 0,
    },
    include: {
      vendor: true,
    },
  });

  res.status(201).json({
    success: true,
    data: rate,
  });
});

// Update transport rate
export const updateTransportRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { vendorId, route, carPrice, h1Price, gmcPrice, hiacePrice, coasterPrice, busPrice } = req.body;

  const rate = await prisma.transportRate.update({
    where: { id },
    data: {
      vendorId: vendorId !== undefined ? vendorId : undefined,
      route: route !== undefined ? route : undefined,
      carPrice: carPrice !== undefined ? (Number(carPrice) || 0) : undefined,
      h1Price: h1Price !== undefined ? (Number(h1Price) || 0) : undefined,
      gmcPrice: gmcPrice !== undefined ? (Number(gmcPrice) || 0) : undefined,
      hiacePrice: hiacePrice !== undefined ? (Number(hiacePrice) || 0) : undefined,
      coasterPrice: coasterPrice !== undefined ? (Number(coasterPrice) || 0) : undefined,
      busPrice: busPrice !== undefined ? (Number(busPrice) || 0) : undefined,
    },
    include: {
      vendor: true,
    },
  });

  res.status(200).json({
    success: true,
    data: rate,
  });
});

// Delete transport rate
export const deleteTransportRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  await prisma.transportRate.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    data: { id },
  });
});

// Lookup transport rate template (vendorId + route)
export const lookupTransportRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { vendorId, route } = req.query;

  if (!vendorId || !route) {
    res.status(400).json({
      success: false,
      message: 'Both vendorId and route query parameters are required',
    });
    return;
  }

  const rate = await prisma.transportRate.findFirst({
    where: {
      vendorId: String(vendorId),
      route: {
        equals: String(route),
        mode: 'insensitive',
      },
    },
  });

  res.status(200).json({
    success: true,
    data: rate || null,
  });
});

// GET all visa rates
export const getVisaRates = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const rates = await prisma.visaRate.findMany({
    include: {
      vendor: true,
    },
    orderBy: {
      visaType: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: rates,
  });
});

// Add visa rate
export const addVisaRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { vendorId, visaType, price } = req.body;

  const rate = await prisma.visaRate.create({
    data: {
      vendorId,
      visaType,
      price: Number(price) || 0,
    },
    include: {
      vendor: true,
    },
  });

  res.status(201).json({
    success: true,
    data: rate,
  });
});

// Update visa rate
export const updateVisaRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { vendorId, visaType, price } = req.body;

  const rate = await prisma.visaRate.update({
    where: { id },
    data: {
      vendorId: vendorId !== undefined ? vendorId : undefined,
      visaType: visaType !== undefined ? visaType : undefined,
      price: price !== undefined ? (Number(price) || 0) : undefined,
    },
    include: {
      vendor: true,
    },
  });

  res.status(200).json({
    success: true,
    data: rate,
  });
});

// Delete visa rate
export const deleteVisaRate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  await prisma.visaRate.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    data: { id },
  });
});

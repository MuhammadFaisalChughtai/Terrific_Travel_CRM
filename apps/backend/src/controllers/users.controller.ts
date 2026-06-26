import { Response } from 'express';
import { usersService } from '../services/users.service';
import { asyncHandler } from '../middleware/async.middleware';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const findAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await usersService.findAll(req.query);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const findOne = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await usersService.findOne(id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await usersService.create(req.body, req.user!.id);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const update = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await usersService.update(id, req.body, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const resetPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;
  const result = await usersService.resetPassword(id, password, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getRoles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await usersService.getRoles();
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getPermissions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await usersService.getPermissions();
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateRolePermissions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  const result = await usersService.updateRolePermissions(roleId, permissionIds, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const remove = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const result = await usersService.remove(id, req.user!.id);
  res.status(200).json({
    success: true,
    data: result,
    message: 'User account permanently deleted.',
  });
});

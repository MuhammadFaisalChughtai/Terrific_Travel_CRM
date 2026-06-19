import { Response } from "express";
import { agentsService } from "../services/agents.service";
import { asyncHandler } from "../middleware/async.middleware";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const findAll = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await agentsService.findAll(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const findOne = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await agentsService.findOne(id);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const create = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await agentsService.create(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  },
);

export const update = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await agentsService.update(id, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const deleteAgent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await agentsService.delete(id);
    res.status(200).json({
      success: true,
      data: result,
    });
  },
);

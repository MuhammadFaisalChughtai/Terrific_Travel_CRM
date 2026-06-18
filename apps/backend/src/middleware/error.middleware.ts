import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';

export class HttpException extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof HttpException ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  
  // Format matching NestJS filter output
  const payload: any = {
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.originalUrl || req.url,
    message: err.message || message,
    stack: err.stack,
  };

  // If there are detailed validation errors (e.g. from class-validator)
  if (err.errors) {
    payload.errors = err.errors;
  }

  logger.error(
    `HTTP Error - Path: ${payload.path} | Status: ${statusCode} | Response: ${JSON.stringify(payload)}`
  );

  res.status(statusCode).json(payload);
}

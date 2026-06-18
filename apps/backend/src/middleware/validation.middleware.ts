import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function validationMiddleware(dtoClass: any, value: 'body' | 'query' | 'params' = 'body') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToInstance(dtoClass, req[value]);
    const errors = await validate(input, {
      whitelist: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => {
        return {
          field: err.property,
          errors: err.constraints ? Object.values(err.constraints) : [],
        };
      });

      return res.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: req.originalUrl || req.url,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    req[value] = input;
    next();
  };
}

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: 'Unique constraint violation',
          message: `A record with this ${err.meta?.target} already exists`,
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'Record not found',
          message: 'The requested record does not exist',
        });
        return;
      case 'P2003':
        res.status(400).json({
          success: false,
          error: 'Foreign key constraint failed',
          message: 'Invalid reference to related record',
        });
        return;
      default:
        res.status(400).json({
          success: false,
          error: 'Database error',
          message: err.message,
        });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: 'Invalid data provided',
      message: 'Please check your input data',
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

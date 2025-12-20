import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

// Global Error Handler Middleware
// Catches all errors and returns formatted JSON response
export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // TypeORM specific errors
  if (err.code === '23505') {
    // Unique constraint violation
    statusCode = 400;
    message = 'A record with this value already exists';
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  if (err.code === '22P02') {
    // Invalid input syntax (e.g., invalid UUID)
    statusCode = 400;
    message = 'Invalid input format';
  }

  // JWT errors (in case middleware doesn't catch them)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // TypeORM Query Failed Error
  if (err.name === 'QueryFailedError') {
    statusCode = 400;
    message = process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Database query failed';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

// Not Found Handler (404)
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

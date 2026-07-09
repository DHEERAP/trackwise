import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  value?: unknown;
  errors?: Record<string, { message: string }>;
}

const handleCastError = (err: MongoError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err: MongoError): AppError => {
  const field = Object.keys(err.keyValue ?? {})[0];
  return new AppError(`${field} already exists`, 409);
};

const handleValidationError = (err: MongoError): AppError => {
  const messages = Object.values(err.errors ?? {})
    .map((e) => e.message)
    .join('. ');
  return new AppError(messages, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Token expired. Please log in again.', 401);

export const errorHandler = (
  err: MongoError & { statusCode?: number; isOperational?: boolean },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastError(err) as MongoError;
  if (err.code === 11000) error = handleDuplicateKeyError(err) as MongoError;
  if (err.name === 'ValidationError') error = handleValidationError(err) as MongoError;
  if (err.name === 'JsonWebTokenError') error = handleJWTError() as MongoError;
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError() as MongoError;

  const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
  const message = (error as { isOperational?: boolean }).isOperational
    ? error.message
    : 'Internal server error';

  if (env.isDevelopment && statusCode === 500) {
    console.error('💥 ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDevelopment && { stack: err.stack }),
  });
};

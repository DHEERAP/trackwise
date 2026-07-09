import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types/common.types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  pagination?: PaginationMeta
): void => {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    message,
    ...(data !== undefined && { data }),
    ...(pagination && { pagination }),
  };
  res.status(statusCode).json(response);
};

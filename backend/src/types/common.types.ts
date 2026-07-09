import { Request } from 'express';
import { IUser } from './user.types';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface QueryFilters {
  status?: string;
  priority?: string;
  platform?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  isArchived?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

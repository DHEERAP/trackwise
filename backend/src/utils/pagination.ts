import { PaginationMeta } from '../types/common.types';

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const parsePagination = (
  pageStr?: string,
  limitStr?: string
): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(pageStr ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(limitStr ?? '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

import { AppError } from '../../../utils/AppError';
import { parsePagination, buildPaginationMeta } from '../../../utils/pagination';
import { applicationsRepository } from '../repository/applications.repository';
import { IApplication } from '../../../types/application.types';
import { QueryFilters } from '../../../types/common.types';

export const applicationsService = {
  getAll: async (userId: string, filters: QueryFilters) => {
    const { page, limit, skip } = parsePagination(
      String(filters.page ?? 1),
      String(filters.limit ?? 10)
    );
    const { data, total } = await applicationsRepository.findAll(userId, filters, skip, limit);
    const pagination = buildPaginationMeta(total, page, limit);
    return { applications: data, pagination };
  },

  getById: async (id: string, userId: string) => {
    const application = await applicationsRepository.findById(id, userId);
    if (!application) throw new AppError('Application not found', 404);
    return application;
  },

  create: async (userId: string, data: Partial<IApplication>) => {
    const { Types } = await import('mongoose');
    return applicationsRepository.create({
      ...data,
      userId: new Types.ObjectId(userId),
    } as Partial<IApplication>);
  },

  update: async (id: string, userId: string, data: Partial<IApplication>) => {
    const application = await applicationsRepository.updateById(id, userId, data);
    if (!application) throw new AppError('Application not found', 404);
    return application;
  },

  delete: async (id: string, userId: string) => {
    const application = await applicationsRepository.deleteById(id, userId);
    if (!application) throw new AppError('Application not found', 404);
  },

  archive: async (id: string, userId: string) => {
    const application = await applicationsRepository.archiveById(id, userId, true);
    if (!application) throw new AppError('Application not found', 404);
    return application;
  },

  restore: async (id: string, userId: string) => {
    const application = await applicationsRepository.archiveById(id, userId, false);
    if (!application) throw new AppError('Application not found', 404);
    return application;
  },
};

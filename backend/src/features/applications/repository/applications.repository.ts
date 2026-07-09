import { FilterQuery, SortOrder } from 'mongoose';
import { Application } from '../../../models';
import { IApplication } from '../../../types/application.types';
import { QueryFilters } from '../../../types/common.types';

const buildFilter = (userId: string, filters: QueryFilters): FilterQuery<IApplication> => {
  const query: FilterQuery<IApplication> = {
    userId,
    isArchived: filters.isArchived ?? false,
  };

  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.platform) query.platform = filters.platform;

  if (filters.startDate || filters.endDate) {
    query.appliedDate = {};
    if (filters.startDate) query.appliedDate.$gte = new Date(filters.startDate);
    if (filters.endDate) query.appliedDate.$lte = new Date(filters.endDate);
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return query;
};

const buildSort = (
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Record<string, SortOrder> => ({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

export const applicationsRepository = {
  findAll: async (userId: string, filters: QueryFilters, skip: number, limit: number) => {
    const query = buildFilter(userId, filters);
    const sort = buildSort(filters.sortBy, filters.sortOrder);

    const [data, total] = await Promise.all([
      Application.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Application.countDocuments(query),
    ]);

    return { data, total };
  },

  findById: (id: string, userId: string) =>
    Application.findOne({ _id: id, userId }),

  create: (data: Partial<IApplication>) =>
    Application.create(data),

  updateById: (id: string, userId: string, data: Partial<IApplication>) =>
    Application.findOneAndUpdate(
      { _id: id, userId },
      data,
      { new: true, runValidators: true }
    ),

  deleteById: (id: string, userId: string) =>
    Application.findOneAndDelete({ _id: id, userId }),

  archiveById: (id: string, userId: string, isArchived: boolean) =>
    Application.findOneAndUpdate(
      { _id: id, userId },
      { isArchived },
      { new: true }
    ),

  countByUserId: (userId: string) =>
    Application.countDocuments({ userId, isArchived: false }),

  findUpcomingInterviews: (userId: string, limit = 5) =>
    Application.find({
      userId,
      isArchived: false,
      interviewDate: { $gte: new Date() },
    })
      .sort({ interviewDate: 1 })
      .limit(limit)
      .lean(),

  findFollowUpsDue: (userId: string) =>
    Application.find({
      userId,
      isArchived: false,
      followUpDate: { $lte: new Date() },
      status: { $nin: ['Offer', 'Rejected', 'Withdrawn'] },
    })
      .sort({ followUpDate: 1 })
      .lean(),

  findRecent: (userId: string, limit = 5) =>
    Application.find({ userId, isArchived: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
};

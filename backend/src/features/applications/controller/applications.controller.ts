import { Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { applicationsService } from '../service/applications.service';
import { AuthRequest, QueryFilters } from '../../../types/common.types';
import { HTTP_STATUS } from '../../../constants/http.constants';

export const getApplications = catchAsync(async (req: AuthRequest, res: Response) => {
  const filters: QueryFilters = {
    status: req.query.status as string,
    priority: req.query.priority as string,
    platform: req.query.platform as string,
    search: req.query.search as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    isArchived: req.query.isArchived === 'true',
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
  };

  const { applications, pagination } = await applicationsService.getAll(
    String(req.user!._id),
    filters
  );
  sendResponse(res, HTTP_STATUS.OK, 'Applications fetched', applications, pagination);
});

export const getApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationsService.getById(
    req.params.id,
    String(req.user!._id)
  );
  sendResponse(res, HTTP_STATUS.OK, 'Application fetched', application);
});

export const createApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationsService.create(
    String(req.user!._id),
    req.body
  );
  sendResponse(res, HTTP_STATUS.CREATED, 'Application created', application);
});

export const updateApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationsService.update(
    req.params.id,
    String(req.user!._id),
    req.body
  );
  sendResponse(res, HTTP_STATUS.OK, 'Application updated', application);
});

export const deleteApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  await applicationsService.delete(req.params.id, String(req.user!._id));
  sendResponse(res, HTTP_STATUS.OK, 'Application deleted');
});

export const archiveApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationsService.archive(
    req.params.id,
    String(req.user!._id)
  );
  sendResponse(res, HTTP_STATUS.OK, 'Application archived', application);
});

export const restoreApplication = catchAsync(async (req: AuthRequest, res: Response) => {
  const application = await applicationsService.restore(
    req.params.id,
    String(req.user!._id)
  );
  sendResponse(res, HTTP_STATUS.OK, 'Application restored', application);
});

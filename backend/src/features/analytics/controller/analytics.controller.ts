import { Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { analyticsService } from '../service/analytics.service';
import { AuthRequest } from '../../../types/common.types';
import { HTTP_STATUS } from '../../../constants/http.constants';

export const getAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await analyticsService.getAnalytics(String(req.user!._id));
  sendResponse(res, HTTP_STATUS.OK, 'Analytics fetched', data);
});

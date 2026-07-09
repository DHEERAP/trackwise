import { Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { dashboardService } from '../service/dashboard.service';
import { AuthRequest } from '../../../types/common.types';
import { HTTP_STATUS } from '../../../constants/http.constants';

export const getDashboard = catchAsync(async (req: AuthRequest, res: Response) => {
  const data = await dashboardService.getStats(String(req.user!._id));
  sendResponse(res, HTTP_STATUS.OK, 'Dashboard data fetched', data);
});

import { Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { attachCookie, clearCookie } from '../../../utils/cookie';
import { authService } from '../service/auth.service';
import { AuthRequest } from '../../../types/common.types';
import { HTTP_STATUS } from '../../../constants/http.constants';

export const register = catchAsync(async (req, res: Response) => {
  const { name, email, password } = req.body;
  const { token, user } = await authService.register(name, email, password);
  attachCookie(res, token);
  sendResponse(res, HTTP_STATUS.CREATED, 'Account created successfully', { user, token });
});

export const login = catchAsync(async (req, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await authService.login(email, password);
  attachCookie(res, token);
  sendResponse(res, HTTP_STATUS.OK, 'Logged in successfully', { user, token });
});

export const logout = catchAsync(async (_req, res: Response) => {
  clearCookie(res);
  sendResponse(res, HTTP_STATUS.OK, 'Logged out successfully');
});

export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(String(req.user!._id));
  sendResponse(res, HTTP_STATUS.OK, 'User fetched successfully', { user });
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = await authService.updateProfile(String(req.user!._id), req.body);
  sendResponse(res, HTTP_STATUS.OK, 'Profile updated successfully', { user });
});

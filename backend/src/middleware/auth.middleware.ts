import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';
import { User } from '../models';
import { AuthRequest } from '../types/common.types';

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Support both cookie and Bearer token
    let token: string | undefined;

    if ((req as AuthRequest & { cookies: { jwt?: string } }).cookies?.jwt) {
      token = (req as AuthRequest & { cookies: { jwt?: string } }).cookies.jwt;
    } else if (
      req.headers.authorization?.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required', 401));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    (req as AuthRequest).user = user;
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

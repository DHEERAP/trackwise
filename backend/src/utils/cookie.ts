import { Response } from 'express';
import { env } from '../config/env';

export const attachCookie = (res: Response, token: string): void => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  });
};

export const clearCookie = (res: Response): void => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    expires: new Date(0),
  });
};

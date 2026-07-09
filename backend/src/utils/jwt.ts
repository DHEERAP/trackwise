import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

interface JwtPayload {
  id: string;
}

export const signToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id: id.toString() }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

import { AppError } from '../../../utils/AppError';
import { signToken } from '../../../utils/jwt';
import { authRepository } from '../repository/auth.repository';
import { IUserPublic } from '../../../types/user.types';

const sanitizeUser = (user: { _id: unknown; name: string; email: string; avatar?: string; createdAt: Date }): IUserPublic => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const existing = await authRepository.findByEmail(email);
    if (existing) throw new AppError('An account with this email already exists', 409);

    const user = await authRepository.create({ name, email, password });
    const token = signToken(user._id);
    return { token, user: sanitizeUser(user) };
  },

  login: async (email: string, password: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    const token = signToken(user._id);
    return { token, user: sanitizeUser(user) };
  },

  getMe: async (userId: string) => {
    const user = await authRepository.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    return sanitizeUser(user);
  },

  updateProfile: async (
    userId: string,
    data: { name?: string; email?: string }
  ) => {
    if (data.email) {
      const existing = await authRepository.findByEmail(data.email);
      if (existing && String(existing._id) !== userId) {
        throw new AppError('Email already in use', 409);
      }
    }
    const user = await authRepository.updateById(userId, data);
    if (!user) throw new AppError('User not found', 404);
    return sanitizeUser(user);
  },
};

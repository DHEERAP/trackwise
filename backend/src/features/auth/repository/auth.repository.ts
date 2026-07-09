import { User } from '../../../models';
import { IUser } from '../../../types/user.types';

export const authRepository = {
  findByEmail: (email: string) =>
    User.findOne({ email }).select('+password'),

  findById: (id: string) =>
    User.findById(id),

  create: (data: { name: string; email: string; password: string }) =>
    User.create(data),

  updateById: (id: string, data: Partial<Pick<IUser, 'name' | 'email' | 'avatar'>>) =>
    User.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
};

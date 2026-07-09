import { apiClient } from '@/lib/apiClient';
import { ApiResponse, User } from '@/types';

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }
export interface AuthResponseData { user: User; token: string }

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    return data.data!;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    return data.data!;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data!.user;
  },

  updateProfile: async (payload: Partial<Pick<User, 'name' | 'email'>>) => {
    const { data } = await apiClient.patch<ApiResponse<{ user: User }>>('/auth/me', payload);
    return data.data!.user;
  },
};

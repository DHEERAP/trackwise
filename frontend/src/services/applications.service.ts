import { apiClient } from '@/lib/apiClient';
import { ApiResponse, Application, ApplicationFormData, ApplicationFilters, PaginationMeta } from '@/types';

export const applicationsService = {
  getAll: async (filters: ApplicationFilters = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const { data } = await apiClient.get<ApiResponse<Application[]>>('/applications', { params });
    return { applications: data.data ?? [], pagination: data.pagination as PaginationMeta };
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Application>>(`/applications/${id}`);
    return data.data!;
  },

  create: async (payload: ApplicationFormData) => {
    const { data } = await apiClient.post<ApiResponse<Application>>('/applications', payload);
    return data.data!;
  },

  update: async (id: string, payload: Partial<ApplicationFormData>) => {
    const { data } = await apiClient.patch<ApiResponse<Application>>(`/applications/${id}`, payload);
    return data.data!;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/applications/${id}`);
  },

  archive: async (id: string) => {
    const { data } = await apiClient.patch<ApiResponse<Application>>(`/applications/${id}/archive`);
    return data.data!;
  },

  restore: async (id: string) => {
    const { data } = await apiClient.patch<ApiResponse<Application>>(`/applications/${id}/restore`);
    return data.data!;
  },
};

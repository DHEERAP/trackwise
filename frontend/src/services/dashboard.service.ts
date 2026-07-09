import { apiClient } from '@/lib/apiClient';
import { ApiResponse, DashboardData, AnalyticsData } from '@/types';

export const dashboardService = {
  getDashboard: async () => {
    const { data } = await apiClient.get<ApiResponse<DashboardData>>('/dashboard');
    return data.data!;
  },
};

export const analyticsService = {
  getAnalytics: async () => {
    const { data } = await apiClient.get<ApiResponse<AnalyticsData>>('/analytics');
    return data.data!;
  },
};

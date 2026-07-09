import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/dashboard.service';
import { QUERY_KEYS } from '@/constants';

export const useAnalytics = () =>
  useQuery({
    queryKey: QUERY_KEYS.ANALYTICS,
    queryFn: analyticsService.getAnalytics,
    staleTime: 1000 * 60 * 10, // 10 minutes — analytics changes infrequently
  });

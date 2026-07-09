import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { applicationsService } from '@/services/applications.service';
import { QUERY_KEYS } from '@/constants';

export const usePrefetchApplication = () => {
  const qc = useQueryClient();

  return useCallback((id: string) => {
    qc.prefetchQuery({
      queryKey: QUERY_KEYS.APPLICATION(id),
      queryFn: () => applicationsService.getById(id),
      staleTime: 1000 * 60 * 2,
    });
  }, [qc]);
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsService } from '@/services/applications.service';
import { QUERY_KEYS } from '@/constants';
import type { ApplicationFilters, ApplicationFormData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/error.utils';

export const useApplications = (filters: ApplicationFilters) =>
  useQuery({
    queryKey: [...QUERY_KEYS.APPLICATIONS, filters],
    queryFn: () => applicationsService.getAll(filters),
  });

export const useApplication = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.APPLICATION(id),
    queryFn: () => applicationsService.getById(id),
    enabled: !!id,
  });

export const useCreateApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplicationFormData) => applicationsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      toast.success('Application created successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useUpdateApplication = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ApplicationFormData>) => applicationsService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATION(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      toast.success('Application updated');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useDeleteApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      toast.success('Application deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

export const useArchiveApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) =>
      isArchived ? applicationsService.restore(id) : applicationsService.archive(id),
    onSuccess: (_data, { isArchived }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
      toast.success(isArchived ? 'Application restored' : 'Application archived');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
};

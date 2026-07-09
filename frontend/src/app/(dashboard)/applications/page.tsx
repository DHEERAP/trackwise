'use client';

import { useState, useCallback, memo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Briefcase, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Pagination } from '@/components/shared/Pagination';
import { TableRowSkeleton } from '@/components/shared/Skeletons';
import { ApplicationsTable } from '@/components/applications/ApplicationsTable';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { DeleteConfirm } from '@/components/applications/DeleteConfirm';
import { FiltersBar } from '@/components/applications/FiltersBar';
import {
  useApplications, useCreateApplication, useUpdateApplication,
  useDeleteApplication, useArchiveApplication,
} from '@/hooks/useApplications';
import { applicationsService } from '@/services/applications.service';
import { getErrorMessage } from '@/utils/error.utils';
import { QUERY_KEYS } from '@/constants';
import type { Application, ApplicationFilters, ApplicationFormData } from '@/types';
import type { ApplicationStatus } from '@/constants';

const DEFAULT_FILTERS: ApplicationFilters = {
  page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc', isArchived: false,
};

export default function ApplicationsPage() {
  const [filters, setFilters] = useState<ApplicationFilters>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useApplications({
    ...filters,
    isArchived: showArchived,
  });

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication(editTarget?._id ?? '');
  const deleteMutation = useDeleteApplication();
  const archiveMutation = useArchiveApplication();

  const handleStatusChange = useCallback(async (id: string, status: ApplicationStatus) => {
    await applicationsService.update(id, { status });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.APPLICATIONS });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
  }, [queryClient]);

  const handleCreate = useCallback(async (formData: ApplicationFormData) => {
    await createMutation.mutateAsync(formData);
  }, [createMutation]);

  const handleUpdate = useCallback(async (formData: ApplicationFormData) => {
    if (!editTarget) return;
    await updateMutation.mutateAsync(formData);
    setEditTarget(null);
  }, [editTarget, updateMutation]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget._id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteMutation]);

  const handleEdit = useCallback((app: Application) => {
    setEditTarget(app);
    setFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setFormOpen(false);
    setEditTarget(null);
  }, []);

  const handleFiltersReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Applications"
        description="Track and manage all your job applications"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived((p) => !p)}
              className="gap-2"
            >
              <Archive className="h-4 w-4" />
              {showArchived ? 'Active' : 'Archived'}
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> New Application
            </Button>
          </div>
        }
      />

      <FiltersBar
        filters={filters}
        onChange={setFilters}
        onReset={handleFiltersReset}
      />

      {isError && (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      )}

      {isLoading ? (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={8} />
              ))}
            </tbody>
          </table>
        </div>
      ) : !isError && data?.applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={showArchived ? 'No archived applications' : 'No applications yet'}
          description={
            showArchived
              ? 'Archived applications will appear here.'
              : 'Start tracking your job search by adding your first application.'
          }
          actionLabel={showArchived ? undefined : 'Add Application'}
          onAction={showArchived ? undefined : () => setFormOpen(true)}
        />
      ) : (
        <>
          <ApplicationsTable
            applications={data?.applications ?? []}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onArchive={(app) =>
              archiveMutation.mutate({ id: app._id, isArchived: app.isArchived })
            }
            onStatusChange={handleStatusChange}
          />
          {data?.pagination && (
            <Pagination
              pagination={data.pagination}
              onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
            />
          )}
        </>
      )}

      {/* Create / Edit Form */}
      <ApplicationForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editTarget ? handleUpdate : handleCreate}
        defaultValues={editTarget ?? undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirm */}
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

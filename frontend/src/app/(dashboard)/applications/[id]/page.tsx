'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Pencil, Trash2, Archive, RotateCcw,
  MapPin, DollarSign, ExternalLink, User, Mail,
  Calendar, Bell, FileText, StickyNote, Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import { ErrorState } from '@/components/shared/ErrorState';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { DeleteConfirm } from '@/components/applications/DeleteConfirm';
import {
  useApplication, useUpdateApplication,
  useDeleteApplication, useArchiveApplication,
} from '@/hooks/useApplications';
import { formatDate, formatRelative } from '@/utils/date.utils';
import { ROUTES } from '@/constants';
import { getErrorMessage } from '@/utils/error.utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApplicationFormData } from '@/types';

const DetailRow = ({ icon: Icon, label, value, href }: {
  icon: typeof MapPin; label: string; value?: string | null; href?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 rounded-md bg-muted p-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1 truncate">
            {value} <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <p className="text-sm font-medium truncate">{value}</p>
        )}
      </div>
    </div>
  );
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: app, isLoading, isError, error, refetch } = useApplication(params.id);
  const updateMutation = useUpdateApplication(params.id);
  const deleteMutation = useDeleteApplication();
  const archiveMutation = useArchiveApplication();

  const handleUpdate = async (data: ApplicationFormData) => {
    await updateMutation.mutateAsync(data);
    setEditOpen(false);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(params.id);
    router.replace(ROUTES.APPLICATIONS);
  };

  if (isLoading) return <DetailSkeleton />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  if (!app) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => archiveMutation.mutate({ id: app._id, isArchived: app.isArchived })}
            disabled={archiveMutation.isPending}
            className="gap-2"
          >
            {app.isArchived
              ? <><RotateCcw className="h-4 w-4" /> Restore</>
              : <><Archive className="h-4 w-4" /> Archive</>
            }
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="gap-2">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{app.company}</h1>
                <p className="text-muted-foreground">{app.role}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <StatusBadge status={app.status} />
                  <PriorityBadge priority={app.priority} />
                  {app.isArchived && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                      Archived
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground shrink-0">
              Added {formatRelative(app.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow icon={MapPin} label="Location" value={app.location} />
            <DetailRow icon={DollarSign} label="Salary" value={app.salary} />
            <DetailRow icon={ExternalLink} label="Job URL" value={app.jobUrl} href={app.jobUrl} />
            <DetailRow icon={Building2} label="Platform" value={app.platform} />
            <DetailRow icon={FileText} label="Resume Version" value={app.resumeVersion} />
          </CardContent>
        </Card>

        {/* Recruiter */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recruiter
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow icon={User} label="Name" value={app.recruiterName} />
            <DetailRow
              icon={Mail}
              label="Email"
              value={app.recruiterEmail}
              href={app.recruiterEmail ? `mailto:${app.recruiterEmail}` : undefined}
            />
            {!app.recruiterName && !app.recruiterEmail && (
              <p className="py-4 text-sm text-muted-foreground">No recruiter info added.</p>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow icon={Calendar} label="Applied Date" value={formatDate(app.appliedDate)} />
            <DetailRow icon={Calendar} label="Interview Date" value={formatDate(app.interviewDate)} />
            <DetailRow icon={Bell} label="Follow-up Date" value={formatDate(app.followUpDate)} />
            <DetailRow icon={Calendar} label="Last Updated" value={formatDate(app.updatedAt)} />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {app.notes ? (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{app.notes}</p>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground py-2">
                <StickyNote className="h-4 w-4" />
                <p className="text-sm">No notes added yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit form */}
      <ApplicationForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        defaultValues={app}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete confirm */}
      <DeleteConfirm
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </motion.div>
  );
}

const DetailSkeleton = () => (
  <div className="space-y-6 max-w-4xl">
    <Skeleton className="h-9 w-24" />
    <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-8 w-full" />)}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

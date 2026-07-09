import { cn } from '@/lib/utils';
import { STATUS_COLORS, PRIORITY_COLORS } from '@/constants';
import type { ApplicationStatus, ApplicationPriority } from '@/constants';

export const StatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS_COLORS[status])}>
    {status}
  </span>
);

export const PriorityBadge = ({ priority }: { priority: ApplicationPriority }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', PRIORITY_COLORS[priority])}>
    {priority}
  </span>
);

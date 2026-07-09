'use client';

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { APPLICATION_STATUS, STATUS_COLORS } from '@/constants';
import type { ApplicationStatus } from '@/constants';
import { cn } from '@/lib/utils';

interface InlineStatusProps {
  status: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

export const InlineStatusSelect = ({ status, onChange, disabled }: InlineStatusProps) => (
  <Select
    value={status}
    onValueChange={(v) => onChange(v as ApplicationStatus)}
    disabled={disabled}
  >
    <SelectTrigger
      className={cn(
        'h-7 w-auto border-0 px-2.5 py-0.5 text-xs font-semibold rounded-full focus:ring-1',
        STATUS_COLORS[status]
      )}
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {APPLICATION_STATUS.map((s) => (
        <SelectItem key={s} value={s}>
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold', STATUS_COLORS[s])}>
            {s}
          </span>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

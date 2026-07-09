'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APPLICATION_STATUS, STATUS_COLORS } from '@/constants';
import type { ApplicationStatus } from '@/constants';
import { cn } from '@/lib/utils';

export const StatusPipeline = ({ byStatus }: { byStatus: Record<string, number> }) => {
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pipeline Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {APPLICATION_STATUS.map((status) => {
          const count = byStatus[status] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 font-medium', STATUS_COLORS[status as ApplicationStatus])}>
                  {status}
                </span>
                <span className="font-semibold tabular-nums">{count}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

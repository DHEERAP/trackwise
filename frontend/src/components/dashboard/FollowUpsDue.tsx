'use client';

import Link from 'next/link';
import { Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate } from '@/utils/date.utils';
import { ROUTES } from '@/constants';
import type { Application } from '@/types';

export const FollowUpsDue = ({ followUps }: { followUps: Application[] }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="text-base flex items-center gap-2">
        Follow-ups Due
        {followUps.length > 0 && (
          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            {followUps.length}
          </span>
        )}
      </CardTitle>
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.APPLICATIONS}>
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </CardHeader>
    <CardContent className="p-0">
      {followUps.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No follow-ups due"
          description="You're all caught up!"
        />
      ) : (
        <ul className="divide-y">
          {followUps.map((app, i) => (
            <motion.li
              key={app._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={ROUTES.APPLICATION_DETAIL(app._id)}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{app.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.role}</p>
                </div>
                <div className="ml-4 flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-destructive font-medium">
                    Due {formatDate(app.followUpDate)}
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);

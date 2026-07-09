'use client';

import Link from 'next/link';
import { Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatRelative } from '@/utils/date.utils';
import { ROUTES } from '@/constants';
import type { Application } from '@/types';

export const RecentApplications = ({ applications }: { applications: Application[] }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-3">
      <CardTitle className="text-base">Recent Applications</CardTitle>
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.APPLICATIONS}>
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </CardHeader>
    <CardContent className="p-0">
      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Start tracking your job applications."
        />
      ) : (
        <ul className="divide-y">
          {applications.map((app, i) => (
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
                  <span className="text-xs text-muted-foreground">
                    {formatRelative(app.createdAt)}
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Pencil, Trash2, Archive, RotateCcw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge, PriorityBadge } from '@/components/shared/StatusBadge';
import { InlineStatusSelect } from '@/components/applications/InlineStatusSelect';
import { formatDate } from '@/utils/date.utils';
import { ROUTES } from '@/constants';
import { usePrefetchApplication } from '@/hooks/usePrefetchApplication';
import type { Application } from '@/types';
import type { ApplicationStatus } from '@/constants';

interface ApplicationsTableProps {
  applications: Application[];
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
  onArchive: (app: Application) => void;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}

export const ApplicationsTable = ({
  applications, onEdit, onDelete, onArchive, onStatusChange,
}: ApplicationsTableProps) => {
  const prefetch = usePrefetchApplication();
  return (
  <div className="overflow-x-auto rounded-xl border">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted/40">
          {['Company', 'Role', 'Status', 'Priority', 'Applied', 'Interview', 'Platform', ''].map((h) => (
            <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <AnimatePresence>
          {applications.map((app, i) => (
            <motion.tr
              key={app._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              onMouseEnter={() => prefetch(app._id)}
            >
              <td className="px-4 py-3 font-medium">
                <Link
                  href={ROUTES.APPLICATION_DETAIL(app._id)}
                  className="hover:text-primary transition-colors"
                >
                  {app.company}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">{app.role}</td>
              <td className="px-4 py-3">
                {onStatusChange ? (
                  <InlineStatusSelect
                    status={app.status}
                    onChange={(s) => onStatusChange(app._id, s)}
                  />
                ) : (
                  <StatusBadge status={app.status} />
                )}
              </td>
              <td className="px-4 py-3"><PriorityBadge priority={app.priority} /></td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(app.appliedDate)}</td>
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(app.interviewDate)}</td>
              <td className="px-4 py-3 text-muted-foreground">{app.platform ?? '—'}</td>
              <td className="px-4 py-3">
                <RowActions app={app} onEdit={onEdit} onDelete={onDelete} onArchive={onArchive} />
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  </div>
  );
};

const RowActions = ({ app, onEdit, onDelete, onArchive }: {
  app: Application;
  onEdit: (a: Application) => void;
  onDelete: (a: Application) => void;
  onArchive: (a: Application) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem asChild>
        <Link href={ROUTES.APPLICATION_DETAIL(app._id)}>
          <ExternalLink className="mr-2 h-4 w-4" /> View Details
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onEdit(app)}>
        <Pencil className="mr-2 h-4 w-4" /> Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => onArchive(app)}>
        {app.isArchived
          ? <><RotateCcw className="mr-2 h-4 w-4" /> Restore</>
          : <><Archive className="mr-2 h-4 w-4" /> Archive</>
        }
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => onDelete(app)}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

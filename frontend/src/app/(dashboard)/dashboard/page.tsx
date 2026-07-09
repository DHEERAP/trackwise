'use client';

import { Briefcase, TrendingUp, Calendar, Trophy, XCircle, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/auth.store';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { FollowUpsDue } from '@/components/dashboard/FollowUpsDue';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { StatusPipeline } from '@/components/dashboard/StatusPipeline';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';
import { getErrorMessage } from '@/utils/error.utils';

const STAT_CARDS = [
  {
    key: 'total' as const,
    title: 'Total Applications',
    description: 'All time',
    icon: Briefcase,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    key: 'active' as const,
    title: 'Active',
    description: 'In progress',
    icon: TrendingUp,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
  },
  {
    key: 'upcomingInterviewsCount' as const,
    title: 'Interviews',
    description: 'Upcoming',
    icon: Calendar,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    key: 'offers' as const,
    title: 'Offers',
    description: 'Received',
    icon: Trophy,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    key: 'rejected' as const,
    title: 'Rejected',
    description: 'Total rejections',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    key: 'followUpsDueCount' as const,
    title: 'Follow-ups Due',
    description: 'Need attention',
    icon: Bell,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  const { stats, upcomingInterviews, followUpsDue, recentApplications } = data!;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your job search today.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map((card, i) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={stats[card.key]}
            description={card.description}
            icon={card.icon}
            iconColor={card.iconColor}
            iconBg={card.iconBg}
            index={i}
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingInterviews interviews={upcomingInterviews} />
          <RecentApplications applications={recentApplications} />
        </div>

        {/* Right col — 1/3 width */}
        <div className="space-y-6">
          <QuickActions />
          <FollowUpsDue followUps={followUpsDue} />
          <StatusPipeline byStatus={stats.byStatus} />
        </div>
      </div>
    </div>
  );
}

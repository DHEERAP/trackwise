'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorState } from '@/components/shared/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getErrorMessage } from '@/utils/error.utils';
import { MONTH_NAMES } from '@/utils/date.utils';

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(m => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => ({ default: m.Legend })), { ssr: false });

const PIE_COLORS = [
  '#7c3aed', '#3b82f6', '#f59e0b', '#10b981',
  '#ef4444', '#8b5cf6', '#06b6d4', '#f97316',
];

const RateCard = ({ title, value, description, icon: Icon, color }: {
  title: string; value: string; description: string;
  icon: typeof TrendingUp; color: string;
}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AnalyticsPage() {
  const { data, isLoading, isError, error, refetch } = useAnalytics();

  if (isLoading) return <AnalyticsSkeleton />;
  if (isError) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  if (!data) return null;

  const { applicationsPerMonth, statusDistribution, platformDistribution, rates } = data;

  const monthlyChartData = applicationsPerMonth.map((d) => ({
    name: `${MONTH_NAMES[d.month - 1]} ${d.year}`,
    Applications: d.count,
  }));

  const statusChartData = statusDistribution.map((d) => ({
    name: d.status,
    value: d.count,
  }));

  const platformChartData = platformDistribution.map((d) => ({
    name: d.platform,
    Applications: d.count,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Insights into your job search performance"
      />

      {/* Rate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RateCard
          title="Total Applications"
          value={String(rates.total)}
          description="All time"
          icon={BarChart3}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <RateCard
          title="Interview Rate"
          value={`${rates.interviewRate}%`}
          description="Applications → Interview"
          icon={TrendingUp}
          color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
        />
        <RateCard
          title="Offer Rate"
          value={`${rates.offerRate}%`}
          description="Applications → Offer"
          icon={Award}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
      </div>

      {/* Monthly bar chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Applications per Month</CardTitle>
            <CardDescription>Your application volume over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="Applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Status + Platform charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status pie */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Breakdown of applications by current status</CardDescription>
            </CardHeader>
            <CardContent>
              {statusChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusChartData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs text-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Platform bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Applications by Platform</CardTitle>
              <CardDescription>Where you're finding opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              {platformChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">No platform data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={platformChartData}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="Applications" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-40" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
      ))}
    </div>
    <Card><CardContent className="p-6"><Skeleton className="h-72 w-full" /></CardContent></Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}><CardContent className="p-6"><Skeleton className="h-72 w-full" /></CardContent></Card>
      ))}
    </div>
  </div>
);

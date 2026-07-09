'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  index?: number;
}

export const StatCard = ({
  title, value, description, icon: Icon, iconColor, iconBg, index = 0,
}: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.07 }}
  >
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight"><AnimatedCounter value={value} /></p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={cn('rounded-xl p-2.5', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

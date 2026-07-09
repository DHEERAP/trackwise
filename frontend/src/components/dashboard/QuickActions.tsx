'use client';

import { useRouter } from 'next/navigation';
import { Plus, Search, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

const ACTIONS = [
  { label: 'New Application', icon: Plus, href: ROUTES.APPLICATIONS, variant: 'default' as const },
  { label: 'Search Jobs', icon: Search, href: ROUTES.APPLICATIONS, variant: 'outline' as const },
  { label: 'View Analytics', icon: BarChart3, href: ROUTES.ANALYTICS, variant: 'outline' as const },
  { label: 'Settings', icon: Settings, href: ROUTES.SETTINGS, variant: 'outline' as const },
];

export const QuickActions = () => {
  const router = useRouter();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {ACTIONS.map(({ label, icon: Icon, href, variant }) => (
          <Button
            key={label}
            variant={variant}
            className="justify-start gap-2 h-10"
            onClick={() => router.push(href)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

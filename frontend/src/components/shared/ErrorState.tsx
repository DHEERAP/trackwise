import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="rounded-full bg-destructive/10 p-4 mb-4">
      <AlertCircle className="h-8 w-8 text-destructive" />
    </div>
    <h3 className="text-lg font-semibold mb-1">Error</h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
    {onRetry && <Button variant="outline" onClick={onRetry}>Try Again</Button>}
  </div>
);

'use client';

import { Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const DeleteConfirm = ({
  open, onClose, onConfirm, isLoading,
  title = 'Delete Application',
  description = 'This action cannot be undone. The application will be permanently deleted.',
}: DeleteConfirmProps) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-md" aria-describedby="delete-description">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription id="delete-description">{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date?: string | Date | null): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, 'MMM d, yyyy') : '—';
};

export const formatRelative = (date?: string | Date | null): string => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—';
};

export const toInputDate = (date?: string | null): string => {
  if (!date) return '';
  const d = parseISO(date);
  return isValid(d) ? format(d, 'yyyy-MM-dd') : '';
};

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const APPLICATION_STATUS = [
  'Wishlist',
  'Applied',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
] as const;

export const APPLICATION_PRIORITY = ['Low', 'Medium', 'High'] as const;

export const APPLICATION_PLATFORM = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'AngelList',
  'Company Website',
  'Referral',
  'Naukri',
  'Internshala',
  'Other',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[number];
export type ApplicationPriority = (typeof APPLICATION_PRIORITY)[number];
export type ApplicationPlatform = (typeof APPLICATION_PLATFORM)[number];

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Wishlist: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Online Assessment': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Technical Interview': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'HR Interview': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Offer: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Withdrawn: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export const PRIORITY_COLORS: Record<ApplicationPriority, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt:desc' },
  { label: 'Oldest First', value: 'createdAt:asc' },
  { label: 'Company A–Z', value: 'company:asc' },
  { label: 'Company Z–A', value: 'company:desc' },
  { label: 'Upcoming Interview', value: 'interviewDate:asc' },
] as const;

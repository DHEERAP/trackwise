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

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: (id: string) => `/applications/${id}`,
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const QUERY_KEYS = {
  DASHBOARD: ['dashboard'],
  APPLICATIONS: ['applications'],
  APPLICATION: (id: string) => ['applications', id],
  ANALYTICS: ['analytics'],
  ME: ['me'],
} as const;

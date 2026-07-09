import { ApplicationStatus, ApplicationPriority, ApplicationPlatform } from '../constants';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Application {
  _id: string;
  userId: string;
  company: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  platform?: ApplicationPlatform;
  recruiterName?: string;
  recruiterEmail?: string;
  appliedDate?: string;
  interviewDate?: string;
  followUpDate?: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  resumeVersion?: string;
  notes?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  platform?: ApplicationPlatform;
  recruiterName?: string;
  recruiterEmail?: string;
  appliedDate?: string;
  interviewDate?: string;
  followUpDate?: string;
  status?: ApplicationStatus;
  priority?: ApplicationPriority;
  resumeVersion?: string;
  notes?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: { field?: string; message: string }[];
  pagination?: PaginationMeta;
}

export interface DashboardStats {
  total: number;
  active: number;
  upcomingInterviewsCount: number;
  offers: number;
  rejected: number;
  followUpsDueCount: number;
  byStatus: Record<string, number>;
}

export interface DashboardData {
  stats: DashboardStats;
  upcomingInterviews: Application[];
  followUpsDue: Application[];
  recentApplications: Application[];
}

export interface AnalyticsData {
  applicationsPerMonth: { year: number; month: number; count: number }[];
  statusDistribution: { status: string; count: number }[];
  platformDistribution: { platform: string; count: number }[];
  rates: { total: number; offerRate: number; interviewRate: number };
}

export interface ApplicationFilters {
  search?: string;
  status?: string;
  priority?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  isArchived?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

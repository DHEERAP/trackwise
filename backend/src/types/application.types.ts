import { Document, Types } from 'mongoose';
import {
  ApplicationStatus,
  ApplicationPriority,
  ApplicationPlatform,
} from '../constants/application.constants';

export interface IApplication extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  // Core fields
  company: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  platform?: ApplicationPlatform;

  // Recruiter
  recruiterName?: string;
  recruiterEmail?: string;

  // Dates
  appliedDate?: Date;
  interviewDate?: Date;
  followUpDate?: Date;

  // Tracking
  status: ApplicationStatus;
  priority: ApplicationPriority;
  resumeVersion?: string;
  notes?: string;

  // Soft delete / archive
  isArchived: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog {
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: Date;
}

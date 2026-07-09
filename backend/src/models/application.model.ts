import mongoose, { Schema } from 'mongoose';
import { IApplication, IActivityLog } from '../types/application.types';
import {
  APPLICATION_STATUS,
  APPLICATION_PRIORITY,
  APPLICATION_PLATFORM,
} from '../constants/application.constants';

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    field: { type: String },
    oldValue: { type: String },
    newValue: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    salary: {
      type: String,
      trim: true,
      maxlength: [50, 'Salary cannot exceed 50 characters'],
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    platform: {
      type: String,
      enum: APPLICATION_PLATFORM,
    },
    recruiterName: {
      type: String,
      trim: true,
      maxlength: [100, 'Recruiter name cannot exceed 100 characters'],
    },
    recruiterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid recruiter email'],
    },
    appliedDate: { type: Date },
    interviewDate: { type: Date },
    followUpDate: { type: Date },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: 'Wishlist',
      required: true,
    },
    priority: {
      type: String,
      enum: APPLICATION_PRIORITY,
      default: 'Medium',
      required: true,
    },
    resumeVersion: {
      type: String,
      trim: true,
      maxlength: [50, 'Resume version cannot exceed 50 characters'],
    },
    notes: {
      type: String,
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for common query patterns
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, isArchived: 1 });
applicationSchema.index({ userId: 1, followUpDate: 1 });
applicationSchema.index({ userId: 1, interviewDate: 1 });

// Text index for search
applicationSchema.index(
  { company: 'text', role: 'text', recruiterName: 'text' },
  { weights: { company: 3, role: 2, recruiterName: 1 } }
);

export const Application = mongoose.model<IApplication>(
  'Application',
  applicationSchema
);

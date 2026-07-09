import { body, query } from 'express-validator';
import {
  APPLICATION_STATUS,
  APPLICATION_PRIORITY,
  APPLICATION_PLATFORM,
} from '../../../constants/application.constants';

export const createApplicationValidation = [
  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isLength({ max: 100 }).withMessage('Role cannot exceed 100 characters'),

  body('status')
    .optional()
    .isIn(APPLICATION_STATUS).withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(APPLICATION_PRIORITY).withMessage('Invalid priority value'),

  body('platform')
    .optional()
    .isIn(APPLICATION_PLATFORM).withMessage('Invalid platform value'),

  body('recruiterEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Invalid recruiter email'),

  body('jobUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid job URL'),

  body('appliedDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid applied date'),

  body('interviewDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid interview date'),

  body('followUpDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid follow-up date'),

  body('notes')
    .optional()
    .isLength({ max: 5000 }).withMessage('Notes cannot exceed 5000 characters'),
];

export const updateApplicationValidation = [
  body('company')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Company name must be 1–100 characters'),

  body('role')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Role must be 1–100 characters'),

  body('status')
    .optional()
    .isIn(APPLICATION_STATUS).withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(APPLICATION_PRIORITY).withMessage('Invalid priority value'),

  body('platform')
    .optional()
    .isIn(APPLICATION_PLATFORM).withMessage('Invalid platform value'),

  body('recruiterEmail')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Invalid recruiter email'),

  body('jobUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Invalid job URL'),

  body('appliedDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid applied date'),

  body('interviewDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid interview date'),

  body('followUpDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Invalid follow-up date'),

  body('notes')
    .optional()
    .isLength({ max: 5000 }).withMessage('Notes cannot exceed 5000 characters'),
];

export const listApplicationsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
  query('status').optional().isIn(APPLICATION_STATUS).withMessage('Invalid status'),
  query('priority').optional().isIn(APPLICATION_PRIORITY).withMessage('Invalid priority'),
  query('platform').optional().isIn(APPLICATION_PLATFORM).withMessage('Invalid platform'),
  query('sortBy').optional().isIn(['createdAt', 'company', 'role', 'interviewDate', 'appliedDate']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
];

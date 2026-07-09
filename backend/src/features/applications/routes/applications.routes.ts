import { Router } from 'express';
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  archiveApplication,
  restoreApplication,
} from '../controller/applications.controller';
import {
  createApplicationValidation,
  updateApplicationValidation,
  listApplicationsValidation,
} from '../validation/applications.validation';
import { validate } from '../../../middleware/validate.middleware';
import { protect } from '../../../middleware/auth.middleware';

export const applicationsRouter = Router();

applicationsRouter.use(protect);

applicationsRouter
  .route('/')
  .get(listApplicationsValidation, validate, getApplications)
  .post(createApplicationValidation, validate, createApplication);

applicationsRouter
  .route('/:id')
  .get(getApplication)
  .patch(updateApplicationValidation, validate, updateApplication)
  .delete(deleteApplication);

applicationsRouter.patch('/:id/archive', archiveApplication);
applicationsRouter.patch('/:id/restore', restoreApplication);

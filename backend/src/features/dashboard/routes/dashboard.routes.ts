import { Router } from 'express';
import { getDashboard } from '../controller/dashboard.controller';
import { protect } from '../../../middleware/auth.middleware';

export const dashboardRouter = Router();

dashboardRouter.use(protect);
dashboardRouter.get('/', getDashboard);

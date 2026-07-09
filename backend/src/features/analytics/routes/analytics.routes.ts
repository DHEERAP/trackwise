import { Router } from 'express';
import { getAnalytics } from '../controller/analytics.controller';
import { protect } from '../../../middleware/auth.middleware';

export const analyticsRouter = Router();

analyticsRouter.use(protect);
analyticsRouter.get('/', getAnalytics);

import { Router } from 'express';
import { authRouter } from './auth/routes/auth.routes';
import { applicationsRouter } from './applications/routes/applications.routes';
import { dashboardRouter } from './dashboard/routes/dashboard.routes';
import { analyticsRouter } from './analytics/routes/analytics.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/applications', applicationsRouter);
apiRouter.use('/dashboard', dashboardRouter);
apiRouter.use('/analytics', analyticsRouter);

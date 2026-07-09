import { Router } from 'express';
import { register, login, logout, getMe, updateProfile } from '../controller/auth.controller';
import { registerValidation, loginValidation, updateProfileValidation } from '../validation/auth.validation';
import { validate } from '../../../middleware/validate.middleware';
import { protect } from '../../../middleware/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', registerValidation, validate, register);
authRouter.post('/login', loginValidation, validate, login);
authRouter.post('/logout', protect, logout);
authRouter.get('/me', protect, getMe);
authRouter.patch('/me', protect, updateProfileValidation, validate, updateProfile);

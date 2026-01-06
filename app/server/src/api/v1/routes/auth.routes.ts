import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { auth } from '../../../middlewares/auth.middleware';


const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/heartbeat', auth, authController.heartbeat);

export default router;

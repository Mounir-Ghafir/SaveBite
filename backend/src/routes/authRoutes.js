import { Router } from 'express';
import { registerHandler, loginHandler } from '../controllers/authController.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);

export default router;

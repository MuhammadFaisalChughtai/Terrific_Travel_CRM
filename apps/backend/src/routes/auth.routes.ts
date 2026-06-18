import { Router } from 'express';
import { register, login, refresh, logout, verifyEmail } from '../controllers/auth.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { RegisterDto } from '../dto/auth/register.dto';
import { LoginDto } from '../dto/auth/login.dto';

const router = Router();

router.post('/register', validationMiddleware(RegisterDto), register);
router.post('/login', validationMiddleware(LoginDto), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify', verifyEmail);

export default router;

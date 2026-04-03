import { Router } from 'express';
import { login, logout, me, refresh,seedAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', authMiddleware, logout);
router.get('/auth/me', authMiddleware, me);
router.post('/register-admin-seed', seedAdmin);

export default router;
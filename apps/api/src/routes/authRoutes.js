import { Router } from 'express';
import { login, logout, me, refresh,seedAdmin } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);
router.post('/register-admin-seed', seedAdmin);

export default router;
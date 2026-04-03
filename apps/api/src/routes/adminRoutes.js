import { Router } from 'express';
import { pingAdmin } from '../controllers/adminController.js';
import { authMiddleware, requirePermissions } from '../middleware/auth.js';

const router = Router();

router.get('/admin/ping', authMiddleware, requirePermissions('admin:manage'), pingAdmin);

export default router;

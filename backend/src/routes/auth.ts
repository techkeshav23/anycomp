import { Router } from 'express';
import { login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Admin login only (no signup - admins created via script)
router.post('/login', login);

// Get current admin info
router.get('/me', protect, getMe);

export default router;

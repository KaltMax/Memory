import { Hono } from 'hono';
import { register, login, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const authRoutes = new Hono();

// Public routes - no authentication required
authRoutes.post('/register', register);
authRoutes.post('/login', login);

// Protected route - requires valid JWT token
authRoutes.get('/verify', authenticateToken, verifyToken);

export default authRoutes;

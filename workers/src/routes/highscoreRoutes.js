import { Hono } from 'hono';
import { getHighscores, addHighscore } from '../controllers/highscoreController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const highscoreRoutes = new Hono();

// Public route - get highscores
highscoreRoutes.get('/', getHighscores);

// Protected route - add highscore (requires authentication)
highscoreRoutes.post('/', authenticateToken, addHighscore);

export default highscoreRoutes;

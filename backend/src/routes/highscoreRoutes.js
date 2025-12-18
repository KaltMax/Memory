import express from 'express';
import { getHighscores, addHighscore } from '../controllers/highscoreController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHighscores);
router.post('/', authenticateToken, addHighscore);

export default router;

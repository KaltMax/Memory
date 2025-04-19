import express from 'express';
import { getHighscores, addHighscore } from '../controllers/highscoreController.js';

const router = express.Router();

router.get('/', getHighscores);
router.post('/', addHighscore);

export default router;

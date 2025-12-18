import { pool } from '../config/db.js';

// Get highscores from DB
const getHighscores = async (req, res) => {
  try {
    const result = await pool.query('SELECT name, score FROM highscores ORDER BY score DESC LIMIT 10'); // Limit to top 10 for example
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching highscores:', err);
    res.status(500).json({ message: 'Error fetching highscores' });
  }
};

// Add highscore to DB (protected - requires authentication)
const addHighscore = async (req, res) => {
  const { score } = req.body;

  // Validate score
  if (typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid score' });
  }

  // Get user info from authenticated request (set by auth middleware)
  const { userId, username } = req.user;

  try {
    await pool.query(
      'INSERT INTO highscores (name, score, user_id) VALUES ($1, $2, $3)',
      [username, score, userId]
    );
    res.status(201).json({ message: 'Score added successfully' });
  } catch (err) {
    console.error('Error adding highscore:', err);
    res.status(500).json({ message: 'Error adding highscore' });
  }
};

export { getHighscores, addHighscore };

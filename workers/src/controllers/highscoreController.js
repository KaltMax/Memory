/**
 * Get highscores from database
 * Public endpoint - no authentication required
 */
export const getHighscores = async (c) => {
  try {
    // Fetch top 10 highscores ordered by score descending
    const highscores = await c.db.queryAll(
      'SELECT name, score FROM highscores ORDER BY score DESC LIMIT 10'
    );

    return c.json(highscores);
  } catch (err) {
    console.error('Error fetching highscores:', err);
    return c.json({ message: 'Error fetching highscores' }, 500);
  }
};

/**
 * Add highscore to database
 * Protected endpoint - requires authentication
 */
export const addHighscore = async (c) => {
  try {
    const { score } = await c.req.json();

    // Validate score is a number
    if (typeof score !== 'number') {
      return c.json({ message: 'Invalid score' }, 400);
    }

    // Get user info from authenticated request (set by auth middleware)
    const { userId, username } = c.user;

    // Insert highscore into database
    await c.db.execute(
      'INSERT INTO highscores (name, score, user_id) VALUES (?, ?, ?)',
      [username, score, userId]
    );

    return c.json({ message: 'Score added successfully' }, 201);
  } catch (err) {
    console.error('Error adding highscore:', err);
    return c.json({ message: 'Error adding highscore' }, 500);
  }
};

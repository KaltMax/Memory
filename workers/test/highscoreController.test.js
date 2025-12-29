import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHighscores, addHighscore } from '../src/controllers/highscoreController.js';

/**
 * Helper to create mock Hono context
 */
function createMockContext(overrides = {}) {
  return {
    db: {
      queryAll: vi.fn(),
      execute: vi.fn(),
    },
    req: {
      json: vi.fn(),
    },
    json: vi.fn((data, status) => ({ data, status })),
    user: { userId: 1, username: 'TestUser', email: 'test@example.com' },
    ...overrides
  };
}

describe('Highscore Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getHighscores', () => {
    it('success -> returns 200 and the top 10 rows', async () => {
      const fakeRows = [
        { name: 'Alice', score: 100 },
        { name: 'Bob', score: 90 }
      ];
      const c = createMockContext();
      c.db.queryAll.mockResolvedValueOnce(fakeRows);

      const result = await getHighscores(c);

      expect(c.db.queryAll).toHaveBeenCalledWith(
        'SELECT name, score FROM highscores ORDER BY score DESC LIMIT 10'
      );
      expect(result.data).toEqual(fakeRows);
    });

    it('error -> returns 500 and an error message', async () => {
      const c = createMockContext();
      c.db.queryAll.mockRejectedValueOnce(new Error('DB failure'));

      const result = await getHighscores(c);

      expect(result.status).toBe(500);
      expect(result.data).toEqual({ message: 'Error fetching highscores' });
    });
  });

  describe('addHighscore', () => {
    it('valid payload with authenticated user -> returns 201 Created', async () => {
      const c = createMockContext();
      c.req.json.mockResolvedValueOnce({ score: 200 });
      c.db.execute.mockResolvedValueOnce({});

      const result = await addHighscore(c);

      expect(c.db.execute).toHaveBeenCalledWith(
        'INSERT INTO highscores (name, score, user_id) VALUES (?, ?, ?)',
        ['TestUser', 200, 1]
      );
      expect(result.status).toBe(201);
      expect(result.data).toEqual({ message: 'Score added successfully' });
    });

    it('invalid payload (non-number score) -> returns 400 Bad Request', async () => {
      const c = createMockContext();
      c.req.json.mockResolvedValueOnce({ score: 'high' });

      const result = await addHighscore(c);

      expect(c.db.execute).not.toHaveBeenCalled();
      expect(result.status).toBe(400);
      expect(result.data).toEqual({ message: 'Invalid score' });
    });

    it('DB error during insert -> returns 500 Internal Server Error', async () => {
      const c = createMockContext();
      c.req.json.mockResolvedValueOnce({ score: 75 });
      c.db.execute.mockRejectedValueOnce(new Error('Insert failed'));

      const result = await addHighscore(c);

      expect(result.status).toBe(500);
      expect(result.data).toEqual({ message: 'Error adding highscore' });
    });
  });
});

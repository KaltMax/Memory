import { jest } from '@jest/globals';

beforeAll(() => {
  // Suppress noisy console.error outputs during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // Restore original console.error
  console.error.mockRestore();
});

// Mock the DB module before importing anything else
await jest.unstable_mockModule('../src/config/db.js', () => ({
  pool: { query: jest.fn() }
}));

// Now import the mocked pool and the controller under test
const { pool } = await import('../src/config/db.js');
const { getHighscores, addHighscore } = await import('../src/controllers/highscoreController.js');

// Helper to construct a fake Express `res` object
function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe('Highscore Controller', () => {
  beforeEach(() => {
    // Reset mock implementation and call history before each test
    pool.query.mockReset();
  });

  describe('getHighscores', () => {
    it('success → returns 200 and the top 10 rows', async () => {
      const fakeRows = [{ name: 'Alice', score: 100 }];
      pool.query.mockResolvedValueOnce({ rows: fakeRows });

      const req = {};
      const res = makeRes();
      await getHighscores(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT name, score FROM highscores ORDER BY score DESC LIMIT 10'
      );
      expect(res.json).toHaveBeenCalledWith(fakeRows);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('error → returns 500 and an error message', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      const req = {};
      const res = makeRes();
      await getHighscores(req, res);

      expect(pool.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching highscores'
      });
    });
  });

  describe('addHighscore', () => {
    it('valid payload with authenticated user → returns 201 Created', async () => {
      pool.query.mockResolvedValueOnce({});
      const req = {
        body: { score: 200 },
        user: { userId: 1, username: 'Bob', email: 'bob@example.com' }
      };
      const res = makeRes();

      await addHighscore(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO highscores (name, score, user_id) VALUES ($1, $2, $3)',
        ['Bob', 200, 1]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Score added successfully'
      });
    });

    it('invalid payload (non-number score) → returns 400 Bad Request', async () => {
      const req = {
        body: { score: 'high' },
        user: { userId: 1, username: 'Dave', email: 'dave@example.com' }
      };
      const res = makeRes();

      await addHighscore(req, res);

      expect(pool.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid score' });
    });

    it('DB error during insert → returns 500 Internal Server Error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Insert failed'));
      const req = {
        body: { score: 75 },
        user: { userId: 1, username: 'Eve', email: 'eve@example.com' }
      };
      const res = makeRes();

      await addHighscore(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO highscores (name, score, user_id) VALUES ($1, $2, $3)',
        ['Eve', 75, 1]
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error adding highscore'
      });
    });
  });
});

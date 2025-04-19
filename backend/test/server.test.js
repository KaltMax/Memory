import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/server.js';

// Prevent actual DB initialization or server.listen during tests
jest.mock('../src/config/db.js', () => ({
  initializeDatabase: jest.fn(),
}));

describe('Memoria Highscore API', () => {
  describe('GET /', () => {
    it('should return 200 and welcome text', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.text).toBe('Memoria Highscore API is running!');
    });
  });
});

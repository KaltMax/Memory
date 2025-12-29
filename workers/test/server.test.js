import { describe, it, expect } from 'vitest';
import app from '../src/index.js';

describe('Memoria Highscore API', () => {
  describe('GET /', () => {
    it('should return 200 and welcome text', async () => {
      // Create a mock request
      const req = new Request('http://localhost/', { method: 'GET' });
      const env = { DB: {} }; // Mock environment

      const res = await app.fetch(req, env);

      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toBe('Memoria Highscore API is running!');
    });
  });
});

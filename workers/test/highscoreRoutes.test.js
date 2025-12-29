import { describe, it, expect } from 'vitest';
import highscoreRoutes from '../src/routes/highscoreRoutes.js';

describe('Highscore API Routes', () => {
  it('should have routes defined', () => {
    // Hono routes are internal - verify the route object exists
    expect(highscoreRoutes).toBeDefined();
    expect(typeof highscoreRoutes.fetch).toBe('function');
  });
});

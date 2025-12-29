import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Database } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import highscoreRoutes from './routes/highscoreRoutes.js';

const app = new Hono();

// CORS middleware - allow cross-origin requests
app.use('*', cors({
  origin: '*', // Will be configured per environment
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Database middleware - attach Database instance to context
app.use('*', async (c, next) => {
  c.db = new Database(c.env.DB);
  await next();
});

// Root route
app.get('/', (c) => {
  return c.text('Memoria Highscore API is running!');
});

// Mount API routes
app.route('/api/auth', authRoutes);
app.route('/api/highscores', highscoreRoutes);

export default app;

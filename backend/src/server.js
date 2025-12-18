import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDatabase } from './config/db.js';
import highscoreRoutes from './routes/highscoreRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Memoria Highscore API is running!');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/highscores', highscoreRoutes);

// Initialize DB and start server
const startServer = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await initializeDatabase();
  }
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Highscore backend listening on http://localhost:${PORT}`);
    });
  }
};

startServer();

export default app;

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const SALT_ROUNDS = 10;

// Generate JWT token
const generateToken = (userId, username, email) => {
  return jwt.sign(
    { userId, username, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate username format
    if (!/^\w{3,50}$/.test(username)) {
      return res.status(400).json({
        error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long.',
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Username or email already exists.',
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password_hash]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken(user.id, user.username, user.email);

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT id, username, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username, user.email);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Verify token (protected route)
export const verifyToken = async (req, res) => {
  try {
    // User info is already attached to req.user by the middleware
    const { userId } = req.user;

    // Verify user still exists in database
    const result = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];

    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

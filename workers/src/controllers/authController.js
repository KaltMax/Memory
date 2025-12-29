import { SignJWT } from 'jose';

const SALT_ROUNDS = 10;

/**
 * Generate JWT token using jose library (Web Crypto API compatible)
 * @param {number} userId - User ID
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} secret - JWT secret key
 * @param {string} expiration - Token expiration time
 * @returns {Promise<string>} JWT token
 */
const generateToken = async (userId, username, email, secret, expiration) => {
  const secretKey = new TextEncoder().encode(secret);

  return await new SignJWT({ userId, username, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiration || '7d')
    .sign(secretKey);
};

/**
 * Register a new user
 */
export const register = async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return c.json({ error: 'All fields are required.' }, 400);
    }

    // Validate username format (3-50 chars, alphanumeric + underscores)
    if (!/^\w{3,50}$/.test(username)) {
      return c.json({
        error: 'Username must be 3-50 characters and contain only letters, numbers, and underscores.',
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format.' }, 400);
    }

    // Validate password length
    if (password.length < 8) {
      return c.json({
        error: 'Password must be at least 8 characters long.',
      }, 400);
    }

    // Validate password strength (at least 1 uppercase, 1 lowercase, 1 digit)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return c.json({
        error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      }, 400);
    }

    // Check if user already exists
    const existingUser = await c.db.queryFirst(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return c.json({
        error: 'Username or email already exists.',
      }, 409);
    }

    // Hash password using bcryptjs (Workers-compatible)
    const bcrypt = await import('bcryptjs');
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user into database
    const user = await c.db.insertAndReturn(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash],
      'users'
    );

    // Generate JWT token
    const token = await generateToken(
      user.id,
      user.username,
      user.email,
      c.env.JWT_SECRET,
      c.env.JWT_EXPIRATION
    );

    return c.json({
      message: 'User registered successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    }, 201);
  } catch (err) {
    console.error('Error during registration:', err);
    return c.json({ error: 'Internal server error.' }, 500);
  }
};

/**
 * Login user
 */
export const login = async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Validate input
    if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400);
    }

    // Find user by email
    const user = await c.db.queryFirst(
      'SELECT id, username, email, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return c.json({ error: 'Invalid credentials.' }, 401);
    }

    // Compare password with stored hash
    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials.' }, 401);
    }

    // Generate JWT token
    const token = await generateToken(
      user.id,
      user.username,
      user.email,
      c.env.JWT_SECRET,
      c.env.JWT_EXPIRATION
    );

    return c.json({
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
    return c.json({ error: 'Internal server error.' }, 500);
  }
};

/**
 * Verify token (protected route)
 * User info is already attached to c.user by authenticateToken middleware
 */
export const verifyToken = async (c) => {
  try {
    const { userId } = c.user;

    // Verify user still exists in database
    const user = await c.db.queryFirst(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return c.json({ error: 'User not found.' }, 404);
    }

    return c.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    return c.json({ error: 'Internal server error.' }, 500);
  }
};

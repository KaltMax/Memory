import { jwtVerify } from 'jose';

/**
 * JWT authentication middleware for Hono
 * Verifies JWT tokens using the jose library (Web Crypto API compatible)
 */
export const authenticateToken = async (c, next) => {
  // Extract token from Authorization header (Bearer TOKEN format)
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1]; // Get token after 'Bearer '

  if (!token) {
    return c.json({ error: 'Access denied. No token provided.' }, 401);
  }

  try {
    // Convert JWT secret to Uint8Array for jose library
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);

    // Verify token using jose library
    const { payload } = await jwtVerify(token, secret);

    // Attach user info to context for use in route handlers
    c.user = payload;

    // Continue to next middleware/handler
    await next();
  } catch (err) {
    // Handle token expiration
    if (err.code === 'ERR_JWT_EXPIRED') {
      return c.json({ error: 'Token expired.' }, 401);
    }
    // Handle invalid token
    return c.json({ error: 'Invalid token.' }, 403);
  }
};

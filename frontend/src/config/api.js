/**
 * API Configuration
 *
 * In development:
 * - Uses Vite proxy to forward /api requests to the Workers dev server
 * - This allows us to avoid CORS issues during development
 *
 * In production:
 * - Uses VITE_API_URL environment variable to connect to deployed Workers backend
 * - Falls back to relative URLs if not set (for backwards compatibility)
 */

const isDevelopment = import.meta.env.DEV;
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Get the base URL for API requests
 * @returns {string} Base URL for API
 */
export function getApiBaseUrl() {
  // In development, use proxy (relative URLs)
  if (isDevelopment) {
    return '';
  }

  // In production, use environment variable or relative URLs
  return apiUrl || '';
}

/**
 * Get full API endpoint URL
 * @param {string} path - API path (e.g., '/api/auth/login')
 * @returns {string} Full URL
 */
export function getApiUrl(path) {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${path}`;
}

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_VERIFY: '/api/auth/verify',

  // Highscore endpoints
  HIGHSCORES: '/api/highscores',
};

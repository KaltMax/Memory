import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export async function register(username, email, password) {
  const response = await axios.post(getApiUrl(API_ENDPOINTS.AUTH_REGISTER), {
    username,
    email,
    password,
  });
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(getApiUrl(API_ENDPOINTS.AUTH_LOGIN), {
    email,
    password,
  });
  return response.data;
}

export async function verifyToken(token) {
  const response = await axios.get(getApiUrl(API_ENDPOINTS.AUTH_VERIFY), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

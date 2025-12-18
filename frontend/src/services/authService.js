import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export async function register(username, email, password) {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
}

export async function verifyToken(token) {
  const response = await axios.get(`${API_URL}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

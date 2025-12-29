import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../config/api';

export async function getHighScoreList() {
  const response = await axios.get(getApiUrl(API_ENDPOINTS.HIGHSCORES));
  return response.data;
}

export async function addHighScore(score) {
  await axios.post(getApiUrl(API_ENDPOINTS.HIGHSCORES), { score });
}
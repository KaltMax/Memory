import axios from 'axios';

const API_URL = 'http://localhost:3000/api/highscores';

export async function getHighScoreList() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function addHighScore(score) {
  await axios.post(API_URL, { score });
}
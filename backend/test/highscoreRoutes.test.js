import router from '../src/routes/highscoreRoutes.js';
import { getHighscores, addHighscore } from '../src/controllers/highscoreController.js';

describe('Highscore API Routes', () => {
  it('should have a GET route for / handled by getHighscores', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === '/' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    const hasGetHighscoresHandler = route.route.stack.some(
      (handlerLayer) => handlerLayer.handle === getHighscores
    );
    expect(hasGetHighscoresHandler).toBe(true);
  });

  it('should have a POST route for / handled by addHighscore', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === '/' && layer.route.methods.post
    );
    expect(route).toBeDefined();
    const hasAddHighscoreHandler = route.route.stack.some(
      (handlerLayer) => handlerLayer.handle === addHighscore
    );
    expect(hasAddHighscoreHandler).toBe(true);
  });
});

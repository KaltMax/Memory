import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare', // Cloudflare Workers environment simulator
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './reports/coverage',
      include: ['src/**/*.js'],
      exclude: ['src/**/*.test.js', 'test/**']
    }
  },
});

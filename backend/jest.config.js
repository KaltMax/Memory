export default {
    testEnvironment: 'node',
    transform: {},
    collectCoverage: true,
    coverageDirectory: "./reports/coverage",
    collectCoverageFrom: [
      "src/**/*.{js,jsx}",
      "!src/**/*.test.{js,jsx}",
      "!**/node_modules/**"
    ]
  };
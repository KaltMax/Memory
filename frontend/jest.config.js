export default {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs)$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/tests/__mocks__/styleMock.js"
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.mjs"],
  collectCoverage: true,
  coverageDirectory: "./reports/coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!**/node_modules/**"
  ]
};

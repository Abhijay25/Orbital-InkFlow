module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    "<rootDir>/src/**/*.test.[jt]s?(x)",
    "<rootDir>/src/**/*.spec.[jt]s?(x)",
  ],
  testPathIgnorePatterns: [
    "<rootDir>/tests/",
    "<rootDir>/src/database/notesService.test.ts",
  ],
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

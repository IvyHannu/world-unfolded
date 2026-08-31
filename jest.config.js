/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.phase0-sdk57-backup/'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.phase0-sdk57-backup/'],
};

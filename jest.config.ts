import {Config} from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;

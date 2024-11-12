// Use require instead of import
require('@testing-library/jest-dom');

// Mock fetch globally
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
require('@testing-library/jest-dom');

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data) => ({ json: () => data })),
    next: jest.fn(),
    redirect: jest.fn(),
  },
}));

// Mock Next Auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

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

// Global Request mock
global.Request = class Request {
  constructor() {
    // Add basic Request implementation
  }
};
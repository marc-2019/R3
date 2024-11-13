require('@testing-library/jest-dom');

class MockResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new Headers(options.headers);
  }

  json() {
    return this.body;
  }
}

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, options = {}) => new MockResponse(body, options),
    next: jest.fn(),
    redirect: jest.fn(),
  }
}));

// Mock Next Auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

// Create a proper Request mock
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = input;
    this._body = init.body;
    this.method = init.method || 'GET';
  }

  async json() {
    return JSON.parse(this._body);
  }
};

// Mock Headers
global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = init;
  }
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
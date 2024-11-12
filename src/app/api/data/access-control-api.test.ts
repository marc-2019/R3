import { GET, POST } from './access-control-api';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';

jest.mock('next-auth/next');
jest.mock('@/lib/prisma', () => ({
  dataAccess: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

// Generic request mock
class MockRequest {
  url: string;
  method: string;
  body: string | null;

  constructor(url: string, method: string, body: string | null = null) {
    this.url = url;
    this.method = method;
    this.body = body;
  }

  async json() {
    return this.body ? JSON.parse(this.body) : {};
  }
}

describe('Access Control API', () => {
  it('should return 401 if the user is not authenticated for GET', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(null);

    const req = new MockRequest('http://localhost/api/data/access-control-api', 'GET');
    const response = await GET(req as any);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should return 401 if the user is not authenticated for POST', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(null);

    const req = new MockRequest('http://localhost/api/data/access-control-api', 'POST', JSON.stringify({}));
    const response = await POST(req as any);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should return 400 for invalid POST request body', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce({ user: { id: 'admin1' } });

    const req = new MockRequest('http://localhost/api/data/access-control-api', 'POST', JSON.stringify({ invalid: 'data' }));
    const response = await POST(req as any);

    expect(response.status).toBe(400);
  });

  it('should return 500 for database errors', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce({ user: { id: 'admin1' } });
    (prisma.dataAccess.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = new MockRequest('http://localhost/api/data/access-control-api', 'GET');
    const response = await GET(req as any);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual(expect.objectContaining({ error: 'Internal Server Error' }));
  });
});

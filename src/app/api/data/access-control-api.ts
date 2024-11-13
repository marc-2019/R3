import { GET, POST } from './access-control-api';
import prisma from '@/lib/prisma';

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: 1 } })
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    dataAccess: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({})
    }
  }
}));

describe('Access Control API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if the user is not authenticated', async () => {
      require('next-auth/next').getServerSession.mockResolvedValueOnce(null);
      const response = await GET();
      expect(response.status).toBe(401);
      expect(response.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 for database errors', async () => {
      (prisma.dataAccess.findMany as jest.Mock).mockRejectedValueOnce(
        new Error('Database connection failed')
      );
      const response = await GET();
      expect(response.status).toBe(500);
      expect(response.json()).toEqual({ error: 'Internal Server Error' });
    });

    it('should return data successfully', async () => {
      const mockData = [{ id: 1, userId: 1 }];
      (prisma.dataAccess.findMany as jest.Mock).mockResolvedValueOnce(mockData);
      const response = await GET();
      expect(response.status).toBe(200);
      expect(response.json()).toEqual(mockData);
    });
  });

  describe('POST', () => {
    it('should return 401 if the user is not authenticated', async () => {
      require('next-auth/next').getServerSession.mockResolvedValueOnce(null);
      const response = await POST(new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ userId: 1, permissionIds: [1] })
      }));
      expect(response.status).toBe(401);
      expect(response.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return 400 for invalid request body', async () => {
      const response = await POST(new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' })
      }));
      expect(response.status).toBe(400);
    });

    it('should create data access successfully', async () => {
      const mockData = { id: 1, userId: 1, permissions: [] };
      (prisma.dataAccess.create as jest.Mock).mockResolvedValueOnce(mockData);
      const response = await POST(new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ userId: 1, permissionIds: [1] })
      }));
      expect(response.status).toBe(200);
      expect(response.json()).toEqual(mockData);
    });
  });
});
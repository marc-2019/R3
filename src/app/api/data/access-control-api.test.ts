// src/app/api/data/access-control-api.test.ts
import { GET, POST } from './access-control-api';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn().mockResolvedValue({ user: { id: 1 } }) // Changed to number
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    dataAccess: {
      findMany: jest.fn(),
      create: jest.fn()
    }
  }
}));

describe('Access Control API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated for GET', async () => {
    require('next-auth/next').getServerSession.mockResolvedValueOnce(null);
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('should return 401 if the user is not authenticated for POST', async () => {
    require('next-auth/next').getServerSession.mockResolvedValueOnce(null);
    const response = await POST(new Request('http://localhost', { 
      method: 'POST',
      body: JSON.stringify({ userId: 1, permissionIds: [1] }) // Changed to numbers
    }));
    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid POST request body', async () => {
    const response = await POST(new Request('http://localhost', { 
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' })
    }));
    expect(response.status).toBe(400);
  });

  it('should return 500 for database errors', async () => {
    (prisma.dataAccess.findMany as jest.Mock).mockRejectedValueOnce(
      new Error('Database connection failed')
    );
    
    const request = new Request('http://localhost');
    const response = await GET();
    
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual(expect.objectContaining({ error: 'Internal Server Error' }));
  });
});
// File: src/app/api/data/access-control-api.test.ts

import { createMocks } from 'node-mocks-http';
import { GET, POST } from './access-control-api';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Access Control API', () => {
  it('should return 401 if the user is not authenticated for GET', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(null);

    const { req, res } = createMocks({ method: 'GET' });
    await GET(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toEqual(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should return 401 if the user is not authenticated for POST', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce(null);

    const { req, res } = createMocks({ method: 'POST' });
    await POST(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData()).toEqual(expect.objectContaining({ error: 'Unauthorized' }));
  });

  it('should return 400 for invalid POST request body', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce({ user: { id: 'admin1' } });

    const { req, res } = createMocks({ method: 'POST', body: { invalid: 'data' } });
    await POST(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('should return 500 for database errors', async () => {
    (getServerSession as jest.Mock).mockReturnValueOnce({ user: { id: 'admin1' } });
    prisma.dataAccess.findMany = jest.fn().mockRejectedValue(new Error('Database error'));

    const { req, res } = createMocks({ method: 'GET' });
    await GET(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getData()).toEqual(expect.objectContaining({ error: 'Internal Server Error' }));
  });
});
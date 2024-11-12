import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Validation schemas
const accessRequestSchema = z.object({
  userId: z.string(),
  permissionIds: z.array(z.string())
});

// Generic handler function that takes in standard request-like and response-like objects
export async function GET(req: { url: string }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return { status: 401, json: async () => ({ error: 'Unauthorized' }) };
    }

    try {
      // Get data access permissions
      const accessList = await prisma.dataAccess.findMany({
        include: {
          user: true,
          permissions: true
        }
      });

      return { status: 200, json: async () => accessList };
    } catch (error) {
      console.error('Database error:', error);
      return { status: 500, json: async () => ({ error: 'Internal Server Error' }) };
    }
  } catch (error) {
    console.error('Server error:', error);
    return { status: 500, json: async () => ({ error: 'Internal Server Error' }) };
  }
}

export async function POST(req: { json: () => Promise<any> }) {
  try {
    const session = await getServerSession();

    if (!session) {
      return { status: 401, json: async () => ({ error: 'Unauthorized' }) };
    }

    const body = await req.json();
    const validation = accessRequestSchema.safeParse(body);

    if (!validation.success) {
      return { status: 400, json: async () => ({ error: validation.error }) };
    }

    const { userId, permissionIds } = validation.data;

    const numericUserId = parseInt(userId, 10); // Convert userId to a number if it's currently a string

    const dataAccess = await prisma.dataAccess.create({
      data: {
        userId: numericUserId, // userId must be a number
        permissions: {
          connect: permissionIds.map(id => ({ id: parseInt(id, 10) })) // Ensure permissionIds are numbers
        }
      },
      include: {
        user: true,
        permissions: true
      }
    });

    return { status: 200, json: async () => dataAccess };
  } catch (error) {
    console.error('Server error:', error);
    return { status: 500, json: async () => ({ error: 'Internal Server Error' }) };
  }
}

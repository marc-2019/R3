// src/app/api/data/access-control-api.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Validation schemas
const accessRequestSchema = z.object({
  userId: z.number(), // Changed from string to number
  permissionIds: z.array(z.number()) // Changed from string to number
});

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const accessList = await prisma.dataAccess.findMany({
        include: {
          user: true,
          permissions: true
        }
      });

      return NextResponse.json(accessList);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = accessRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { userId, permissionIds } = validation.data;

    try {
      const dataAccess = await prisma.dataAccess.create({
        data: {
          userId, // Now correctly typed as number
          permissions: {
            connect: permissionIds.map(id => ({ id })) // Now correctly typed as number[]
          }
        },
        include: {
          user: true,
          permissions: true
        }
      });

      return NextResponse.json(dataAccess);
    } catch (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
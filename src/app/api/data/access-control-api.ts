import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Validation schemas
const AccessPermissionSchema = z.enum(['read', 'write', 'backup', 'restore']);

const DataAccessSchema = z.object({
  userId: z.string(),
  permissions: z.array(AccessPermissionSchema),
  role: z.string(),
});

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get data access permissions
    const accessList = await prisma.dataAccess.findMany({
      include: {
        user: true,
        permissions: true
      }
    });

    return NextResponse.json(accessList);
  } catch (error) {
    console.error('Data access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { userId, permissions, role } = DataAccessSchema.parse(body);

    const access = await prisma.dataAccess.create({
      data: {
        userId,
        role,
        permissions: {
          create: permissions.map(p => ({ type: p }))
        }
      }
    });

    // Log access change
    await prisma.auditLog.create({
      data: {
        type: 'DATA_ACCESS_MODIFIED',
        userId: session.user.id,
        details: {
          action: 'create',
          targetUserId: userId,
          permissions
        }
      }
    });

    return NextResponse.json(access);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Data access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// src/app/api/settings/test/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    // First verify connection
    await prisma.$connect();
    
    // Try to create a test settings entry
    const testSettings = await prisma.systemSettings.upsert({
      where: {
        id: 'default'
      },
      update: {},
      create: {
        databaseConfig: {
          enabled: true,
          backupEnabled: false,
        },
        networkSettings: {
          rootNetworkEnabled: false,
          reality2Enabled: false,
        },
        notifications: {
          emailNotifications: true,
          systemAlerts: true,
          maintenanceAlerts: true,
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection and SystemSettings model working',
      data: testSettings
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    let errorType = 'UnknownError';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorType = error.constructor.name;

      // Check for specific Prisma errors
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientRustPanicError ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed',
        details: errorMessage,
        errorType: errorType
      },
      { status: statusCode }
    );
  }
}
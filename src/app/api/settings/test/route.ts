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
    
    // Improved error handling with type checking
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    let errorType = 'UnknownError';

    if (error instanceof Prisma.PrismaClientInitializationError) {
      errorMessage = 'Failed to connect to database';
      statusCode = 503;
      errorType = 'PrismaClientInitializationError';
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorMessage = `Database request failed: ${error.message}`;
      statusCode = 400;
      errorType = 'PrismaClientKnownRequestError';
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorType = error.constructor.name;
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
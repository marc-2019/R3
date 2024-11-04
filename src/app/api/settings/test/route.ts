// src/app/api/settings/test/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check error message content for classification
      if (errorMessage.includes('connect')) {
        statusCode = 503; // Service unavailable
      } else if (errorMessage.includes('validation') || errorMessage.includes('constraint')) {
        statusCode = 400; // Bad request
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed',
        details: errorMessage,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: statusCode }
    );
  }
}
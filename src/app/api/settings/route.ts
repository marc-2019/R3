// src/app/api/settings/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';

const SETTINGS_CACHE_KEY = 'system:settings';

async function getSettingsFromCache() {
  const cached = await redis.get(SETTINGS_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}

async function updateSettingsCache(settings: any) {
  await redis.setex(SETTINGS_CACHE_KEY, 3600, JSON.stringify(settings)); // Cache for 1 hour
}

export async function GET() {
  try {
    // Try cache first
    const cached = await getSettingsFromCache();
    if (cached) {
      return NextResponse.json(cached);
    }

    // If not in cache, get from database
    const settings = await prisma.systemSettings.findFirst({
      where: { id: 'default' },
    });

    if (settings) {
      await updateSettingsCache(settings);
      return NextResponse.json(settings);
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    const updated = await prisma.systemSettings.upsert({
      where: {
        id: 'default',
      },
      update: {
        databaseConfig: settings.databaseConfig,
        networkSettings: settings.networkSettings,
        notifications: settings.notifications,
      },
      create: {
        id: 'default',
        databaseConfig: settings.databaseConfig,
        networkSettings: settings.networkSettings,
        notifications: settings.notifications,
      },
    });

    await updateSettingsCache(updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
// src/app/api/settings/route.ts

import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settingsService';

export async function GET() {
  try {
    const settings = await settingsService.getSettings();
    return NextResponse.json(settings);
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
    const updated = await settingsService.updateSettings(settings);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await settingsService.resetSettings();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    );
  }
}
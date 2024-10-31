// src/services/settingsService.ts

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

const SETTINGS_CACHE_KEY = 'system:settings';

export interface SystemSettings {
  id: string;
  databaseConfig: {
    enabled: boolean;
    backupEnabled: boolean;
    connectionString?: string;
    backupSchedule?: string;
  };
  networkSettings: {
    rootNetworkEnabled: boolean;
    reality2Enabled: boolean;
    rootNetworkUrl?: string;
    reality2Url?: string;
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    maintenanceAlerts: boolean;
  };
  updatedAt: Date;
}

export class SettingsService {
  async getSettings(): Promise<SystemSettings | null> {
    // Try cache first
    const cachedSettings = await redis.get(SETTINGS_CACHE_KEY);
    if (cachedSettings) {
      return JSON.parse(cachedSettings);
    }

    // If not in cache, get from database
    const settings = await prisma.systemSettings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    if (settings) {
      // Cache the settings for future requests
      await redis.setex(SETTINGS_CACHE_KEY, 3600, JSON.stringify(settings)); // Cache for 1 hour
      return settings;
    }

    return null;
  }

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    // Update database
    const updated = await prisma.systemSettings.upsert({
      where: { id: settings.id || 'default' },
      update: {
        ...settings,
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        ...settings,
        updatedAt: new Date()
      }
    });

    // Update cache
    await redis.setex(SETTINGS_CACHE_KEY, 3600, JSON.stringify(updated));

    return updated;
  }

  async resetSettings(): Promise<void> {
    // Clear from database
    await prisma.systemSettings.deleteMany();
    
    // Clear from cache
    await redis.del(SETTINGS_CACHE_KEY);
  }
}

export const settingsService = new SettingsService();
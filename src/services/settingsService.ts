// src/services/settingsService.ts

import prisma from '@/lib/prisma';
import { cacheService } from './cacheService';

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
    try {
      // Try cache first
      const cached = await cacheService.get<SystemSettings>(SETTINGS_CACHE_KEY);
      if (cached) {
        return cached;
      }

      // If not in cache, get from database
      const settings = await prisma.systemSettings.findFirst({
        orderBy: { updatedAt: 'desc' }
      });

      if (settings) {
        const convertedSettings = settings as SystemSettings;
        await cacheService.set(SETTINGS_CACHE_KEY, convertedSettings);
        return convertedSettings;
      }

      return null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  }

  async updateSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    try {
      const updated = await prisma.systemSettings.upsert({
        where: { id: settings.id || 'default' },
        update: {
          databaseConfig: settings.databaseConfig as any,
          networkSettings: settings.networkSettings as any,
          notifications: settings.notifications as any,
          updatedAt: new Date()
        },
        create: {
          id: 'default',
          databaseConfig: settings.databaseConfig || { enabled: false, backupEnabled: false },
          networkSettings: settings.networkSettings || { rootNetworkEnabled: false, reality2Enabled: false },
          notifications: settings.notifications || { emailNotifications: true, systemAlerts: true, maintenanceAlerts: true },
          updatedAt: new Date()
        }
      });

      const convertedSettings = updated as SystemSettings;
      await cacheService.set(SETTINGS_CACHE_KEY, convertedSettings);
      return convertedSettings;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await prisma.systemSettings.deleteMany();
      await cacheService.delete(SETTINGS_CACHE_KEY);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
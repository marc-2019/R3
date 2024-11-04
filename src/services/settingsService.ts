// src/services/settingsService.ts

import prisma from '@/lib/prisma';
import { cacheService } from './cacheService';

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

// Type guard to validate database config
const isDatabaseConfig = (value: unknown): value is SystemSettings['databaseConfig'] => {
  if (!value || typeof value !== 'object') return false;
  const config = value as SystemSettings['databaseConfig'];
  return (
    typeof config.enabled === 'boolean' &&
    typeof config.backupEnabled === 'boolean'
  );
};

// Type guard to validate network settings
const isNetworkSettings = (value: unknown): value is SystemSettings['networkSettings'] => {
  if (!value || typeof value !== 'object') return false;
  const settings = value as SystemSettings['networkSettings'];
  return (
    typeof settings.rootNetworkEnabled === 'boolean' &&
    typeof settings.reality2Enabled === 'boolean'
  );
};

// Type guard to validate notifications
const isNotifications = (value: unknown): value is SystemSettings['notifications'] => {
  if (!value || typeof value !== 'object') return false;
  const notifications = value as SystemSettings['notifications'];
  return (
    typeof notifications.emailNotifications === 'boolean' &&
    typeof notifications.systemAlerts === 'boolean' &&
    typeof notifications.maintenanceAlerts === 'boolean'
  );
};

// Convert raw data to SystemSettings
const convertToSystemSettings = (data: any): SystemSettings | null => {
  if (!data || typeof data !== 'object') return null;
  
  try {
    const settings: SystemSettings = {
      id: data.id,
      databaseConfig: data.databaseConfig,
      networkSettings: data.networkSettings,
      notifications: data.notifications,
      updatedAt: new Date(data.updatedAt)
    };

    if (!isDatabaseConfig(settings.databaseConfig)) return null;
    if (!isNetworkSettings(settings.networkSettings)) return null;
    if (!isNotifications(settings.notifications)) return null;

    return settings;
  } catch (error) {
    console.error('Error converting settings:', error);
    return null;
  }
};

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
        const convertedSettings = convertToSystemSettings(settings);
        if (convertedSettings) {
          // Cache the settings for future requests
          await cacheService.set(SETTINGS_CACHE_KEY, convertedSettings);
          return convertedSettings;
        }
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

      const convertedSettings = convertToSystemSettings(updated);
      if (!convertedSettings) {
        throw new Error('Failed to convert settings after update');
      }

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
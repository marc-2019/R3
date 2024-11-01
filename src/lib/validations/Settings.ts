// src/lib/validations/settings.ts

import { z } from 'zod';

export const DatabaseConfigSchema = z.object({
  enabled: z.boolean(),
  backupEnabled: z.boolean(),
  connectionString: z.string().optional(),
  backupSchedule: z.string().optional(),
});

export const NetworkSettingsSchema = z.object({
  rootNetworkEnabled: z.boolean(),
  reality2Enabled: z.boolean(),
  rootNetworkUrl: z.string().url().optional(),
  reality2Url: z.string().url().optional(),
});

export const NotificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  systemAlerts: z.boolean(),
  maintenanceAlerts: z.boolean(),
});

export const SystemSettingsSchema = z.object({
  databaseConfig: DatabaseConfigSchema,
  networkSettings: NetworkSettingsSchema,
  notifications: NotificationSettingsSchema,
});

export type SystemSettingsType = z.infer<typeof SystemSettingsSchema>;
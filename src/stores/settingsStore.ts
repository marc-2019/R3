// src/stores/settingsStore.ts

import { create } from 'zustand';

interface DatabaseConfig {
  enabled: boolean;
  backupEnabled: boolean;
  connectionString?: string;
  backupSchedule?: string;
}

interface NetworkSettings {
  rootNetworkEnabled: boolean;
  reality2Enabled: boolean;
  rootNetworkUrl?: string;
  reality2Url?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  systemAlerts: boolean;
  maintenanceAlerts: boolean;
}

interface SettingsStore {
  settings: {
    databaseConfig: DatabaseConfig;
    networkSettings: NetworkSettings;
    notifications: NotificationSettings;
  };
  updateDatabaseConfig: (config: Partial<DatabaseConfig>) => void;
  updateNetworkSettings: (settings: Partial<NetworkSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
}

const initialSettings = {
  databaseConfig: {
    enabled: false,
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
  },
};

const useSettingsStore = create<SettingsStore>((set) => ({
  settings: initialSettings,
  updateDatabaseConfig: (config) =>
    set((state) => ({
      settings: {
        ...state.settings,
        databaseConfig: {
          ...state.settings.databaseConfig,
          ...config,
        },
      },
    })),
  updateNetworkSettings: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        networkSettings: {
          ...state.settings.networkSettings,
          ...settings,
        },
      },
    })),
  updateNotifications: (settings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          ...settings,
        },
      },
    })),
  resetSettings: () => set({ settings: initialSettings }),
}));

export default useSettingsStore;
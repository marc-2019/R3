// src/stores/settingsStore.ts

import { create } from 'zustand';
import axios from 'axios';

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

interface SettingsState {
  settings: {
    databaseConfig: DatabaseConfig;
    networkSettings: NetworkSettings;
    notifications: NotificationSettings;
  } | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SettingsState['settings']>) => Promise<void>;
}

const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/settings');
      set({ settings: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch settings',
        loading: false 
      });
    }
  },

  updateSettings: async (newSettings) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put('/api/settings', newSettings);
      set({ settings: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update settings',
        loading: false 
      });
    }
  },
}));

export default useSettingsStore;
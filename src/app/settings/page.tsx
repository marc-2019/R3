// src/app/settings/page.tsx

'use client';

import { useEffect } from 'react';
import { 
  Shield, 
  Database, 
  Network, 
  Bell, 
  Activity,
  AlertCircle 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useSettingsStore from '@/stores/settingsStore';

export default function SettingsPage() {
  const { settings, loading, error, fetchSettings, updateSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mx-auto mt-4 max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load settings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!settings) {
    return (
      <Alert className="mx-auto mt-4 max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No settings found. Please configure system settings.
        </AlertDescription>
      </Alert>
    );
  }

  const handleSaveChanges = async () => {
    try {
      await updateSettings(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">System configuration and preferences</p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Enable Database</span>
                <input
                  type="checkbox"
                  checked={settings.databaseConfig.enabled}
                  onChange={(e) => updateSettings({
                    ...settings,
                    databaseConfig: {
                      ...settings.databaseConfig,
                      enabled: e.target.checked
                    }
                  })}
                  className="toggle"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Root Network</span>
                <input
                  type="checkbox"
                  checked={settings.networkSettings.rootNetworkEnabled}
                  onChange={(e) => updateSettings({
                    ...settings,
                    networkSettings: {
                      ...settings.networkSettings,
                      rootNetworkEnabled: e.target.checked
                    }
                  })}
                  className="toggle"
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
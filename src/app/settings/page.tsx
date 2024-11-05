// src/app/settings/network/page.tsx
'use client';

import { useEffect } from 'react';
import { Network, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useSettingsStore from '@/stores/settingsStore';
import NetworkSettingsForm from '@/components/network/NetworkSettingsForm';

export default function NetworkSettingsPage() {
  const { settings, loading, error, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          <p className="text-gray-500">Loading network settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mx-auto mt-4 max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load network settings: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Network Settings</h1>
        <p className="text-gray-500">Configure Root Network connections and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Root Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkSettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
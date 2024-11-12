// src/app/settings/network/page.tsx
'use client';

import { useEffect } from 'react';
import { Network, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSettingsStore from '@/stores/settingsStore';
import EVMNetworkSettings from '@/components/network/EVMNetworkSettings';
import RootNetworkSettings from '@/components/network/RootNetworkSettings';

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
        <p className="text-gray-500">Configure network connections and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="root" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="root">Root Network</TabsTrigger>
              <TabsTrigger value="evm">EVM Networks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="root">
              <RootNetworkSettings />
            </TabsContent>
            
            <TabsContent value="evm">
              <EVMNetworkSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
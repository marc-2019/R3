// src/components/network/NetworkSettingsContent.tsx
'use client';

import { Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { NetworkSettingsContainer } from '@/components/network/NetworkSettingsContainer';
import { NetworkErrorBoundary } from './NetworkErrorBoundary';

export default function NetworkSettingsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Network Settings</h1>
      </div>
      
      <NetworkErrorBoundary>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkSettingsContainer />
          </CardContent>
        </Card>
      </NetworkErrorBoundary>
    </div>
  );
}
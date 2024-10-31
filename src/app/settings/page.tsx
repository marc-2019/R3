// src/app/settings/page.tsx
'use client';

import { 
  Shield, 
  Database, 
  Network, 
  Bell, 
  Clock, 
  HardDrive,
  Settings as SettingsIcon
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">System configuration and preferences</p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <SettingsIcon className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Database Configuration</div>
                  <div className="text-sm text-gray-500">Configure database connections and settings</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Cache Settings</div>
                  <div className="text-sm text-gray-500">Manage cache and performance settings</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Root Network Settings</div>
                  <div className="text-sm text-gray-500">Configure Root Network connection</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Reality2 Integration</div>
                  <div className="text-sm text-gray-500">Manage Reality2 system settings</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Backup & Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Backup Schedule</div>
                  <div className="text-sm text-gray-500">Configure automatic backup settings</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Storage Management</div>
                  <div className="text-sm text-gray-500">Manage storage allocation and cleanup</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Alert Configuration</div>
                  <div className="text-sm text-gray-500">Configure system alerts and notifications</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Notification Channels</div>
                  <div className="text-sm text-gray-500">Manage notification delivery methods</div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm">Configure</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
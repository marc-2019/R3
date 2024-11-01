import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { websocketService, type DataUpdateType } from '@/services/websocket-service';
import { DockerStatus } from '@/components/docker-status';

import {
  HardDrive,
  Database,
  Save,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowUpDown,
  FileDown,
  Settings,
  Activity,
  Lock,
  Users
} from 'lucide-react';

<DockerStatus />

interface DataAccessControl {
  userId: string;
  username: string;
  role: string;
  permissions: string[];
  lastAccess?: string;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'error';
  size: string;
  lastCheck: string;
  growth: string;
  warning?: string;
}

interface DataHealth {
  postgres: HealthStatus;
  redis: HealthStatus;
  rootNetwork: HealthStatus;
  reality2: HealthStatus;
}

interface BackupStatus {
  lastBackup: string;
  nextScheduled: string;
  backupCount: number;
  totalSize: string;
}

const DataDashboard = () => {
  const [dataHealth, setDataHealth] = useState<DataHealth>({
    postgres: {
      status: 'healthy',
      size: '1.5 GB',
      lastCheck: '2024-01-28 15:00:00',
      growth: '+2.5% this week'
    },
    redis: {
      status: 'healthy',
      size: '256 MB',
      lastCheck: '2024-01-28 15:00:00',
      growth: '+1.2% this week'
    },
    rootNetwork: {
      status: 'healthy',
      size: '500 MB',
      lastCheck: '2024-01-28 15:00:00',
      growth: '+5% this week'
    },
    reality2: {
      status: 'warning',
      size: '750 MB',
      lastCheck: '2024-01-28 15:00:00',
      growth: '+8% this week',
      warning: 'High growth rate detected'
    }
  });
  
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    lastBackup: '2024-01-28 15:30:00',
    nextScheduled: '2024-01-29 03:00:00',
    backupCount: 5,
    totalSize: '2.3 GB'
  });

  const [dataAccess, setDataAccess] = useState<DataAccessControl[]>([
    {
      userId: '1',
      username: 'admin',
      role: 'Administrator',
      permissions: ['read', 'write', 'backup', 'restore'],
      lastAccess: '2024-01-28 15:00:00'
    },
    {
      userId: '2',
      username: 'operator',
      role: 'Operator',
      permissions: ['read', 'backup'],
      lastAccess: '2024-01-28 14:30:00'
    }
  ]);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to updates
    const unsubscribeHealth = websocketService.subscribe('health', (updateData) => {
      setDataHealth(prevHealth => ({
        ...prevHealth,
        ...updateData
      }));
    });

    const unsubscribeBackup = websocketService.subscribe('backup', (updateData) => {
      setBackupStatus(prevStatus => ({
        ...prevStatus,
        ...updateData
      }));
    });

    const unsubscribeSystem = websocketService.subscribe('system', (updateData) => {
      // Handle system updates
      console.log('System update:', updateData);
    });

    const unsubscribeAlert = websocketService.subscribe('alert', (updateData) => {
      // Handle alerts
      console.log('Alert received:', updateData);
    });

    // Cleanup function
    return () => {
      unsubscribeHealth();
      unsubscribeBackup();
      unsubscribeSystem();
      unsubscribeAlert();
      websocketService.close();
    };
}, []);

  // Access Control Panel
  const AccessControlPanel = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Data Access Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dataAccess.map(access => (
            <div key={access.userId} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">{access.username}</div>
                  <div className="text-sm text-gray-500">{access.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {access.permissions.map(perm => (
                    <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {perm}
                    </span>
                  ))}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button className="w-full p-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50">
            Add User Access
          </button>
        </div>
      </CardContent>
    </Card>
  );

  // Render enhanced dashboard
  return (
    <div className="p-6 space-y-6">
      {/* ... Previous dashboard content ... */}
      
      {/* Add Access Control Panel */}
      <AccessControlPanel />
    </div>
  );
};

export default DataDashboard;

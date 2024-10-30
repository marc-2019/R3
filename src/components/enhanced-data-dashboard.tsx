import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { subscribeToDataUpdates, type DataUpdate } from '@/services/websocket-service';
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

interface DataAccessControl {
  userId: string;
  username: string;
  role: string;
  permissions: string[];
  lastAccess?: string;
}

const DataDashboard = () => {
  // ... Previous state declarations ...

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
    // Subscribe to real-time updates
    const unsubscribe = subscribeToDataUpdates((update: DataUpdate) => {
      switch (update.type) {
        case 'health':
          setDataHealth(prevHealth => ({
            ...prevHealth,
            ...update.data
          }));
          break;
        case 'backup':
          setBackupStatus(prevStatus => ({
            ...prevStatus,
            ...update.data
          }));
          break;
        case 'system':
          // Handle system updates
          break;
        case 'alert':
          // Handle alerts
          break;
      }
    });

    return () => unsubscribe();
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

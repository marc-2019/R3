import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
  Activity
} from 'lucide-react';

const DataDashboard = () => {
  const [backupStatus, setBackupStatus] = useState({
    lastBackup: '2024-01-28 15:30:00',
    nextScheduled: '2024-01-29 03:00:00',
    backupCount: 5,
    totalSize: '2.3 GB'
  });

  const [dataHealth, setDataHealth] = useState({
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

  const [backupHistory, setBackupHistory] = useState([
    {
      id: 1,
      timestamp: '2024-01-28 03:00:00',
      size: '2.3 GB',
      status: 'success',
      duration: '5m 23s'
    },
    {
      id: 2,
      timestamp: '2024-01-27 03:00:00',
      size: '2.2 GB',
      status: 'success',
      duration: '5m 12s'
    }
  ]);

  const triggerBackup = async () => {
    // Implementation would call your backup script
    console.log('Triggering backup...');
  };

  const restoreBackup = async (backupId) => {
    // Implementation would call your restore script
    console.log(`Restoring backup ${backupId}...`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Management</h1>
          <p className="text-gray-500">System data health and backup status</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerBackup}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Backup Now
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Last Backup</div>
                  <div className="text-2xl font-bold">{backupStatus.backupCount}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{backupStatus.lastBackup}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-sm font-medium">Total Size</div>
                  <div className="text-2xl font-bold">{backupStatus.totalSize}</div>
                </div>
              </div>
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-sm font-medium">Next Backup</div>
                  <div className="text-sm text-gray-500">{backupStatus.nextScheduled}</div>
                </div>
              </div>
              <Settings className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">System Health</div>
                  <div className="text-sm">
                    {Object.values(dataHealth).every(h => h.status === 'healthy') ? (
                      <span className="text-green-500">All Systems Healthy</span>
                    ) : (
                      <span className="text-yellow-500">Attention Required</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Data Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(dataHealth).map(([system, health]) => (
              <div key={system} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium capitalize">{system}</div>
                  <div className={`flex items-center gap-1 ${getStatusColor(health.status)}`}>
                    {health.status === 'healthy' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <span className="capitalize">{health.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Size:</div>
                  <div>{health.size}</div>
                  <div className="text-gray-500">Growth:</div>
                  <div>{health.growth}</div>
                  <div className="text-gray-500">Last Check:</div>
                  <div>{health.lastCheck}</div>
                </div>
                {health.warning && (
                  <Alert className="mt-2 bg-yellow-50 border-yellow-100">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-sm">
                      {health.warning}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    backup.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {backup.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Backup {backup.id}</div>
                    <div className="text-sm text-gray-500">{backup.timestamp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-sm text-gray-500">
                    <div>Size: {backup.size}</div>
                    <div>Duration: {backup.duration}</div>
                  </div>
                  <button
                    onClick={() => restoreBackup(backup.id)}
                    className="px-3 py-1 border rounded-md hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataDashboard;

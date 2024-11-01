// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, 
  Database, 
  Network, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HelpPanel } from '@/components/ui/help-panel';

interface SystemStatus {
  database: boolean;
  redis: boolean;
  rootNetwork?: boolean;
  reality2?: boolean;
}

export default function DashboardPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true); // Track first visit

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setStatus(data.services);
        setError(null);
      } catch (err) {
        setError('Failed to fetch system status');
        console.error('Status check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedDashboard');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('hasVisitedDashboard', 'true');
    }

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">System Dashboard</h1>
          <p className="text-gray-500">Monitor and manage your system connections</p>
        </div>
        <button
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          onClick={() => {/* Add quick tour logic */}}
        >
          <Info className="h-4 w-4" />
          Quick Tour
        </button>
      </div>

      {/* Welcome Message for First-Time Users */}
      {isFirstVisit && (
        <div className="bg-blue-50 p-4 rounded-md flex items-start gap-3 text-blue-700">
          <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Welcome to R3 System</h3>
            <p className="text-sm mt-1">
              This dashboard helps you monitor your connections and system health. 
              Start by configuring your connections to Root Network and Reality2 systems.
              Need help? Use the help button in the bottom right corner.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              {status?.database ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Disconnected
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Root Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Root Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              {status?.rootNetwork ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600">
                  <Activity className="h-4 w-4" />
                  Not Connected
                </span>
              )}
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Configure Connection
            </button>
          </CardContent>
        </Card>

        {/* Reality2 Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Reality2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              {status?.reality2 ? (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600">
                  <Activity className="h-4 w-4" />
                  Not Connected
                </span>
              )}
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Configure Connection
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">1. Configure Connections</h3>
            <p className="text-sm text-gray-600">Set up your connections to Root Network and Reality2 systems using the configuration buttons above.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">2. Verify Status</h3>
            <p className="text-sm text-gray-600">Check the connection status indicators to ensure everything is properly connected.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">3. Monitor Activity</h3>
            <p className="text-sm text-gray-600">Use the dashboard to monitor system health and connection status in real-time.</p>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      <HelpPanel section="dashboard" />
    </div>
  );
}
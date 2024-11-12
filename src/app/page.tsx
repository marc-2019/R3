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
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[20vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Dashboard</h1>
        <button
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          onClick={() => {}}
        >
          <Info className="h-4 w-4" />
          Quick Tour
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <HelpPanel section="dashboard" />
    </div>
  );
}

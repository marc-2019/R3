// src/components/network/RootNetworkSettings.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NetworkStats, ConnectionStatus } from '@/types/network';
import { RootNetworkService } from '@/services/rootNetworkService';

const RootNetworkSettings = () => {
  const [network, setNetwork] = useState<RootNetworkService | null>(null);
  const [endpoint, setEndpoint] = useState('ws://127.0.0.1:9944');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (network) {
        network.disconnect();
      }
    };
  }, []);

  const handleConnect = async () => {
    try {
      setStatus('connecting');
      setError(null);

      const networkService = new RootNetworkService(endpoint);
      
      networkService.on('connectionStatus', (isConnected: boolean) => {
        setStatus(isConnected ? 'connected' : 'disconnected');
      });

      networkService.on('error', (err: Error) => {
        setError(err.message);
        setStatus('error');
      });

      await networkService.connect();
      setNetwork(networkService);

      // Get initial stats
      const initialStats = await networkService.getNetworkStatus();
      if (initialStats) {
        setStats(initialStats);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setStatus('error');
    }
  };

  const handleDisconnect = async () => {
    if (network) {
      await network.disconnect();
      setNetwork(null);
      setStatus('disconnected');
      setStats(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Root Network Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            {status === 'connected' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <h3 className="font-semibold">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
          </div>
          {stats && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Chain: {stats.chain}</p>
              <p>Version: {stats.version}</p>
              <p>Block: #{stats.blockNumber}</p>
              <p>Peers: {stats.health?.peers}</p>
            </div>
          )}
        </div>

        {/* WebSocket Endpoint Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">WebSocket Endpoint</label>
          <Input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="ws://127.0.0.1:9944"
          />
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleConnect}
            disabled={status === 'connecting' || status === 'connected'}
            className="flex-1"
          >
            {status === 'connecting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect'
            )}
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={status !== 'connected'}
            variant="destructive"
            className="flex-1"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RootNetworkSettings;
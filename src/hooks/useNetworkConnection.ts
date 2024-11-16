// src/hooks/useNetworkConnection.ts
'use client';

import { useState, useEffect } from 'react';
import { NetworkService, NetworkStats, ConnectionStatus, NetworkState } from '@/types/network';

export function useNetworkConnection() {
  const [state, setState] = useState<NetworkState>({
    status: 'disconnected',
    stats: null,
    error: null
  });
  const [network, setNetwork] = useState<NetworkService | null>(null);

  useEffect(() => {
    return () => {
      if (network) {
        network.disconnect();
      }
    };
  }, [network]);

  const connect = async (endpoint: string) => {
    try {
      setState(prev => ({ ...prev, status: 'connecting', error: null }));

      // TODO: Replace with proper NetworkService instantiation
      const networkService = new (window as any).NetworkService(endpoint) as NetworkService;
      
      networkService.on('connectionStatus', (isConnected: boolean) => {
        setState(prev => ({
          ...prev,
          status: isConnected ? 'connected' : 'disconnected'
        }));
      });

      networkService.on('error', (err: Error) => {
        setState(prev => ({
          ...prev,
          error: err.message,
          status: 'error'
        }));
      });

      await networkService.connect();
      setNetwork(networkService);

      const stats = await networkService.getNetworkStatus();
      setState(prev => ({ ...prev, stats }));

    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to connect',
        status: 'error'
      }));
    }
  };

  const disconnect = async () => {
    if (network) {
      await network.disconnect();
      setNetwork(null);
      setState({
        status: 'disconnected',
        stats: null,
        error: null
      });
    }
  };

  return {
    ...state,
    connect,
    disconnect
  };
}
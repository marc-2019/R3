// src/components/network/NetworkSettingsForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Web3 from 'web3';

// Types
enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  PORCINI = 'porcini'
}

interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  networkType: NetworkType;
  name: string;
}

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  [NetworkType.MAINNET]: {
    rpcUrl: 'https://root.rootnet.live',
    chainId: 7668,
    networkType: NetworkType.MAINNET,
    name: 'Root Network Mainnet'
  },
  [NetworkType.TESTNET]: {
    rpcUrl: 'https://api-test.rootnet.app',
    chainId: 7672,
    networkType: NetworkType.TESTNET,
    name: 'Root Network Testnet'
  },
  [NetworkType.PORCINI]: {
    rpcUrl: 'https://api.rootnet.app/porcini',
    chainId: 7672,
    networkType: NetworkType.PORCINI,
    name: 'Root Network Porcini'
  }
};

const NetworkSettingsForm = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(NETWORK_CONFIGS[NetworkType.TESTNET]);
  const [customRpcUrl, setCustomRpcUrl] = useState('');
  const [customChainId, setCustomChainId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    currentBlock: undefined as number | undefined,
    latency: undefined as number | undefined,
    lastError: undefined as string | undefined
  });

  const networkOptions = Object.entries(NETWORK_CONFIGS).map(([value, config]) => ({
    value,
    label: config.name
  }));

  const handleNetworkSelect = (value: string) => {
    setSelectedNetwork(NETWORK_CONFIGS[value as NetworkType]);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const web3 = new Web3(selectedNetwork.rpcUrl);
      const networkId = await web3.eth.net.getId();
      
      if (networkId !== selectedNetwork.chainId) {
        throw new Error(`Network ID mismatch. Expected ${selectedNetwork.chainId}, got ${networkId}`);
      }

      const currentBlock = await web3.eth.getBlockNumber();
      
      setConnectionStatus({
        isConnected: true,
        currentBlock,
        latency: undefined,
        lastError: undefined
      });
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        currentBlock: undefined,
        latency: undefined,
        lastError: error instanceof Error ? error.message : 'Connection failed'
      });
    } finally {
      setIsConnecting(false);
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
            {connectionStatus.isConnected ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <h3 className="font-semibold">
              {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
            </h3>
          </div>
          {connectionStatus.currentBlock && (
            <p className="text-sm text-gray-500 mt-1">
              Current Block: {connectionStatus.currentBlock}
            </p>
          )}
        </div>

        {/* Network Selection */}
        <Select
          label="Network"
          options={networkOptions}
          value={selectedNetwork.networkType}
          onChange={(e) => handleNetworkSelect(e.target.value)}
        />

        {/* Custom Network Input */}
        <div className="space-y-4">
          <h3 className="font-medium">Add Custom Network</h3>
          <div className="space-y-2">
            <Input
              placeholder="RPC URL"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
            />
            <Input
              placeholder="Chain ID"
              type="number"
              value={customChainId}
              onChange={(e) => setCustomChainId(e.target.value)}
            />
            <Button
              onClick={() => {}}
              disabled={!customRpcUrl || !customChainId}
              className="w-full"
            >
              Add Network
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {connectionStatus.lastError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{connectionStatus.lastError}</AlertDescription>
          </Alert>
        )}

        {/* Connect Button */}
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Connecting...' : 'Test Connection'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NetworkSettingsForm;
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

interface ConnectionStatus {
  isConnected: boolean;
  currentBlock?: number;
  latency?: number;
  lastError?: string;
}

// Constants
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

// Web3 Service
class Web3Service {
  private static instance: Web3Service;
  private web3Instance: Web3 | null = null;
  private config: NetworkConfig | null = null;
  private statusCallbacks: ((status: ConnectionStatus) => void)[] = [];
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  public async connect(networkType: NetworkType | NetworkConfig): Promise<void> {
    try {
      await this.disconnect();
      
      this.config = typeof networkType === 'string' 
        ? NETWORK_CONFIGS[networkType]
        : networkType;

      this.web3Instance = new Web3(this.config.rpcUrl);
      
      const networkId = await this.web3Instance.eth.net.getId();
      if (networkId !== this.config.chainId) {
        throw new Error(`Network ID mismatch. Expected ${this.config.chainId}, got ${networkId}`);
      }

      this.startConnectionMonitoring();
      
      this.updateStatus({
        isConnected: true,
        networkType: this.config.networkType,
        currentBlock: await this.getCurrentBlock()
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      this.updateStatus({
        isConnected: false,
        lastError: errorMessage
      });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }

    this.web3Instance = null;
    this.config = null;
    
    this.updateStatus({
      isConnected: false
    });
  }

  public onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  private async getCurrentBlock(): Promise<number> {
    if (!this.web3Instance) return 0;
    try {
      return await this.web3Instance.eth.getBlockNumber();
    } catch {
      return 0;
    }
  }

  private startConnectionMonitoring(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(async () => {
      try {
        const startTime = Date.now();
        const block = await this.getCurrentBlock();
        const latency = Date.now() - startTime;

        this.updateStatus({
          isConnected: true,
          currentBlock: block,
          networkType: this.config?.networkType,
          latency
        });
      } catch (error) {
        this.updateStatus({
          isConnected: false,
          lastError: 'Connection lost'
        });
      }
    }, 5000);
  }

  private updateStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach(callback => callback(status));
  }
}

// Settings Store
interface NetworkSettings {
  activeNetwork: NetworkConfig;
  customNetworks: NetworkConfig[];
  connectionStatus: ConnectionStatus;
}

interface NetworkSettingsState extends NetworkSettings {
  setActiveNetwork: (network: NetworkConfig) => void;
  addCustomNetwork: (network: NetworkConfig) => void;
  removeCustomNetwork: (rpcUrl: string) => void;
  updateConnectionStatus: (status: Partial<ConnectionStatus>) => void;
}

const useNetworkSettings = create<NetworkSettingsState>()(
  persist(
    (set) => ({
      activeNetwork: NETWORK_CONFIGS[NetworkType.TESTNET],
      customNetworks: [],
      connectionStatus: {
        isConnected: false
      },

      setActiveNetwork: (network) =>
        set({ activeNetwork: network }),

      addCustomNetwork: (network) =>
        set((state) => ({
          customNetworks: [...state.customNetworks, network],
        })),

      removeCustomNetwork: (rpcUrl) =>
        set((state) => ({
          customNetworks: state.customNetworks.filter(
            (network) => network.rpcUrl !== rpcUrl
          ),
        })),

      updateConnectionStatus: (status) =>
        set((state) => ({
          connectionStatus: { ...state.connectionStatus, ...status },
        })),
    }),
    {
      name: 'network-settings',
    }
  )
);

const NetworkSettings = () => {
  const {
    activeNetwork,
    connectionStatus,
    setActiveNetwork,
    addCustomNetwork,
    updateConnectionStatus,
  } = useNetworkSettings();

  const [customRpcUrl, setCustomRpcUrl] = useState('');
  const [customChainId, setCustomChainId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const web3Service = Web3Service.getInstance();
    
    const unsubscribe = web3Service.onStatusChange((status) => {
      updateConnectionStatus(status);
    });

    handleConnect(activeNetwork);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNetworkChange = async (networkType: NetworkType) => {
    const network = NETWORK_CONFIGS[networkType];
    await handleConnect(network);
  };

  const handleConnect = async (network: NetworkConfig) => {
    setIsConnecting(true);
    try {
      const web3Service = Web3Service.getInstance();
      await web3Service.connect(network);
      setActiveNetwork(network);
    } catch (error) {
      updateConnectionStatus({
        isConnected: false,
        lastError: error instanceof Error ? error.message : 'Connection failed',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddCustomNetwork = async () => {
    if (!customRpcUrl || !customChainId) return;

    const customNetwork: NetworkConfig = {
      rpcUrl: customRpcUrl,
      chainId: parseInt(customChainId),
      networkType: NetworkType.MAINNET,
      name: `Custom Network (${customRpcUrl})`,
    };

    addCustomNetwork(customNetwork);
    setCustomRpcUrl('');
    setCustomChainId('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Root Network Settings</CardTitle>
        <CardDescription>
          Configure and manage your Root Network connection
        </CardDescription>
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
          {connectionStatus.latency && (
            <p className="text-sm text-gray-500">
              Latency: {connectionStatus.latency}ms
            </p>
          )}
        </div>

        {/* Network Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Network</label>
          <Select
            onValueChange={(value: NetworkType) => handleNetworkChange(value)}
            defaultValue={activeNetwork.networkType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(NETWORK_CONFIGS).map(([key, network]) => (
                <SelectItem key={key} value={key}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              onClick={handleAddCustomNetwork}
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
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button
          onClick={() => handleConnect(activeNetwork)}
          disabled={isConnecting}
        >
          {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConnecting ? 'Connecting...' : 'Test Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NetworkSettings;
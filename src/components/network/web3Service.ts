// src/services/web3Service.ts
import Web3 from 'web3';
import { WebsocketProvider } from 'web3-core';

export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  PORCINI = 'porcini'
}

export interface NetworkConfig {
  rpcUrl: string;
  chainId: number;
  networkType: NetworkType;
  name: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  currentBlock?: number;
  networkType?: NetworkType;
  lastError?: string;
  latency?: number;
}

export type ConnectionEventCallback = (status: ConnectionStatus) => void;

export const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
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

export class Web3Service {
  private web3Instance: Web3 | null = null;
  private config: NetworkConfig | null = null;
  private statusCallbacks: ConnectionEventCallback[] = [];
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private connectionCheckInterval: NodeJS.Timeout | null = null;

  private static instance: Web3Service;

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

    if (this.web3Instance?.currentProvider) {
      const provider = this.web3Instance.currentProvider as WebsocketProvider;
      if (provider.disconnect) {
        await provider.disconnect();
      }
    }

    this.web3Instance = null;
    this.config = null;
    this.reconnectAttempts = 0;
    
    this.updateStatus({
      isConnected: false
    });
  }

  public getWeb3(): Web3 {
    if (!this.web3Instance) {
      throw new Error('Web3 not initialized. Call connect() first.');
    }
    return this.web3Instance;
  }

  public getCurrentConfig(): NetworkConfig | null {
    return this.config;
  }

  public onStatusChange(callback: ConnectionEventCallback): () => void {
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

        this.reconnectAttempts = 0;
      } catch (error) {
        this.handleConnectionError();
      }
    }, 5000);
  }

  private async handleConnectionError(): Promise<void> {
    this.updateStatus({
      isConnected: false,
      lastError: 'Connection lost'
    });

    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      try {
        await this.connect(this.config!);
      } catch {
        // Reconnect attempt failed, status already updated
      }
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach(callback => callback(status));
  }
}
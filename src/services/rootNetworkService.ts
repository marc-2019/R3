import { ApiPromise, WsProvider } from '@polkadot/api';
import { EventEmitter } from 'events';
import { NetworkStats, ChainBridgeConfig } from '../types/network';
import { BehaviorSubject } from 'rxjs';

export class RootNetworkService extends EventEmitter {
  private api: ApiPromise | null = null;
  private wsProvider: WsProvider | null = null;
  private networkStatus = new BehaviorSubject<NetworkStats | null>(null);
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(private wsEndpoint: string) {
    super();
  }

  async connect() {
    try {
      this.wsProvider = new WsProvider(this.wsEndpoint);
      
      // Handle connection events
      this.wsProvider.on('connected', () => this.handleConnectionStatus(true));
      this.wsProvider.on('disconnected', () => this.handleConnectionStatus(false));
      this.wsProvider.on('error', (error) => this.handleError(error));

      this.api = await ApiPromise.create({ 
        provider: this.wsProvider,
        types: {
          // Add any custom types here
        }
      });

      // Initialize monitoring
      await this.initializeMonitoring();
      
      // Reset reconnect counter on successful connection
      this.reconnectAttempts = 0;
      
      return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private async initializeMonitoring() {
    if (!this.api) throw new Error('API not initialized');

    try {
      // Subscribe to new blocks
      const unsubscribeHeaders = await this.api.rpc.chain.subscribeNewHeads(
        (header) => {
          this.updateNetworkStatus({
            blockNumber: header.number.toNumber(),
            blockHash: header.hash.toHex()
          });
        }
      );

      // Subscribe to finalized heads
      const unsubscribeFinalized = await this.api.rpc.chain.subscribeFinalizedHeads(
        (header) => {
          this.updateNetworkStatus({
            finalizedBlock: header.number.toNumber(),
            finalizedBlockHash: header.hash.toHex()
          });
        }
      );

      // Get initial chain state
      const [chain, version, health] = await Promise.all([
        this.api.rpc.system.chain(),
        this.api.rpc.system.version(),
        this.api.rpc.system.health()
      ]);

      this.updateNetworkStatus({
        chain: chain.toString(),
        version: version.toString(),
        health: {
          isSyncing: health.isSyncing.isTrue,
          peers: health.peers.toNumber()
        }
      });

      return () => {
        unsubscribeHeaders();
        unsubscribeFinalized();
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleConnectionStatus(isConnected: boolean) {
    if (!isConnected && this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts));
    }
    
    this.emit('connectionStatus', isConnected);
  }

  private handleError(error: any) {
    console.error('Root Network Error:', error);
    this.emit('error', error);
  }

  private updateNetworkStatus(update: Partial<NetworkStats>) {
    const currentStatus = this.networkStatus.getValue();
    this.networkStatus.next({
      ...currentStatus,
      ...update
    } as NetworkStats);
  }

  async getNetworkStatus(): Promise<NetworkStats | null> {
    if (!this.api) throw new Error('API not initialized');

    try {
      const [chain, version, health] = await Promise.all([
        this.api.rpc.system.chain(),
        this.api.rpc.system.version(),
        this.api.rpc.system.health()
      ]);

      const status: NetworkStats = {
        chain: chain.toString(),
        version: version.toString(),
        health: {
          isSyncing: health.isSyncing.isTrue,
          peers: health.peers.toNumber()
        },
        ...this.networkStatus.getValue()
      };

      return status;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async disconnect() {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
    if (this.wsProvider) {
      this.wsProvider.disconnect();
      this.wsProvider = null;
    }
  }

  getApi(): ApiPromise {
    if (!this.api) throw new Error('API not initialized');
    return this.api;
  }
}

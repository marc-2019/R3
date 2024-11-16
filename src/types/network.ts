import { H160 } from '@polkadot/types/primitive';

// Network Service Interface
export interface NetworkService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getNetworkStatus(): Promise<NetworkStats>;
  getBridgeConfig?(): Promise<ChainBridgeConfig>;
  on(event: NetworkEvent, callback: (data: any) => void): void;
  off?(event: NetworkEvent, callback: (data: any) => void): void;
}

// Network Events
export type NetworkEvent = 
  | 'connectionStatus' 
  | 'error' 
  | 'blockUpdate'
  | 'bridgeEvent';

// Existing NetworkStats enhanced with more detail
export interface NetworkStats {
  chain?: string;
  version?: string;
  blockNumber?: number;
  blockHash?: string;
  finalizedBlock?: number;
  finalizedBlockHash?: string;
  health?: {
    isSyncing: boolean;
    peers: number;
  };
}

// Bridge Configuration
export interface ChainBridgeConfig {
  erc20Contract?: H160;
  nftContract?: H160;
  xrplBridge?: H160;
  rootPegAddress?: H160;
}

// Network Error
export interface NetworkError extends Error {
  code?: string;
  data?: any;
}

// Connection Status
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Network Configuration
export interface NetworkConfig {
  wsEndpoint: string;
  chainId?: number;
  name?: string;
}

// Bridge Events
export interface BridgeEvent {
  type: 'deposit' | 'withdraw';
  assetId: number;
  amount: string;
  from: string;
  to: string;
  txHash: string;
}

// Network State Management
export interface NetworkState {
  status: ConnectionStatus;
  stats: NetworkStats | null;
  error: string | null;
  bridgeConfig?: ChainBridgeConfig;
  lastEvent?: BridgeEvent;
}
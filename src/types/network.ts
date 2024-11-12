import { H160 } from '@polkadot/types/primitive';

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

export interface ChainBridgeConfig {
  erc20Contract?: H160;
  nftContract?: H160;
  xrplBridge?: H160;
  rootPegAddress?: H160;
}

export interface NetworkError extends Error {
  code?: string;
  data?: any;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface NetworkConfig {
  wsEndpoint: string;
  chainId?: number;
  name?: string;
}

export interface BridgeEvent {
  type: 'deposit' | 'withdraw';
  assetId: number;
  amount: string;
  from: string;
  to: string;
  txHash: string;
}

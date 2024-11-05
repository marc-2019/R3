// src/services/web3/types.ts
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
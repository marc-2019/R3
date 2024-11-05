// src/services/web3/constants.ts
import { NetworkType, NetworkConfig } from './types';

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
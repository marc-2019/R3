// src/stores/networkSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NetworkType, NetworkConfig, NETWORK_CONFIGS } from '@/services/web3';

interface NetworkSettings {
  activeNetwork: NetworkConfig;
  customNetworks: NetworkConfig[];
  connectionStatus: {
    isConnected: boolean;
    currentBlock?: number;
    latency?: number;
    lastError?: string;
  };
}

interface NetworkSettingsState extends NetworkSettings {
  setActiveNetwork: (network: NetworkConfig) => void;
  addCustomNetwork: (network: NetworkConfig) => void;
  removeCustomNetwork: (rpcUrl: string) => void;
  updateConnectionStatus: (status: Partial<NetworkSettings['connectionStatus']>) => void;
}

export const useNetworkSettings = create<NetworkSettingsState>()(
  persist(
    (set) => ({
      // Default to testnet for development
      activeNetwork: NETWORK_CONFIGS[NetworkType.TESTNET],
      customNetworks: [],
      connectionStatus: {
        isConnected: false,
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
// src/components/network/NetworkSettingsContainer.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RootNetworkSettings from './RootNetworkSettings';
import EVMNetworkSettings from './EVMNetworkSettings';

export const NetworkSettingsContainer = () => {
  return (
    <Tabs defaultValue="root" className="w-full">
      <TabsList>
        <TabsTrigger value="root">Root Network</TabsTrigger>
        <TabsTrigger value="evm">EVM Networks</TabsTrigger>
      </TabsList>
      <TabsContent value="root">
        <RootNetworkSettings />
      </TabsContent>
      <TabsContent value="evm">
        <EVMNetworkSettings />
      </TabsContent>
    </Tabs>
  );
};
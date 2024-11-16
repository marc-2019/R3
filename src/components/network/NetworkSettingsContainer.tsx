// src/components/network/NetworkSettingsContainer.tsx
// Description: Network settings container with improved tab styling

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RootNetworkSettings from './RootNetworkSettings';
import EVMNetworkSettings from './EVMNetworkSettings';

export const NetworkSettingsContainer = () => {
  return (
    <Tabs defaultValue="root" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1">
        <TabsTrigger 
          value="root"
          className="rounded-md py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Root Network
        </TabsTrigger>
        <TabsTrigger 
          value="evm"
          className="rounded-md py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          EVM Networks
        </TabsTrigger>
      </TabsList>
      <TabsContent value="root" className="mt-6">
        <RootNetworkSettings />
      </TabsContent>
      <TabsContent value="evm" className="mt-6">
        <EVMNetworkSettings />
      </TabsContent>
    </Tabs>
  );
};
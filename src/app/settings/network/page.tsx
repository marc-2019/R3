// src/app/settings/network/page.tsx
import { NetworkSettingsContainer } from '@/components/network/NetworkSettingsContainer';

export default function NetworkSettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Network Settings</h2>
      <NetworkSettingsContainer />
    </div>
  );
}
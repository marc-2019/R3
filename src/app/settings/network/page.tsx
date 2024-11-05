// src/app/settings/network/page.tsx
import NetworkSettingsForm from '@/components/network/NetworkSettingsForm';

export default function NetworkSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Network Settings</h1>
      <p className="text-gray-500 mb-6">
        Configure and manage Root Network connections
      </p>
      <NetworkSettingsForm />
    </div>
  );
}
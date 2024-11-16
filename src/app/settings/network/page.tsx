// src/app/settings/network/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { redirect } from "next/navigation";
import NetworkSettingsContent from '@/components/network/NetworkSettingsContent';

export default async function NetworkSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <NetworkSettingsContent />;
}
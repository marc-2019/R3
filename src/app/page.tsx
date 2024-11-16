// src/app/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { redirect } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <DashboardContent />;
}
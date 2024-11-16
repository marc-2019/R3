// src/app/data/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { redirect } from "next/navigation";
import DataPageContent from '@/components/data/DataPageContent';

export default async function DataPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <DataPageContent />;
}
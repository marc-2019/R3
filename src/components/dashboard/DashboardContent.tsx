// src/components/dashboard/DashboardContent.tsx
'use client';

import { useState, useEffect } from "react";
import { Activity, Database, Network, CheckCircle2, XCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardContent() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        setStatus(data.services);
        setError(null);
      } catch {
        setError("Failed to fetch system status");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[20vh]">
      <div className="animate-spin h-8 w-8 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Dashboard</h1>
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <Info className="h-4 w-4" /> Quick Tour
        </button>
      </header>

      {error && (
        <div className="p-4 bg-red-50 rounded-md text-red-700 flex items-center">
          <span className="material-icons">error_outline</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard title="Database" status={status?.database} />
        <StatusCard title="Root Network" status={status?.rootNetwork} />
        <StatusCard title="Reality2" status={status?.reality2} />
      </div>
    </div>
  );
}

function StatusCard({ title, status }) {
  return (
    <Card className="bg-white shadow rounded-lg p-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="h-5 w-5" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status ? (
          <span className="text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Connected
          </span>
        ) : (
          <span className="text-red-600 flex items-center gap-1">
            <XCircle className="h-4 w-4" /> Disconnected
          </span>
        )}
      </CardContent>
    </Card>
  );
}
// src/components/docker-status.tsx

'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export function DockerStatus() {
  const [status, setStatus] = useState<{
    ok: boolean;
    message: string;
    services: string[];
  } | null>(null);

  useEffect(() => {
    const checkDocker = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setStatus({
          ok: data.services.docker,
          message: data.message || 'Docker status check completed',
          services: data.services.missingServices || []
        });
      } catch (error) {
        setStatus({
          ok: false,
          message: 'Failed to check Docker status',
          services: []
        });
      }
    };

    checkDocker();
  }, []);

  if (!status || status.ok) return null;

  return (
    <Alert className="mx-auto mt-4 max-w-2xl bg-yellow-50 border-yellow-100">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription>
        <div className="text-yellow-700">
          <p>{status.message}</p>
          {status.services.length > 0 && (
            <p className="mt-2">Missing services: {status.services.join(', ')}</p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
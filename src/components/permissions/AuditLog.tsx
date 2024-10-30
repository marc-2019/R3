// src/components/permissions/AuditLog.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
import { AuditLog as AuditLogType } from './types';

interface AuditLogProps {
  logs: AuditLogType[];
}

const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Permission Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">{log.action}</span>
                <span className="text-sm text-gray-500 ml-2">by {log.user}</span>
                <div className="text-sm text-gray-500">{JSON.stringify(log.details)}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLog;
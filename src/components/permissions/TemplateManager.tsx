// src/components/permissions/TemplateManager.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { PermissionTemplate } from './types';

interface TemplateManagerProps {
  templates: Record<string, PermissionTemplate>;
  onApply: (templateKey: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onApply }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Permission Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(templates).map(([key, template]) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{template.name}</div>
                <button
                  onClick={() => onApply(key)}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Apply Template
                </button>
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.permissions.map(perm => (
                  <span key={perm} className="text-xs bg-gray-100 rounded-full px-2 py-1">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateManager;
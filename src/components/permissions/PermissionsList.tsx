// src/components/permissions/PermissionsList.tsx

import React from 'react';
import { CheckSquare, Square, Info } from 'lucide-react';
import { PermissionsListProps, Role } from './types';

interface ExtendedPermissionsListProps extends PermissionsListProps {
  role?: Role;
}

const PermissionsList: React.FC<ExtendedPermissionsListProps> = ({ 
  roleId, 
  permissions, 
  onToggle,
  role 
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(permissions).map(([category, { name, permissions: categoryPermissions }]) => (
        <div key={category} className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">{name}</h3>
          <div className="space-y-2">
            {Object.entries(categoryPermissions).map(([key, permission]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggle(key)}
                    className="p-1 rounded hover:bg-gray-100"
                    disabled={role?.isSystem}
                  >
                    {role?.permissions.includes(key) ? (
                      <CheckSquare className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div>
                    <div className="font-medium">{permission.name}</div>
                    <div className="text-sm text-gray-500">{permission.description}</div>
                  </div>
                </div>
                {permission.dependencies.length > 0 && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    Requires: {permission.dependencies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionsList;
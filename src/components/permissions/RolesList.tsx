// src/components/permissions/RolesList.tsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Plus, Lock } from 'lucide-react';
import { Role } from './types';

interface RolesListProps {
  roles: Role[];
  selectedRole: number | null;
  onSelectRole: (roleId: number) => void;
  onAddRole?: () => void;
}

const RolesList: React.FC<RolesListProps> = ({
  roles,
  selectedRole,
  onSelectRole,
  onAddRole
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Roles
          </div>
          <button
            onClick={onAddRole}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {roles.map(role => (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedRole === role.id
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{role.name}</div>
                  <div className="text-sm text-gray-500">
                    {role.permissions.length} permissions
                  </div>
                </div>
                {role.isSystem && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesList;
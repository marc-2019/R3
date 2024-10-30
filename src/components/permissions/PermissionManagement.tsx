// src/components/permissions/PermissionManagement.tsx

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Save } from 'lucide-react';
import RolesList from './RolesList';
import PermissionsList from './PermissionsList';
import TemplateManager from './TemplateManager';
import AuditLog from './AuditLog';
import { Role, PermissionCategory, Conflict, AuditLog as AuditLogType, PermissionTemplate } from './types';

const PermissionManagement = () => {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access',
      level: 1000,
      isSystem: true,
      permissions: ['*'],
      inherited: []
    },
    {
      id: 2,
      name: 'Department Manager',
      description: 'Department-level access',
      level: 800,
      isSystem: false,
      permissions: [
        'users.view',
        'users.edit',
        'teams.manage',
        'escalations.manage',
        'reports.view',
        'reports.create'
      ],
      inherited: ['users.view']
    }
  ]);

  const [permissions, setPermissions] = useState<Record<string, PermissionCategory>>({
    users: {
      name: 'User Management',
      permissions: {
        'users.view': { 
          name: 'View Users', 
          description: 'Can view user details',
          dependencies: [],
          impacts: ['users.list']
        },
        'users.edit': { 
          name: 'Edit Users', 
          description: 'Can edit user details',
          dependencies: ['users.view'],
          impacts: ['users.audit']
        },
        'users.create': { 
          name: 'Create Users', 
          description: 'Can create new users',
          dependencies: ['users.view', 'users.edit'],
          impacts: ['users.audit', 'teams.view']
        },
        'users.delete': { 
          name: 'Delete Users', 
          description: 'Can delete users',
          dependencies: ['users.view', 'users.edit'],
          impacts: ['users.audit', 'teams.manage']
        }
      }
    },
    teams: {
      name: 'Team Management',
      permissions: {
        'teams.view': { 
          name: 'View Teams', 
          description: 'Can view team details',
          dependencies: ['users.view'],
          impacts: []
        },
        'teams.manage': { 
          name: 'Manage Teams', 
          description: 'Can manage team settings',
          dependencies: ['teams.view', 'users.view'],
          impacts: ['escalations.view']
        }
      }
    }
  });

  const permissionTemplates: Record<string, PermissionTemplate> = {
    viewOnly: {
      name: "View Only Access",
      description: "Basic view access across modules",
      permissions: ['users.view', 'teams.view', 'escalations.view']
    },
    teamLead: {
      name: "Team Leader",
      description: "Team management and basic operational access",
      permissions: ['users.view', 'users.edit', 'teams.view', 'teams.manage']
    }
  };

  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);

  const addAuditLog = (action: string, details: Record<string, any>): void => {
    setAuditLogs(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Current User' // In real implementation, get from auth context
    }, ...prev]);
  };

  const validatePermissions = (roleId: number, newPermissions: string[]): Conflict[] => {
    const newConflicts: Conflict[] = [];
    newPermissions.forEach(permission => {
      const [category, action] = permission.split('.');
      const permissionConfig = permissions[category]?.permissions[permission];
      
      if (permissionConfig?.dependencies) {
        permissionConfig.dependencies.forEach(dep => {
          if (!newPermissions.includes(dep)) {
            newConflicts.push({
              type: 'Missing Dependency',
              description: `${permission} requires ${dep}`,
              suggestions: [{
                title: 'Add Required Permission',
                action: 'add_dependency',
                permission: dep
              }]
            });
          }
        });
      }
    });
    return newConflicts;
  };

  const handlePermissionToggle = (permissionKey: string): void => {
    if (!selectedRole) return;

    setRoles(prev => {
      const updatedRoles = prev.map(role => {
        if (role.id !== selectedRole) return role;

        let newPermissions;
        if (role.permissions.includes(permissionKey)) {
          newPermissions = role.permissions.filter(p => p !== permissionKey);
        } else {
          newPermissions = [...role.permissions, permissionKey];
        }

        const conflicts = validatePermissions(role.id, newPermissions);
        setConflicts(conflicts);

        addAuditLog(
          role.permissions.includes(permissionKey) ? 'PERMISSION_REMOVED' : 'PERMISSION_ADDED',
          { roleId: role.id, permission: permissionKey }
        );

        return {
          ...role,
          permissions: newPermissions
        };
      });

      return updatedRoles;
    });
  };

  const handleApplyTemplate = (templateKey: string): void => {
    if (!selectedRole) return;

    const template = permissionTemplates[templateKey];
    setRoles(prev => prev.map(role => {
      if (role.id !== selectedRole) return role;

      const newPermissions = Array.from(new Set([...role.permissions, ...template.permissions]));
      const conflicts = validatePermissions(role.id, newPermissions);
      setConflicts(conflicts);

      addAuditLog('TEMPLATE_APPLIED', {
        roleId: role.id,
        template: templateKey
      });

      return {
        ...role,
        permissions: newPermissions
      };
    }));
  };

  const handleAddRole = () => {
    // Implementation for adding new role
    console.log('Add new role');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Permission Management</h1>
          <p className="text-gray-500">Configure role permissions and access controls</p>
        </div>
        {selectedRole && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedRole(null)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {/* Save changes */}}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <RolesList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onAddRole={handleAddRole}
          />
        </div>

        <div className="col-span-9">
          {selectedRole ? (
            <div className="space-y-6">
              <TemplateManager
                templates={permissionTemplates}
                onApply={handleApplyTemplate}
              />
              
              {conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Permission Conflicts Detected</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside">
                      {conflicts.map((conflict, index) => (
                        <li key={index}>{conflict.description}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardContent>
                  <PermissionsList
                    roleId={selectedRole}
                    permissions={permissions}
                    onToggle={handlePermissionToggle}
                    role={roles.find(r => r.id === selectedRole)}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Select a role to configure permissions
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-12">
          <AuditLog logs={auditLogs} />
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;
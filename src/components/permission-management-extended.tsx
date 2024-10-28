import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield,
  Plus,
  Save,
  Copy,
  Lock,
  AlertTriangle,
  Info,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  FileText,
  LayoutList,
  History,
  Settings
} from 'lucide-react';

const PermissionManagement = () => {
  const [roles, setRoles] = useState([
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

  const [permissions, setPermissions] = useState({
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

  const [selectedRole, setSelectedRole] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const permissionTemplates = {
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

  const addAuditLog = (action, details) => {
    setAuditLogs(prev => [{
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Current User' // In real implementation, get from auth context
    }, ...prev]);
  };

  const validatePermissions = (roleId, newPermissions) => {
    const newConflicts = [];
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

  const PermissionsList = ({ roleId, permissions, onToggle }) => {
    const role = roles.find(r => r.id === roleId);
    
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

  const TemplateManager = ({ onApply }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Permission Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {Object.entries(permissionTemplates).map(([key, template]) => (
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

  const AuditLog = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Permission Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {auditLogs.map(log => (
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

  const handlePermissionToggle = (permissionKey) => {
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

  const handleApplyTemplate = (templateKey) => {
    if (!selectedRole) return;

    const template = permissionTemplates[templateKey];
    setRoles(prev => prev.map(role => {
      if (role.id !== selectedRole) return role;

      const newPermissions = [...new Set([...role.permissions, ...template.permissions])];
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
        {/* Roles List */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Roles
                </div>
                <button
                  onClick={() => {/* Add new role */}}
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
                    onClick={() => setSelectedRole(role.id)}
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
        </div>

        {/* Permissions Config */}
        <div className="col-span-9">
          {selectedRole ? (
            <div className="space-y-6">
              <TemplateManager onApply={handleApplyTemplate} />
              
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
                <CardHeader>
                  <CardTitle>Permissions Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermissionsList
                    roleId={selectedRole}
                    permissions={permissions}
                    onToggle={handlePermissionToggle}
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

        {/* Audit Log */}
        <div className="col-span-12">
          <AuditLog />
        </div>
      </div>
    </div>
  );
};

export default PermissionManagement;

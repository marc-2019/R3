// src/components/permissions/types.ts

export interface Role {
    id: number;
    name: string;
    description: string;
    level: number;
    isSystem: boolean;
    permissions: string[];
    inherited: string[];
  }
  
  export interface Permission {
    name: string;
    description: string;
    dependencies: string[];
    impacts: string[];
  }
  
  export interface PermissionCategory {
    name: string;
    permissions: Record<string, Permission>;
  }
  
  export interface PermissionTemplate {
    name: string;
    description: string;
    permissions: string[];
  }
  
  export interface Conflict {
    type: string;
    description: string;
    suggestions: {
      title: string;
      action: string;
      permission: string;
    }[];
  }
  
  export interface AuditLog {
    id: number;
    timestamp: string;
    action: string;
    details: Record<string, any>;
    user: string;
  }
  
  export interface PermissionsListProps {
    roleId: number;
    permissions: Record<string, PermissionCategory>;
    onToggle: (key: string) => void;
  }
  
  export interface TemplateManagerProps {
    onApply: (templateKey: string) => void;
  }
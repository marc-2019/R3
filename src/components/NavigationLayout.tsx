// src/components/NavigationLayout.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Network, 
  Layers, 
  Settings,
  Home,
  Box,
  Activity,
  Database,
  Users,
  HardDrive
} from 'lucide-react';

const NavigationLayout = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      description: 'System overview and status',
      path: '/'
    },
    {
      id: 'root-network',
      name: 'Root Network',
      icon: Network,
      description: 'Root Network node management',
      path: '/root-network'
    },
    {
      id: 'reality2',
      name: 'Reality 2',
      icon: Layers,
      description: 'Reality 2 system management',
      path: '/reality2'
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      description: 'Manage users and permissions',
      path: '/users'
    },
    {
      id: 'data',
      name: 'Data Management',
      icon: Database,
      description: 'System data and backups',
      badge: 'New',
      path: '/data'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      description: 'System configuration',
      path: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Box className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">R3 System</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/status" className="p-2 hover:bg-gray-100 rounded-md">
                <Activity className="h-5 w-5" />
              </Link>
              <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-md">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`cursor-pointer transition-all hover:shadow-lg 
                  ${currentSection === item.id ? 'ring-2 ring-blue-500' : ''}
                  bg-white rounded-lg p-6 relative`}
                onClick={() => setCurrentSection(item.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        {item.badge && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationLayout;
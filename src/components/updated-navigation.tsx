import React, { useState } from 'react';
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

const MainNavigation = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      description: 'System overview and status'
    },
    {
      id: 'root-network',
      name: 'Root Network',
      icon: Network,
      description: 'Root Network node management'
    },
    {
      id: 'reality2',
      name: 'Reality 2',
      icon: Layers,
      description: 'Reality 2 system management'
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      description: 'Manage users and permissions'
    },
    {
      id: 'data',
      name: 'Data Management',
      icon: Database,
      description: 'System data and backups',
      badge: 'New'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      description: 'System configuration'
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
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Activity className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
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
              </div>
            );
          })}
        </div>

        {/* Render selected section content */}
        <div className="mt-8">
          {currentSection === 'data' && <DataDashboard />}
          {/* Add other section components here */}
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;

// src/components/ui/help-panel.tsx

'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpPanelProps {
  section: 'dashboard' | 'connections' | 'settings' | 'data';
}

export function HelpPanel({ section }: HelpPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const helpContent = {
    dashboard: {
      title: 'System Dashboard',
      description: 'Overview of your system status and connections',
      sections: [
        {
          title: 'Connection Status',
          content: 'Monitor the health and status of your connections to Root Network and Reality2 systems. Green indicates active connections, yellow indicates configuration needed.'
        },
        {
          title: 'Quick Actions',
          content: 'Use the configuration buttons to quickly set up or modify your connections. Each connection can be independently configured and tested.'
        },
        {
          title: 'System Health',
          content: 'View real-time health metrics of your database, cache, and connected services. Problems will be highlighted in red with suggested solutions.'
        }
      ]
    },
    connections: {
      title: 'Connection Management',
      description: 'Configure and manage your system connections',
      sections: [
        {
          title: 'Root Network',
          content: 'Connect to Root Network nodes to enable data synchronization and network participation. Required fields include node URL and authentication details.'
        },
        {
          title: 'Reality2 Integration',
          content: 'Set up connections to Reality2 systems for extended functionality. Make sure you have your Reality2 API credentials ready.'
        },
        {
          title: 'Testing Connections',
          content: 'Use the test button to verify your connection settings before saving. This ensures your configuration is working correctly.'
        }
      ]
    },
    settings: {
      title: 'System Settings',
      description: 'Configure your system preferences and options',
      sections: [
        {
          title: 'Database Settings',
          content: 'Configure database connections and backup schedules. Regular backups are recommended for data safety.'
        },
        {
          title: 'Network Settings',
          content: 'Adjust network-related settings including connection timeouts and retry policies.'
        },
        {
          title: 'Notifications',
          content: 'Set up system alerts and notifications to stay informed about important system events and status changes.'
        }
      ]
    },
    data: {
      title: 'Data Management',
      description: 'View and manage data flow between systems',
      sections: [
        {
          title: 'Data Viewing',
          content: 'Monitor data transfers and view connection statistics. Use filters to focus on specific data types or time periods.'
        },
        {
          title: 'Routing Rules',
          content: 'Configure how data flows between connected systems. Set up rules to determine data handling and routing.'
        },
        {
          title: 'Monitoring',
          content: 'Track data flow performance and identify any bottlenecks or issues in your system.'
        }
      ]
    }
  };

  const content = helpContent[section];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
        aria-label="Help"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{content.title}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{content.description}</p>

          <div className="space-y-4">
            {content.sections.map((section, index) => (
              <div key={index} className="border-b pb-4">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
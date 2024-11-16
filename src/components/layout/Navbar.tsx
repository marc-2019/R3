// src/components/Navbar.tsx
// Description: Main navigation bar with client-side functionality

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Network, 
  Database, 
  Settings,
  Activity,
  Users
} from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: Home
  },
  {
    href: '/root-network',
    label: 'Root Network',
    icon: Network
  },
  {
    href: '/reality2',
    label: 'Reality 2',
    icon: Activity
  },
  {
    href: '/users',
    label: 'Users',
    icon: Users
  },
  {
    href: '/data',
    label: 'Data',
    icon: Database
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings
  }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-blue-600 font-semibold text-lg"
          >
            <Home className="h-5 w-5" />
            R3 System
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu - hidden by default */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
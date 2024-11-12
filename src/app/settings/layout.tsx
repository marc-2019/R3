// src/app/settings/layout.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNavItems = [
  { href: '/settings/network', label: 'Network Settings' },
  // Add other settings sections here
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {settingsNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block p-2 rounded-md hover:bg-gray-100 ${
                      pathname === item.href ? 'bg-gray-100 font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}
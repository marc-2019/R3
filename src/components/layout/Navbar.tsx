import Link from 'next/link';
import { Home, Database, Settings } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center gap-2 text-blue-600">
              <Home className="h-5 w-5" />
              R3 System
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/data" className="flex items-center gap-2 text-gray-600">
              <Database className="h-5 w-5" />
              Data
            </Link>
            <Link href="/settings" className="flex items-center gap-2 text-gray-600">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

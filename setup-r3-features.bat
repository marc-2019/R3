@echo off
setlocal enabledelayedexpansion

echo Setting up R3 Core Features
echo -------------------------

REM Create pages directory structure
mkdir src\app\data 2>nul
mkdir src\app\settings 2>nul
mkdir src\app\root-network 2>nul
mkdir src\app\reality2 2>nul

REM Create data management page
echo Creating data management page...
(
echo import { Card } from '@/components/ui/card';
echo import { Database, Activity, Settings } from 'lucide-react';
echo.
echo export default function DataPage() {
echo   return ^(
echo     ^<div className="space-y-6"^>
echo       ^<div className="flex justify-between items-center"^>
echo         ^<h1 className="text-2xl font-bold"^>Data Management^</h1^>
echo         ^<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"^>
echo           Add Connection
echo         ^</button^>
echo       ^</div^>
echo.
echo       ^<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"^>
echo         ^<Card className="p-6"^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Database className="h-8 w-8 text-blue-500" /^>
echo             ^<div^>
echo               ^<h3 className="font-semibold"^>Root Network^</h3^>
echo               ^<p className="text-sm text-gray-500"^>Connected^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</Card^>
echo.
echo         ^<Card className="p-6"^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Activity className="h-8 w-8 text-green-500" /^>
echo             ^<div^>
echo               ^<h3 className="font-semibold"^>Reality2^</h3^>
echo               ^<p className="text-sm text-gray-500"^>Active^</p^>
echo             ^</div^>
echo           ^/div^>
echo         ^</Card^>
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
)>src\app\data\page.tsx

REM Create settings page
echo Creating settings page...
(
echo import { Card } from '@/components/ui/card';
echo import { Settings, Shield, Users, Bell } from 'lucide-react';
echo.
echo export default function SettingsPage() {
echo   return ^(
echo     ^<div className="space-y-6"^>
echo       ^<h1 className="text-2xl font-bold"^>Settings^</h1^>
echo.
echo       ^<div className="grid grid-cols-1 md:grid-cols-2 gap-6"^>
echo         ^<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Shield className="h-8 w-8 text-blue-500" /^>
echo             ^<div^>
echo               ^<h3 className="font-semibold"^>Security Settings^</h3^>
echo               ^<p className="text-sm text-gray-500"^>
echo                 Configure authentication and access control
echo               ^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</Card^>
echo.
echo         ^<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Users className="h-8 w-8 text-green-500" /^>
echo             ^<div^>
echo               ^<h3 className="font-semibold"^>User Management^</h3^>
echo               ^<p className="text-sm text-gray-500"^>
echo                 Manage users and permissions
echo               ^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</Card^>
echo.
echo         ^<Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Bell className="h-8 w-8 text-yellow-500" /^>
echo             ^<div^>
echo               ^<h3 className="font-semibold"^>Notifications^</h3^>
echo               ^<p className="text-sm text-gray-500"^>
echo                 Configure system notifications
echo               ^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</Card^>
echo       ^</div^>
echo     ^</div^>
echo   ^);
echo }
)>src\app\settings\page.tsx

REM Create basic UI components
echo Creating UI components...
mkdir src\components\ui 2>nul
(
echo "use client";
echo.
echo interface CardProps extends React.HTMLAttributes^<HTMLDivElement^> {}
echo.
echo export function Card({ className, ...props }: CardProps) {
echo   return ^(
echo     ^<div
echo       className={`rounded-lg border bg-white shadow-sm ${className}`}
echo       {...props}
echo     /^>
echo   ^);
echo }
)>src\components\ui\card.tsx

echo Installing additional dependencies...
call npm install @radix-ui/react-dropdown-menu @radix-ui/react-slot class-variance-authority clsx tailwind-merge

echo Core features setup complete!
echo.
echo Try navigating to:
echo - /data        : Data Management
echo - /settings    : System Settings
echo.
pause

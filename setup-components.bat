@echo off
setlocal enabledelayedexpansion

echo Setting up R3 Components
echo ----------------------

REM Create directories
mkdir src\components\layout 2>nul
mkdir src\components\ui 2>nul
mkdir src\components\data 2>nul

REM Create Navbar component
echo Creating Navbar component...
(
echo import Link from 'next/link';
echo import { Home, Database, Settings } from 'lucide-react';
echo.
echo export function Navbar^(^) {
echo   return ^(
echo     ^<nav className="bg-white border-b"^>
echo       ^<div className="max-w-7xl mx-auto px-4"^>
echo         ^<div className="flex justify-between h-16"^>
echo           ^<div className="flex"^>
echo             ^<Link href="/" className="flex items-center gap-2 text-blue-600"^>
echo               ^<Home className="h-5 w-5" /^>
echo               R3 System
echo             ^</Link^>
echo           ^</div^>
echo           ^<div className="flex items-center gap-4"^>
echo             ^<Link href="/data" className="flex items-center gap-2 text-gray-600"^>
echo               ^<Database className="h-5 w-5" /^>
echo               Data
echo             ^</Link^>
echo             ^<Link href="/settings" className="flex items-center gap-2 text-gray-600"^>
echo               ^<Settings className="h-5 w-5" /^>
echo               Settings
echo             ^</Link^>
echo           ^</div^>
echo         ^</div^>
echo       ^</div^>
echo     ^</nav^>
echo   ^)
echo }
) > src\components\layout\Navbar.tsx

REM Update root layout
echo Updating root layout...
(
echo import './globals.css';
echo import { Navbar } from '@/components/layout/Navbar';
echo.
echo export default function RootLayout^(^{
echo   children,
echo ^}: ^{
echo   children: React.ReactNode
echo ^}^) ^{
echo   return ^(
echo     ^<html lang="en"^>
echo       ^<body^>
echo         ^<Navbar /^>
echo         ^<main className="max-w-7xl mx-auto px-4 py-6"^>
echo           ^{children^}
echo         ^</main^>
echo       ^</body^>
echo     ^</html^>
echo   ^);
echo ^}
) > src\app\layout.tsx

REM Update home page
echo Updating home page...
(
echo export default function Home^(^) ^{
echo   return ^(
echo     ^<div className="space-y-6"^>
echo       ^<h1 className="text-4xl font-bold"^>Welcome to R3^</h1^>
echo       ^<p className="text-lg text-gray-600"^>
echo         Root Request Router System
echo       ^</p^>
echo     ^</div^>
echo   ^);
echo ^}
) > src\app\page.tsx

echo Installing Lucide React icons...
call npm install lucide-react

echo Components setup complete!
echo.
echo Try running 'npm run dev' to see the changes
pause

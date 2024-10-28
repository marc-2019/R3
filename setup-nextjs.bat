@echo off
setlocal enabledelayedexpansion

echo Setting up Next.js application...
echo -------------------------------

REM Create Next.js configuration
echo Creating Next.js configuration...
(
echo // @ts-check
echo /** @type {import('next').NextConfig} */
echo const nextConfig = {};
echo module.exports = nextConfig;
)>next.config.js

REM Create package.json
echo Creating package.json...
(
echo {
echo   "name": "r3-system",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start",
echo     "lint": "next lint",
echo     "docker:up": "docker compose -f docker/docker-compose.yml up -d",
echo     "docker:down": "docker compose -f docker/docker-compose.yml down"
echo   },
echo   "dependencies": {
echo     "next": "14.1.0",
echo     "react": "^18",
echo     "react-dom": "^18",
echo     "typescript": "^5",
echo     "lucide-react": "0.263.1",
echo     "axios": "^1.6.5",
echo     "@prisma/client": "^5.8.1"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^20",
echo     "@types/react": "^18",
echo     "@types/react-dom": "^18",
echo     "autoprefixer": "^10.0.1",
echo     "postcss": "^8",
echo     "tailwindcss": "^3.3.0",
echo     "eslint": "^8",
echo     "eslint-config-next": "14.1.0",
echo     "prisma": "^5.8.1"
echo   }
echo }
)>package.json

REM Create tsconfig.json
echo Creating TypeScript configuration...
(
echo {
echo   "compilerOptions": {
echo     "target": "es5",
echo     "lib": ["dom", "dom.iterable", "esnext"],
echo     "allowJs": true,
echo     "skipLibCheck": true,
echo     "strict": true,
echo     "noEmit": true,
echo     "esModuleInterop": true,
echo     "module": "esnext",
echo     "moduleResolution": "bundler",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "jsx": "preserve",
echo     "incremental": true,
echo     "plugins": [{ "name": "next" }],
echo     "paths": {
echo       "@/*": ["./src/*"]
echo     }
echo   },
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
echo   "exclude": ["node_modules"]
echo }
)>tsconfig.json

REM Create directories
mkdir src\app 2>nul
mkdir src\components 2>nul
mkdir src\lib 2>nul

REM Create app layout
echo Creating app layout...
(
echo import type { Metadata } from 'next';
echo import { Inter } from 'next/font/google';
echo import './globals.css';
echo.
echo const inter = Inter({ subsets: ['latin'] });
echo.
echo export const metadata: Metadata = {
echo   title: 'R3 System',
echo   description: 'Root Request Router System',
echo };
echo.
echo export default function RootLayout({
echo   children,
echo }: {
echo   children: React.ReactNode;
echo }) {
echo   return (
echo     ^<html lang="en"^>
echo       ^<body className={inter.className}^>{children}^</body^>
echo     ^</html^>
echo   );
echo }
)>src\app\layout.tsx

REM Create main page
echo Creating main page...
(
echo export default function Home() {
echo   return (
echo     ^<main className="min-h-screen p-24"^>
echo       ^<h1 className="text-4xl font-bold"^>R3 System^</h1^>
echo       ^<p className="mt-4"^>Root Request Router System^</p^>
echo     ^</main^>
echo   );
echo }
)>src\app\page.tsx

REM Create global styles
echo Creating global styles...
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
)>src\app\globals.css

REM Create Tailwind config
echo Creating Tailwind configuration...
(
echo /** @type {import('tailwindcss').Config} */
echo module.exports = {
echo   content: [
echo     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
echo     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
echo     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
echo   ],
echo   theme: {
echo     extend: {},
echo   },
echo   plugins: [],
echo }
)>tailwind.config.js

REM Create PostCSS config
echo Creating PostCSS configuration...
(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo }
)>postcss.config.js

echo Installing dependencies...
call npm install

echo.
echo Next.js setup complete!
echo --------------------
echo To start development:
echo 1. Run: npm run dev
echo 2. Visit: http://localhost:3000
echo.
pause

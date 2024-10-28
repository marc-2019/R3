@echo off
setlocal enabledelayedexpansion

echo Setting up Next.js application - Step 3
echo -------------------------------------

REM Create layout.tsx
echo Creating app layout...
echo import './globals.css';> src\app\layout.tsx
echo.>> src\app\layout.tsx
echo export default function RootLayout({>> src\app\layout.tsx
echo   children,>> src\app\layout.tsx
echo }: {>> src\app\layout.tsx
echo   children: React.ReactNode>> src\app\layout.tsx
echo }) {>> src\app\layout.tsx
echo   return (>> src\app\layout.tsx
echo     ^<html lang="en"^>>> src\app\layout.tsx
echo       ^<body^>{children}^</body^>>> src\app\layout.tsx
echo     ^</html^>>> src\app\layout.tsx
echo   );>> src\app\layout.tsx
echo }>> src\app\layout.tsx

REM Create globals.css
echo Creating global styles...
echo @tailwind base;> src\app\globals.css
echo @tailwind components;>> src\app\globals.css
echo @tailwind utilities;>> src\app\globals.css

REM Add Tailwind CSS
echo Adding Tailwind CSS...
echo module.exports = {> tailwind.config.js
echo   content: [>> tailwind.config.js
echo     './src/**/*.{js,ts,jsx,tsx,mdx}'>> tailwind.config.js
echo   ],>> tailwind.config.js
echo   theme: {>> tailwind.config.js
echo     extend: {}>> tailwind.config.js
echo   },>> tailwind.config.js
echo   plugins: []>> tailwind.config.js
echo }>> tailwind.config.js

REM Create postcss.config.js
echo Creating PostCSS config...
echo module.exports = {> postcss.config.js
echo   plugins: {>> postcss.config.js
echo     tailwindcss: {},>> postcss.config.js
echo     autoprefixer: {}>> postcss.config.js
echo   }>> postcss.config.js
echo }>> postcss.config.js

REM Update package.json with Tailwind dependencies
echo Updating package.json with Tailwind...
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

echo Third step complete!
echo.
echo To start the development server:
echo 1. Run: npm run dev
echo 2. Visit: http://localhost:3000
echo.
pause

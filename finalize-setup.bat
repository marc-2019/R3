@echo off
echo Running cleanup and finalization...

REM Rename documentation files
cd docs
ren architecture-doc.txt architecture.md
ren installation-guide.txt installation.md
cd..

REM Create Next.js configuration files
echo Creating Next.js files...

REM Create next.config.js
echo /** @type {import('next').NextConfig} */ > next.config.js
echo const nextConfig = { >> next.config.js
echo   reactStrictMode: true, >> next.config.js
echo }; >> next.config.js
echo module.exports = nextConfig; >> next.config.js

REM Create tsconfig.json
echo { > tsconfig.json
echo   "compilerOptions": { >> tsconfig.json
echo     "target": "es5", >> tsconfig.json
echo     "lib": ["dom", "dom.iterable", "esnext"], >> tsconfig.json
echo     "allowJs": true, >> tsconfig.json
echo     "skipLibCheck": true, >> tsconfig.json
echo     "strict": true, >> tsconfig.json
echo     "forceConsistentCasingInFileNames": true, >> tsconfig.json
echo     "noEmit": true, >> tsconfig.json
echo     "esModuleInterop": true, >> tsconfig.json
echo     "module": "esnext", >> tsconfig.json
echo     "moduleResolution": "bundler", >> tsconfig.json
echo     "resolveJsonModule": true, >> tsconfig.json
echo     "isolatedModules": true, >> tsconfig.json
echo     "jsx": "preserve", >> tsconfig.json
echo     "incremental": true, >> tsconfig.json
echo     "plugins": [{ "name": "next" }], >> tsconfig.json
echo     "paths": { >> tsconfig.json
echo       "@/*": ["./src/*"] >> tsconfig.json
echo     } >> tsconfig.json
echo   }, >> tsconfig.json
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], >> tsconfig.json
echo   "exclude": ["node_modules"] >> tsconfig.json
echo } >> tsconfig.json

REM Create tailwind.config.js
echo /** @type {import('tailwindcss').Config} */ > tailwind.config.js
echo module.exports = { >> tailwind.config.js
echo   content: [ >> tailwind.config.js
echo     './src/pages/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.js
echo     './src/components/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.js
echo     './src/app/**/*.{js,ts,jsx,tsx,mdx}', >> tailwind.config.js
echo   ], >> tailwind.config.js
echo   theme: { extend: {} }, >> tailwind.config.js
echo   plugins: [], >> tailwind.config.js
echo }; >> tailwind.config.js

REM Create .env.example
echo # Application > .env.example
echo NEXT_PUBLIC_API_URL=http://localhost:3000 >> .env.example
echo NODE_ENV=development >> .env.example
echo # Database >> .env.example
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/r3_dev >> .env.example
echo # Docker >> .env.example
echo DOCKER_HOST=unix:///var/run/docker.sock >> .env.example

REM Create package.json if it doesn't exist
if not exist package.json (
  echo { > package.json
  echo   "name": "r3-system", >> package.json
  echo   "version": "0.1.0", >> package.json
  echo   "private": true, >> package.json
  echo   "scripts": { >> package.json
  echo     "dev": "next dev", >> package.json
  echo     "build": "next build", >> package.json
  echo     "start": "next start", >> package.json
  echo     "lint": "next lint" >> package.json
  echo   }, >> package.json
  echo   "dependencies": { >> package.json
  echo     "next": "14.1.0", >> package.json
  echo     "react": "^18", >> package.json
  echo     "react-dom": "^18", >> package.json
  echo     "typescript": "^5" >> package.json
  echo   }, >> package.json
  echo   "devDependencies": { >> package.json
  echo     "@types/node": "^20", >> package.json
  echo     "@types/react": "^18", >> package.json
  echo     "@types/react-dom": "^18", >> package.json
  echo     "autoprefixer": "^10.0.1", >> package.json
  echo     "postcss": "^8", >> package.json
  echo     "tailwindcss": "^3.3.0", >> package.json
  echo     "eslint": "^8", >> package.json
  echo     "eslint-config-next": "14.1.0" >> package.json
  echo   } >> package.json
  echo } >> package.json
)

echo Cleanup and finalization complete!
echo.
echo Next steps:
echo 1. Run 'npm install' to install dependencies
echo 2. Create a .env.local file from .env.example
echo 3. Run 'npm run dev' to start the development server
echo.
pause
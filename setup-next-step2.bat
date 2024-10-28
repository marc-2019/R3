@echo off
setlocal enabledelayedexpansion

echo Setting up Next.js application - Step 2
echo -------------------------------------

REM Create basic TypeScript config
echo Creating TypeScript configuration...
echo {> tsconfig.json
echo   "compilerOptions": {>> tsconfig.json
echo     "target": "es5",>> tsconfig.json
echo     "lib": ["dom", "dom.iterable", "esnext"],>> tsconfig.json
echo     "allowJs": true,>> tsconfig.json
echo     "skipLibCheck": true,>> tsconfig.json
echo     "strict": true,>> tsconfig.json
echo     "noEmit": true,>> tsconfig.json
echo     "esModuleInterop": true,>> tsconfig.json
echo     "module": "esnext",>> tsconfig.json
echo     "moduleResolution": "bundler",>> tsconfig.json
echo     "resolveJsonModule": true,>> tsconfig.json
echo     "isolatedModules": true,>> tsconfig.json
echo     "jsx": "preserve",>> tsconfig.json
echo     "incremental": true,>> tsconfig.json
echo     "paths": {>> tsconfig.json
echo       "@/*": ["./src/*"]>> tsconfig.json
echo     }>> tsconfig.json
echo   },>> tsconfig.json
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],>> tsconfig.json
echo   "exclude": ["node_modules"]>> tsconfig.json
echo }>> tsconfig.json

REM Create basic page
echo Creating main page...
echo export default function Home() {> src\app\page.tsx
echo   return (>> src\app\page.tsx
echo     ^<main^>>> src\app\page.tsx
echo       ^<h1^>R3 System^</h1^>>> src\app\page.tsx
echo     ^</main^>>> src\app\page.tsx
echo   );>> src\app\page.tsx
echo }>> src\app\page.tsx

echo Second step complete!
pause

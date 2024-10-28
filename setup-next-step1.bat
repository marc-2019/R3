@echo off
setlocal enabledelayedexpansion

echo Setting up Next.js application - Step 1
echo -------------------------------------

REM Create directories first
echo Creating directories...
mkdir src 2>nul
mkdir src\app 2>nul
mkdir src\components 2>nul
mkdir src\lib 2>nul

REM Create next.config.js with simple content
echo module.exports = { reactStrictMode: true }; > next.config.js

REM Create package.json
echo Creating package.json...
echo {> package.json
echo   "name": "r3-system",>> package.json
echo   "version": "0.1.0",>> package.json
echo   "private": true,>> package.json
echo   "scripts": {>> package.json
echo     "dev": "next dev",>> package.json
echo     "build": "next build",>> package.json
echo     "start": "next start",>> package.json
echo     "lint": "next lint">> package.json
echo   },>> package.json
echo   "dependencies": {>> package.json
echo     "next": "14.1.0",>> package.json
echo     "react": "^18",>> package.json
echo     "react-dom": "^18",>> package.json
echo     "typescript": "^5">> package.json
echo   },>> package.json
echo   "devDependencies": {>> package.json
echo     "@types/node": "^20",>> package.json
echo     "@types/react": "^18",>> package.json
echo     "@types/react-dom": "^18",>> package.json
echo     "eslint": "^8",>> package.json
echo     "eslint-config-next": "14.1.0">> package.json
echo   }>> package.json
echo }>> package.json

echo First step complete. Installing dependencies...
call npm install

echo.
echo Ready for step 2!
pause

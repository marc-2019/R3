@echo off
setlocal enabledelayedexpansion

echo Continuing R3 Installation...
echo ---------------------------

:SETUP_DOCKER
echo Setting up Docker containers...
if not exist "docker" mkdir docker

echo Creating Docker Compose configuration...
(
echo services:
echo   postgres:
echo     container_name: r3-postgres
echo     image: postgres:14-alpine
echo     ports:
echo       - "5432:5432"
echo     environment:
echo       - POSTGRES_USER=postgres
echo       - POSTGRES_PASSWORD=postgres
echo       - POSTGRES_DB=r3_dev
echo     volumes:
echo       - postgres_data:/var/lib/postgresql/data
echo     healthcheck:
echo       test: ["CMD-SHELL", "pg_isready -U postgres"]
echo       interval: 10s
echo       timeout: 5s
echo       retries: 5
echo   redis:
echo     container_name: r3-redis
echo     image: redis:alpine
echo     ports:
echo       - "6379:6379"
echo     volumes:
echo       - redis_data:/data
echo     healthcheck:
echo       test: ["CMD", "redis-cli", "ping"]
echo       interval: 10s
echo       timeout: 5s
echo       retries: 5
echo volumes:
echo   postgres_data:
echo   redis_data:
) > docker/docker-compose.yml

echo Starting Docker containers...
docker compose -f docker/docker-compose.yml up -d

echo Waiting for containers to be healthy...
:WAIT_HEALTH
timeout /t 5 /nobreak >nul
echo Checking container health...
docker ps --format "{{.Names}} - {{.Status}}"

REM Check if both containers are running
docker ps --format "{{.Names}}" | findstr "r3-postgres" >nul
if !ERRORLEVEL! neq 0 (
    echo Waiting for PostgreSQL...
    goto WAIT_HEALTH
)

docker ps --format "{{.Names}}" | findstr "r3-redis" >nul
if !ERRORLEVEL! neq 0 (
    echo Waiting for Redis...
    goto WAIT_HEALTH
)

echo Containers are running. Verifying connections...

echo Testing PostgreSQL connection...
docker exec r3-postgres pg_isready -U postgres
if !ERRORLEVEL! neq 0 (
    echo [X] PostgreSQL is not responding
    exit /b 1
) else (
    echo [✓] PostgreSQL is ready
)

echo Testing Redis connection...
docker exec r3-redis redis-cli ping
if !ERRORLEVEL! neq 0 (
    echo [X] Redis is not responding
    exit /b 1
) else (
    echo [✓] Redis is ready
)

:SETUP_APP
echo Setting up application...

REM Create Next.js structure
mkdir src\app 2>nul
mkdir src\components 2>nul
mkdir src\lib 2>nul

REM Create basic Next.js files
echo Creating Next.js configuration...
(
echo /** @type {import('next').NextConfig} */ > next.config.js
echo const nextConfig = {
echo   reactStrictMode: true,
echo };
echo module.exports = nextConfig;
) > next.config.js

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
) > package.json

echo Installing dependencies...
call npm install

echo.
echo Installation status:
echo ------------------
echo Docker containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Visit http://localhost:3000
echo.
pause

@echo off
setlocal enabledelayedexpansion
echo R3 System Installation Script
echo ----------------------------
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed! Please install Node.js first.
    exit /b 1
)

REM Check for Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Docker is not installed! Please install Docker Desktop first.
    exit /b 1
)

echo [✓] Checking prerequisites...
echo [✓] Node.js found: 
node --version
echo [✓] Docker found: 
docker --version
echo.

REM Create project structure directly
echo Creating project structure...
for %%d in (.github\workflows docs src\app\api\data src\components src\services src\types scripts docker config) do (
    if not exist %%d (
        mkdir %%d 2>nul || (
            echo Failed to create directory: %%d
            exit /b 1
        )
    )
)

REM Create Next.js app structure
mkdir src\app\components 2>nul
mkdir src\app\styles 2>nul

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
echo     "docker:dev": "docker compose -f docker/docker-compose.yml up -d",
echo     "docker:down": "docker compose -f docker/docker-compose.yml down",
echo     "prisma:generate": "prisma generate",
echo     "prisma:push": "prisma db push"
echo   },
echo   "dependencies": {
echo     "next": "14.1.0",
echo     "react": "^18",
echo     "react-dom": "^18",
echo     "typescript": "^5",
echo     "lucide-react": "0.263.1",
echo     "axios": "^1.6.5",
echo     "date-fns": "^3.2.0",
echo     "zod": "^3.22.4",
echo     "@prisma/client": "^5.8.1",
echo     "jsonwebtoken": "^9.0.2"
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
echo     "prisma": "^5.8.1",
echo     "@types/jsonwebtoken": "^9.0.5"
echo   }
echo }
) > package.json

REM Create docker-compose.yml
echo Creating Docker configuration...
(
echo services:
echo   dev-db:
echo     image: postgres:14-alpine
echo     ports:
echo       - "5432:5432"
echo     environment:
echo       POSTGRES_USER: postgres
echo       POSTGRES_PASSWORD: postgres
echo       POSTGRES_DB: r3_dev
echo     volumes:
echo       - postgres_data:/var/lib/postgresql/data
echo   dev-redis:
echo     image: redis:alpine
echo     ports:
echo       - "6379:6379"
echo     volumes:
echo       - redis_data:/data
echo volumes:
echo   postgres_data:
echo   redis_data:
) > docker/docker-compose.yml

REM Install dependencies
echo Installing Node.js dependencies...
call npm install
if !ERRORLEVEL! neq 0 (
    echo Failed to install dependencies
    exit /b 1
)

REM Create Prisma configuration
echo Creating Prisma configuration...
(
echo datasource db {
echo   provider = "postgresql"
echo   url      = env^("DATABASE_URL"^)
echo }
echo.
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo model User {
echo   id        String   @id @default^(uuid^(^)^)
echo   email     String   @unique
echo   name      String?
echo   createdAt DateTime @default^(now^(^)^)
echo   updatedAt DateTime @updatedAt
echo }
) > prisma/schema.prisma

REM Set up environment
echo Setting up environment...
(
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/r3_dev"
echo NEXT_PUBLIC_API_URL="http://localhost:3000"
echo NEXTAUTH_SECRET="your-secret-key"
echo NEXTAUTH_URL="http://localhost:3000"
) > .env
copy .env .env.local

REM Create Next.js configuration
echo Creating Next.js configuration...
(
echo /** @type {import^('next'^).NextConfig} */
echo const nextConfig = {
echo   reactStrictMode: true,
echo }
echo module.exports = nextConfig
) > next.config.js

REM Initialize Docker
echo Setting up Docker containers...
docker compose -f docker/docker-compose.yml up -d
if !ERRORLEVEL! neq 0 (
    echo Failed to start Docker containers
    exit /b 1
)

REM Wait for database to be ready
echo Waiting for database to be ready...
timeout /t 5 /nobreak

REM Initialize database
echo Initializing database...
call npx prisma generate
if !ERRORLEVEL! neq 0 (
    echo Failed to generate Prisma client
    exit /b 1
)

call npx prisma db push
if !ERRORLEVEL! neq 0 (
    echo Failed to push database schema
    exit /b 1
)

echo.
echo R3 System Installation Complete!
echo ------------------------------
echo.
echo Next steps:
echo 1. Start the development server: npm run dev
echo 2. Visit: http://localhost:3000
echo.
echo Available commands:
echo - npm run dev           : Start development server
echo - npm run docker:dev    : Start Docker services
echo - npm run docker:down   : Stop Docker services
echo - npm run prisma:studio : Open Prisma Studio
echo.
pause

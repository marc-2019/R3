@echo off
setlocal enabledelayedexpansion

echo Checking Docker status...
docker info >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Docker is not running! Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Setting up Docker configuration...
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

echo Stopping any existing containers...
docker compose -f docker/docker-compose.yml down

echo Removing existing volumes...
docker volume rm r3_postgres_data r3_redis_data 2>nul

echo Starting Docker containers...
docker compose -f docker/docker-compose.yml up -d

echo Waiting for containers to be healthy...
:CHECK_CONTAINERS
set READY=0
for /f "tokens=*" %%a in ('docker ps --format "{{.Names}} {{.Status}}" ^| findstr "r3-"') do (
    echo Checking %%a
    echo %%a | findstr /i "(healthy)" >nul
    if !ERRORLEVEL! equ 0 (
        set /a READY+=1
    )
)

if !READY! lss 2 (
    echo Waiting for containers to be ready...
    timeout /t 5 /nobreak >nul
    goto CHECK_CONTAINERS
)

echo Docker containers are ready!
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

exit /b 0

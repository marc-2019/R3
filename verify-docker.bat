@echo off
setlocal enabledelayedexpansion

echo Verifying Docker setup...
echo.

echo Checking Docker service...
docker info >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Docker is not running!
    exit /b 1
) else (
    echo [✓] Docker is running
)

echo.
echo Checking containers:
echo ------------------
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo Checking PostgreSQL connection...
docker exec r3-postgres pg_isready -U postgres
if !ERRORLEVEL! neq 0 (
    echo [X] PostgreSQL is not responding
) else (
    echo [✓] PostgreSQL is responding
)

echo.
echo Checking Redis connection...
docker exec r3-redis redis-cli ping
if !ERRORLEVEL! neq 0 (
    echo [X] Redis is not responding
) else (
    echo [✓] Redis is responding
)

echo.
echo Container logs:
echo -------------
echo PostgreSQL logs:
docker logs r3-postgres --tail 5
echo.
echo Redis logs:
docker logs r3-redis --tail 5

pause

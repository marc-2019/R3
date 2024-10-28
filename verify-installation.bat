@echo off
echo Verifying R3 Installation
echo ------------------------
echo.

REM Check Node modules
if exist node_modules (
    echo [✓] Node modules installed
) else (
    echo [X] Node modules missing
)

REM Check Docker containers
echo.
echo Docker containers status:
docker-compose -f docker/docker-compose-persistent.txt ps

REM Check database connection
echo.
echo Database connection:
npx prisma db seed

REM Check Next.js build
echo.
echo Building Next.js application:
npm run build

REM Check available ports
echo.
echo Checking ports:
netstat -an | findstr "3000"
netstat -an | findstr "5432"
netstat -an | findstr "6379"

echo.
echo System Status:
echo -------------
echo [1] Web Server (3000): 
curl -s -o /nul -w "%%{http_code}" http://localhost:3000 || echo "Not running"
echo [2] Database (5432): 
docker-compose -f docker/docker-compose-persistent.txt exec -T db pg_isready || echo "Not running"
echo [3] Redis (6379): 
docker-compose -f docker/docker-compose-persistent.txt exec -T redis redis-cli ping || echo "Not running"

echo.
echo Installation Verification Complete!
echo ---------------------------------
echo.
pause

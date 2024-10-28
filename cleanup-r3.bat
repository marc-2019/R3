@echo off
echo R3 System Cleanup Script
echo ----------------------
echo.

echo Stopping Docker containers...
docker-compose -f docker/docker-compose-persistent.txt down

echo Removing node_modules...
rd /s /q node_modules

echo Removing .next directory...
rd /s /q .next

echo Cleaning Docker volumes...
docker volume prune -f

echo Removing environment files...
del .env.local

echo.
echo Cleanup complete! To reinstall:
echo 1. Run install-r3.bat
echo.
pause

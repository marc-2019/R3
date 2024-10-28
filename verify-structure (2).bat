@echo off
echo Verifying R3 System Structure
echo ---------------------------

echo Checking directories...
dir /b /s

echo.
echo Checking Docker status...
docker compose ps

echo.
echo Would you like to:
echo 1. Integrate the data management components we created earlier
echo 2. Add the user access control system
echo 3. Set up the Docker containers
echo 4. Add the Reality2 integration

pause

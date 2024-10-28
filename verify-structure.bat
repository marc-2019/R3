@echo off
echo Verifying R3 project structure...

echo.
echo Directory Structure:
echo ------------------
dir /s /b /ad

echo.
echo Files in each directory:
echo ----------------------
echo.
echo API files:
dir /b "src\app\api\data"

echo.
echo Component files:
dir /b "src\components"

echo.
echo Service files:
dir /b "src\services"

echo.
echo Scripts:
dir /b "scripts"

echo.
echo Docker files:
dir /b "docker"

echo.
echo Documentation:
dir /b "docs"

echo.
pause
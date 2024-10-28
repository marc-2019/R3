@echo off
echo Creating directory structure...

mkdir .github\workflows 2>nul
mkdir docs 2>nul
mkdir src\app\api\data 2>nul
mkdir src\components 2>nul
mkdir src\services 2>nul
mkdir src\types 2>nul
mkdir scripts 2>nul
mkdir docker 2>nul
mkdir config 2>nul

echo Moving files to correct locations...

:: API files
move /Y *.ts src\app\api\data\ 2>nul
move /Y *-api.* src\app\api\data\ 2>nul

:: Component files
move /Y *dashboard.tsx src\components\ 2>nul
move /Y *navigation.tsx src\components\ 2>nul
move /Y *management*.tsx src\components\ 2>nul

:: Services
move /Y *service*.ts src\services\ 2>nul

:: Scripts
move /Y *.sh scripts\ 2>nul

:: Docker files
move /Y docker-compose*.txt docker\ 2>nul
move /Y Dockerfile* docker\ 2>nul

:: Documentation
move /Y *.md docs\ 2>nul
move /Y *-doc.txt docs\ 2>nul
move /Y *-guide.txt docs\ 2>nul

echo Project structure reorganization complete!
pause
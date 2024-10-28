@echo off
setlocal enabledelayedexpansion

echo R3 Repository Sync Script
echo -----------------------

REM Verify structure
echo Checking project structure...
if not exist "src" (
    echo Creating src directory...
    mkdir src\app\api\data
    mkdir src\components\layout
    mkdir src\components\ui
    mkdir src\services
    mkdir src\types
)

if not exist "docs" (
    echo Creating docs directory...
    mkdir docs
)

if not exist ".github\workflows" (
    echo Creating GitHub workflows directory...
    mkdir .github\workflows
)

REM Move files to correct locations if needed
echo Moving files to correct locations...

REM API files
if exist "access-control-api.ts" move "access-control-api.ts" "src\app\api\data\"
if exist "data-api-routes.ts" move "data-api-routes.ts" "src\app\api\data\"

REM Component files
if exist "*dashboard.tsx" move "*dashboard.tsx" "src\components\"
if exist "*navigation.tsx" move "*navigation.tsx" "src\components\"
if exist "permission-management-extended.tsx" move "permission-management-extended.tsx" "src\components\"

REM Service files
if exist "websocket-service.ts" move "websocket-service.ts" "src\services\"

REM Documentation
if exist "architecture-doc.txt" move "architecture-doc.txt" "docs\architecture.md"
if exist "installation-guide.txt" move "installation-guide.txt" "docs\installation.md"

REM Docker files
if not exist "docker" mkdir docker
move "docker-compose*.txt" "docker\" 2>nul
move "docker-compose.yml" "docker\" 2>nul

REM Scripts
if not exist "scripts" mkdir scripts
move "*.sh" "scripts\" 2>nul

REM Create git files if they don't exist
if not exist ".gitignore" (
    echo Creating .gitignore...
    (
    echo node_modules/
    echo .next/
    echo .env
    echo .env.local
    echo .env.*.local
    echo npm-debug.log*
    echo yarn-debug.log*
    echo yarn-error.log*
    echo .DS_Store
    echo coverage/
    echo dist/
    ) > .gitignore
)

REM Initialize git if needed
if not exist ".git" (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial R3 system setup"
    git branch -M main
    git remote add origin git@github.com:marc-2019/R3.git
)

echo.
echo Repository structure verified and fixed.
echo Ready to push to GitHub:
echo 1. git add .
echo 2. git commit -m "Update repository structure"
echo 3. git push -u origin main
echo.
echo Would you like to push now? (Y/N)
set /p PUSH_NOW=

if /i "%PUSH_NOW%"=="Y" (
    git add .
    git commit -m "Update repository structure"
    git push -u origin main
    echo Push complete!
) else (
    echo You can push manually when ready.
)

pause

@echo off
echo Verifying final setup...

echo.
echo Checking configuration files:
echo --------------------------
if exist next.config.js (echo [✓] next.config.js exists) else (echo [X] next.config.js missing)
if exist tsconfig.json (echo [✓] tsconfig.json exists) else (echo [X] tsconfig.json missing)
if exist tailwind.config.js (echo [✓] tailwind.config.js exists) else (echo [X] tailwind.config.js missing)
if exist package.json (echo [✓] package.json exists) else (echo [X] package.json missing)
if exist .env.example (echo [✓] .env.example exists) else (echo [X] .env.example missing)

echo.
echo Checking project structure:
echo ------------------------
if exist src\app (echo [✓] src/app directory exists) else (echo [X] src/app directory missing)
if exist src\components (echo [✓] src/components directory exists) else (echo [X] src/components directory missing)
if exist src\services (echo [✓] src/services directory exists) else (echo [X] src/services directory missing)

echo.
echo Current package.json content:
echo --------------------------
type package.json

echo.
echo Ready to proceed with npm install? (Y/N)
pause
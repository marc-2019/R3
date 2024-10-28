@echo off
setlocal enabledelayedexpansion

echo R3 System Installation Script
echo ----------------------------
echo.

:CHECK_DOCKER_DETAILED
echo Performing detailed Docker check...

echo Step 1: Checking Docker PATH...
where docker >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Docker CLI not found in PATH
    echo Adding Docker to PATH...
    set "PATH=%PATH%;C:\Program Files\Docker\Docker\resources\bin"
    set "PATH=%PATH%;%ProgramFiles%\Docker\Docker\resources\bin"
    set "PATH=%PATH%;%LOCALAPPDATA%\Docker\wsl"
)

echo Step 2: Checking Docker service...
sc query docker >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Docker service not found
) else (
    echo [✓] Docker service exists
)

echo Step 3: Testing Docker command...
docker version >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Docker command failed
    echo Attempting to run with elevated privileges...
    
    REM Check if running as administrator
    net session >nul 2>&1
    if !ERRORLEVEL! neq 0 (
        echo [!] Please run this script as Administrator
        echo Right-click the script and select "Run as administrator"
        pause
        exit /b 1
    )
)

echo Step 4: Testing Docker daemon connection...
docker info >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo [X] Cannot connect to Docker daemon
    echo Please ensure Docker Desktop is running and try these steps:
    echo 1. Open Docker Desktop
    echo 2. Wait for the engine to fully start
    echo 3. Check the whale icon in the system tray is solid ^(not animated^)
    echo.
    echo Press any key when Docker Desktop is running...
    pause >nul
    goto CHECK_DOCKER_DETAILED
) else (
    echo [✓] Successfully connected to Docker daemon
)

echo.
echo Docker Status:
docker version
echo.
docker info | findstr "Server"
echo.

REM Continue with rest of installation...
echo Proceeding with installation...
pause

REM Rest of your installation script goes here...

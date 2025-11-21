@echo off
REM DMT Education System - Stop Development Servers for Windows

echo ============================================================
echo DMT Education System - Stopping Development Environment
echo ============================================================
echo.

echo [1/2] Stopping Backend Server...
taskkill /F /FI "WINDOWTITLE eq DMT Backend*" >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend window not found
)
echo.

echo [2/2] Stopping Frontend Server...
taskkill /F /FI "WINDOWTITLE eq DMT Frontend*" >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] Frontend window not found
)
echo.

REM Kill any remaining Node processes
echo Cleaning up Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] All Node processes stopped
) else (
    echo [INFO] No Node processes found
)
echo.

echo ============================================================
echo All development servers stopped
echo ============================================================
echo.
echo Note: SQL Server is still running
echo To stop SQL Server: Open Services and stop MSSQLSERVER or SQLEXPRESS
echo.
pause

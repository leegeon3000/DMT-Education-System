@echo off
REM DMT Education System - Development Startup Script for Windows
REM This script starts both Backend and Frontend servers

echo ============================================================
echo DMT Education System - Starting Development Environment
echo ============================================================
echo.

REM Check if SQL Server is running
echo [1/4] Checking SQL Server...
sc query MSSQLSERVER | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo [OK] SQL Server is running
) else (
    sc query "MSSQL$SQLEXPRESS" | find "RUNNING" >nul
    if %errorlevel% == 0 (
        echo [OK] SQL Server Express is running
    ) else (
        echo [WARNING] SQL Server not detected. Please ensure SQL Server is running.
        echo You can start it from Services (services.msc)
        pause
    )
)
echo.

REM Kill existing Node processes
echo [2/4] Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Stopped old processes
) else (
    echo [INFO] No existing processes found
)
timeout /t 2 >nul
echo.

REM Start Backend
echo [3/4] Starting Backend Server...
cd Backend
start "DMT Backend" cmd /k "npm run dev"
cd ..
echo [OK] Backend starting in new window
echo      Check "DMT Backend" window for logs
timeout /t 5 >nul
echo.

REM Start Frontend
echo [4/4] Starting Frontend Server...
start "DMT Frontend" cmd /k "npm run dev"
echo [OK] Frontend starting in new window
echo      Check "DMT Frontend" window for logs
timeout /t 3 >nul
echo.

REM Display status
echo ============================================================
echo Development environment started successfully!
echo ============================================================
echo.
echo Services:
echo   SQL Server:  Check Services panel
echo   Backend:     http://localhost:3001
echo   Frontend:    http://localhost:5173
echo.
echo Demo Accounts:
echo   Admin:       admin@dmt.edu.vn / Admin@123
echo   Staff:       staff1@dmt.edu.vn / Staff@123
echo   Teacher:     teacher.math@dmt.edu.vn / Teacher@123
echo   Student:     student001@gmail.com / Student@123
echo.
echo To stop servers:
echo   - Close the "DMT Backend" and "DMT Frontend" windows
echo   - Or run: stop-dev.bat
echo.
echo Open your browser at: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul

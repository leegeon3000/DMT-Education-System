# DMT Education System - Development Startup Script for Windows PowerShell
# This script starts both Backend and Frontend servers

Write-Host "============================================================" -ForegroundColor Green
Write-Host "DMT Education System - Starting Development Environment" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# Check if SQL Server is running
Write-Host "[1/4] Checking SQL Server..." -ForegroundColor Blue
$sqlService = Get-Service -Name "MSSQLSERVER","MSSQL`$SQLEXPRESS" -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq "Running"}
if ($sqlService) {
    Write-Host "[OK] SQL Server is running" -ForegroundColor Green
} else {
    Write-Host "[WARNING] SQL Server not detected. Please ensure SQL Server is running." -ForegroundColor Yellow
    Write-Host "You can start it from Services (services.msc)" -ForegroundColor Yellow
}
Write-Host ""

# Kill existing Node processes
Write-Host "[2/4] Cleaning up existing processes..." -ForegroundColor Blue
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "[OK] Cleanup complete" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Blue
Set-Location Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev; Write-Host 'Backend stopped' -ForegroundColor Red" -WindowStyle Normal
Set-Location ..
Write-Host "[OK] Backend starting in new window" -ForegroundColor Green
Write-Host "     Log: Check Backend PowerShell window" -ForegroundColor Cyan
Start-Sleep -Seconds 5
Write-Host ""

# Start Frontend
Write-Host "[4/4] Starting Frontend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev; Write-Host 'Frontend stopped' -ForegroundColor Red" -WindowStyle Normal
Write-Host "[OK] Frontend starting in new window" -ForegroundColor Green
Write-Host "     Log: Check Frontend PowerShell window" -ForegroundColor Cyan
Start-Sleep -Seconds 3
Write-Host ""

# Display status
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Development environment started successfully!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "   SQL Server:  " -NoNewline -ForegroundColor White
Write-Host "Check Services panel" -ForegroundColor Yellow
Write-Host "   Backend:     " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3001" -ForegroundColor Green
Write-Host "   Frontend:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Demo Accounts:" -ForegroundColor Cyan
Write-Host "   Admin:       " -NoNewline -ForegroundColor White
Write-Host "admin@dmt.edu.vn / Admin@123" -ForegroundColor Green
Write-Host "   Staff:       " -NoNewline -ForegroundColor White
Write-Host "staff1@dmt.edu.vn / Staff@123" -ForegroundColor Green
Write-Host "   Teacher:     " -NoNewline -ForegroundColor White
Write-Host "teacher.math@dmt.edu.vn / Teacher@123" -ForegroundColor Green
Write-Host "   Student:     " -NoNewline -ForegroundColor White
Write-Host "student001@gmail.com / Student@123" -ForegroundColor Green
Write-Host ""
Write-Host "To stop servers:" -ForegroundColor Cyan
Write-Host "   - Close the Backend and Frontend PowerShell windows" -ForegroundColor Yellow
Write-Host "   - Or run: .\stop-dev.ps1" -ForegroundColor Yellow
Write-Host "   - Or run: Get-Process node | Stop-Process -Force" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open your browser at: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

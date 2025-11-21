# DMT Education System - Stop Development Servers for Windows PowerShell

Write-Host "============================================================" -ForegroundColor Red
Write-Host "DMT Education System - Stopping Development Environment" -ForegroundColor Red
Write-Host "============================================================" -ForegroundColor Red
Write-Host ""

Write-Host "[1/1] Stopping all Node.js processes..." -ForegroundColor Blue
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "[OK] Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "[INFO] No Node.js processes found" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "============================================================" -ForegroundColor Green
Write-Host "All development servers stopped" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Note: SQL Server is still running" -ForegroundColor Cyan
Write-Host "To stop SQL Server:" -ForegroundColor Cyan
Write-Host "   Stop-Service -Name 'MSSQLSERVER'" -ForegroundColor Yellow
Write-Host "   Or: Stop-Service -Name 'MSSQL`$SQLEXPRESS'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

@echo off
setlocal
echo =======================================================
echo  Uninstalling Terrific Travel Security Bridge
echo =======================================================
echo.

echo [1/2] Stopping background process...
taskkill /F /IM TerrificTravelBridge.exe >nul 2>&1

echo [2/2] Removing Windows Startup entry...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TerrificTravelBridge" /f >nul 2>&1

echo.
echo Bridge service removed.
echo.
pause

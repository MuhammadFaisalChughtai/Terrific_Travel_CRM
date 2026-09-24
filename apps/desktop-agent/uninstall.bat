@echo off
setlocal
echo =======================================================
echo  Uninstalling Terrific Travel CRM Connector
echo =======================================================
echo.

echo [1/2] Stopping background process...
taskkill /F /IM TerrificTravelBridge.exe >nul 2>&1

echo [2/2] Removing Windows Startup entry...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TerrificTravelBridge" /f >nul 2>&1

echo.
echo Terrific Travel CRM Connector removed.
echo.
pause

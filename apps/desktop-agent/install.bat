@echo off
setlocal
echo =======================================================
echo  Terrific Travel CRM Workstation Connector Setup
echo =======================================================
echo.

set TARGET_DIR=%APPDATA%\TerrificTravel
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

echo [1/3] Copying executable to user profile...
copy /Y "%~dp0TerrificTravelBridge.exe" "%TARGET_DIR%\TerrificTravelBridge.exe" >nul

echo [2/3] Configuring Windows Startup (Current User)...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "TerrificTravelBridge" /t REG_SZ /d "\"%TARGET_DIR%\TerrificTravelBridge.exe\"" /f >nul

echo [3/3] Starting background service...
taskkill /F /IM TerrificTravelBridge.exe >nul 2>&1
start "" "%TARGET_DIR%\TerrificTravelBridge.exe"

echo.
echo Setup completed successfully.
echo The Terrific Travel CRM Connector is now running in the background.
echo.
pause

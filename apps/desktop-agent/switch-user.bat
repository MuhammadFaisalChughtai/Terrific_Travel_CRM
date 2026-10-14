@echo off
setlocal
echo =======================================================
echo  Terrific Travel CRM - Switch Agent / Sign In Again
echo =======================================================
echo.

set TARGET_DIR=%APPDATA%\TerrificTravel

echo [1/3] Stopping running desktop connector...
taskkill /F /IM TerrificTravelBridge.exe >nul 2>&1

echo [2/3] Updating binary in user profile...
if not exist %TARGET_DIR% mkdir %TARGET_DIR%
copy /Y %~dp0TerrificTravelBridge.exe %TARGET_DIR%\TerrificTravelBridge.exe >nul

echo [3/3] Launching Sign-In modal for new agent...
start "" "%TARGET_DIR%\TerrificTravelBridge.exe" --switch-user

echo.
echo Sign-In dialog launched. Please enter the new agent's CRM credentials.
echo.

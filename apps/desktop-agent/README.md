# Terrific Travel GDS & Security Bridge (Desktop Agent)

A silent, lightweight background service for Windows 10 & 11 workstations that integrates with the Terrific Travel Management System (TMS) CRM.

---

## 1. Capabilities
- **Silent Background Execution**: Runs as a Windows GUI-less background process (`/target:winexe`). No taskbar icon, no system tray icon, and no popups to disrupt employee workflows.
- **Native Clipboard Listener**: Registers the Windows `AddClipboardFormatListener` API to catch all copy/paste events triggered by either **keyboard shortcuts (`Ctrl+C`, `Ctrl+X`)** or **mouse right-click copy actions**.
- **Event-Driven Screen Capture**: Instantly captures the primary screen at the exact second a copy/paste occurs, downscales to 1280x720, compresses as standard JPEG (65% quality, ~50 KB), and dispatches it with the copied text and active window title directly to `/api/agent-monitor/clipboard-event`.
- **Heartbeat Loop**: Pings the CRM backend every 15 seconds with the workstation hostname, active foreground window title (e.g. `Amadeus GDS`, `Chrome - CRM`), and machine identifier.
- **Auto-Startup**: Runs automatically when Windows boots.

---

## 2. Configuration (`config.ini`)
The configuration is stored at:
```
%APPDATA%\TerrificTravel\config.ini
```

Example content:
```ini
server_url=https://crm.terrifictravel.co.uk/api
email=agent.name@terrifictravel.co.uk
password=AgentPassword123
token=
```
- If `token` is blank, the application automatically logs in using the provided `email` and `password` on startup, acquires a secure JWT access token, and caches it locally.

---

## 3. Installation on Employee Workstations

### Quick 1-Click Install:
1. Copy the `desktop-agent` folder to the target computer (or download the zip).
2. Right-click `install.bat` and run it.
   - It places `TerrificTravelBridge.exe` into `%APPDATA%\TerrificTravel\`.
   - It registers the application to auto-start with Windows under `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`.
   - It launches the process silently in the background.

---

## 4. Recompiling the Binary
To recompile from source on any Windows machine (no Visual Studio or .NET SDK installation required; uses the built-in Windows .NET Framework compiler):
```cmd
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe /target:winexe /out:TerrificTravelBridge.exe /reference:System.dll /reference:System.Drawing.dll /reference:System.Windows.Forms.dll /reference:System.Net.Http.dll Program.cs
```

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

## 2. Authentication & CRM Database Credentials
The desktop app directly connects to the **same CRM database accounts** already used by Agents and Managers:
1. **Interactive First-Time Sign-In**:
   - If not yet configured, the app presents a clean, branded dialog: *"Terrific Travel Workstation Security & GDS Connector"*.
   - The agent/manager simply inputs their standard **CRM Email Address** and **CRM Password** (the exact same credentials used for browser login).
   - The application calls `POST /api/auth/login`, validates against the database (`User` table with bcrypt hash), caches the authorized token in `%APPDATA%\TerrificTravel\config.ini`, closes the window, and continues running in the background.
2. **Silent Startup on Subsequent Boots**:
   - On Windows boot, the service automatically signs in silently using the saved credentials or token without showing any dialogs.
3. **Password Changes**:
   - If an agent's password is changed in the CRM database, the app seamlessly catches the `401 Unauthorized` response on heartbeat and prompts for their updated CRM password.

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

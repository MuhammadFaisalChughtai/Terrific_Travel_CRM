using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Drawing;
using System.Drawing.Imaging;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using System.Security.Cryptography;

namespace TerrificTravelBridge
{
    static class Program
    {
        private static Mutex _mutex;

        [STAThread]
        static void Main(string[] args)
        {
            const string appGuid = "TerrificTravelBridge_SingleInstance_Mutex_2026";
            bool isNewInstance;
            _mutex = new Mutex(true, appGuid, out isNewInstance);
            if (!isNewInstance)
            {
                return;
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MonitorApplicationContext());
        }
    }

    public class MonitorApplicationContext : ApplicationContext
    {
        private readonly ClipboardNotificationForm _clipboardForm;
        private readonly System.Threading.Timer _heartbeatTimer;
        private readonly HttpClient _httpClient;

        private string _serverUrl = "http://localhost:5000/api";
        private string _agentEmail = "";
        private string _agentPassword = "";
        private string _jwtToken = "";
        private readonly string _machineId;
        private readonly string _configPath;

        public MonitorApplicationContext()
        {
            _machineId = GetPersistentMachineId();
            _configPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "TerrificTravel", "config.ini");

            LoadConfiguration();

            var handler = new HttpClientHandler
            {
                AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
            };
            _httpClient = new HttpClient(handler)
            {
                Timeout = TimeSpan.FromSeconds(15)
            };

            _clipboardForm = new ClipboardNotificationForm(this);

            PerformLogin();

            _heartbeatTimer = new System.Threading.Timer(HeartbeatCallback, null, TimeSpan.FromSeconds(3), TimeSpan.FromSeconds(15));
        }

        private void LoadConfiguration()
        {
            try
            {
                string dir = Path.GetDirectoryName(_configPath);
                if (!Directory.Exists(dir))
                {
                    Directory.CreateDirectory(dir);
                }

                if (File.Exists(_configPath))
                {
                    string[] lines = File.ReadAllLines(_configPath);
                    for (int i = 0; i < lines.Length; i++)
                    {
                        string line = lines[i];
                        string[] parts = line.Split(new char[] { '=' }, 2);
                        if (parts.Length == 2)
                        {
                            string key = parts[0].Trim().ToLowerInvariant();
                            string val = parts[1].Trim();
                            if (key == "server_url") _serverUrl = val;
                            else if (key == "email") _agentEmail = val;
                            else if (key == "password") _agentPassword = val;
                            else if (key == "token") _jwtToken = val;
                        }
                    }
                }
                else
                {
                    StringBuilder defaultConf = new StringBuilder();
                    defaultConf.AppendLine("# Terrific Travel GDS & Security Bridge Configuration");
                    defaultConf.AppendLine("server_url=http://localhost:5000/api");
                    defaultConf.AppendLine("email=");
                    defaultConf.AppendLine("password=");
                    defaultConf.AppendLine("token=");
                    File.WriteAllText(_configPath, defaultConf.ToString());
                }
            }
            catch (Exception ex)
            {
                Log("Config error: " + ex.Message);
            }
        }

        public void SaveToken(string token)
        {
            _jwtToken = token;
            try
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendLine("server_url=" + _serverUrl);
                sb.AppendLine("email=" + _agentEmail);
                sb.AppendLine("password=" + _agentPassword);
                sb.AppendLine("token=" + _jwtToken);
                File.WriteAllText(_configPath, sb.ToString());
            }
            catch { }
        }

        private void PerformLogin()
        {
            if (!string.IsNullOrEmpty(_jwtToken)) return;
            if (string.IsNullOrEmpty(_agentEmail) || string.IsNullOrEmpty(_agentPassword)) return;

            ThreadPool.QueueUserWorkItem(delegate(object state)
            {
                try
                {
                    string json = string.Format("{{\"email\":\"{0}\",\"password\":\"{1}\"}}", EscapeJson(_agentEmail), EscapeJson(_agentPassword));
                    StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
                    HttpResponseMessage res = _httpClient.PostAsync(_serverUrl + "/auth/login", content).Result;
                    if (res.IsSuccessStatusCode)
                    {
                        string body = res.Content.ReadAsStringAsync().Result;
                        string token = ExtractJsonValue(body, "accessToken");
                        if (!string.IsNullOrEmpty(token))
                        {
                            SaveToken(token);
                            Log("Login successful.");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Log("Login attempt failed: " + ex.Message);
                }
            });
        }

        private void HeartbeatCallback(object state)
        {
            if (string.IsNullOrEmpty(_jwtToken))
            {
                PerformLogin();
                return;
            }

            try
            {
                string activeWindow = GetActiveWindowTitle();
                string hostname = Environment.MachineName;

                string json = string.Format(
                    "{{\"machineId\":\"{0}\",\"hostname\":\"{1}\",\"activeWindow\":\"{2}\",\"appVersion\":\"1.2.0\"}}",
                    EscapeJson(_machineId),
                    EscapeJson(hostname),
                    EscapeJson(activeWindow)
                );

                HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, _serverUrl + "/agent-monitor/heartbeat");
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
                req.Content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage res = _httpClient.SendAsync(req).Result;
                if (res.StatusCode == HttpStatusCode.Unauthorized)
                {
                    _jwtToken = "";
                    PerformLogin();
                }
            }
            catch (Exception ex)
            {
                Log("Heartbeat error: " + ex.Message);
            }
        }

        public void HandleClipboardChange()
        {
            ThreadPool.QueueUserWorkItem(delegate(object state)
            {
                try
                {
                    Thread.Sleep(150);

                    string text = "";
                    if (Application.OpenForms.Count > 0 && Application.OpenForms[0] != null)
                    {
                        Application.OpenForms[0].Invoke(new Action(delegate()
                        {
                            if (Clipboard.ContainsText())
                            {
                                text = Clipboard.GetText();
                            }
                        }));
                    }

                    if (string.IsNullOrEmpty(text) || text.Trim().Length == 0)
                    {
                        return;
                    }

                    string activeWindow = GetActiveWindowTitle();
                    string screenshotBase64 = CaptureScreenBase64();

                    SendClipboardEvent("COPY", text, activeWindow, screenshotBase64);
                }
                catch (Exception ex)
                {
                    Log("Clipboard capture error: " + ex.Message);
                }
            });
        }

        private void SendClipboardEvent(string action, string text, string windowTitle, string screenshotBase64)
        {
            if (string.IsNullOrEmpty(_jwtToken)) return;

            try
            {
                if (text.Length > 5000) text = text.Substring(0, 5000);

                string json = string.Format(
                    "{{\"action\":\"{0}\",\"textSnippet\":\"{1}\",\"charCount\":{2},\"sourceWindow\":\"{3}\",\"screenshotBase64\":\"{4}\"}}",
                    action,
                    EscapeJson(text),
                    text.Length,
                    EscapeJson(windowTitle),
                    screenshotBase64
                );

                HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, _serverUrl + "/agent-monitor/clipboard-event");
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
                req.Content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage res = _httpClient.SendAsync(req).Result;
                if (res.StatusCode == HttpStatusCode.Unauthorized)
                {
                    _jwtToken = "";
                    PerformLogin();
                }
            }
            catch (Exception ex)
            {
                Log("SendClipboardEvent error: " + ex.Message);
            }
        }

        private string CaptureScreenBase64()
        {
            try
            {
                Rectangle bounds = Screen.PrimaryScreen.Bounds;
                using (Bitmap bitmap = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format24bppRgb))
                {
                    using (Graphics g = Graphics.FromImage(bitmap))
                    {
                        g.CopyFromScreen(Point.Empty, Point.Empty, bounds.Size);
                    }

                    int targetWidth = 1280;
                    int targetHeight = 720;
                    if (bounds.Width < targetWidth)
                    {
                        targetWidth = bounds.Width;
                        targetHeight = bounds.Height;
                    }

                    using (Bitmap resized = new Bitmap(bitmap, new Size(targetWidth, targetHeight)))
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            ImageCodecInfo encoder = GetEncoder(ImageFormat.Jpeg);
                            EncoderParameters encoderParams = new EncoderParameters(1);
                            encoderParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 65L);
                            resized.Save(ms, encoder, encoderParams);
                            return "data:image/jpeg;base64," + Convert.ToBase64String(ms.ToArray());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log("Screenshot error: " + ex.Message);
                return "";
            }
        }

        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            for (int i = 0; i < codecs.Length; i++)
            {
                if (codecs[i].FormatID == format.Guid) return codecs[i];
            }
            return null;
        }

        private string GetActiveWindowTitle()
        {
            const int nChars = 256;
            StringBuilder buff = new StringBuilder(nChars);
            IntPtr handle = GetForegroundWindow();
            if (GetWindowText(handle, buff, nChars) > 0)
            {
                return buff.ToString();
            }
            return "Desktop";
        }

        private string GetPersistentMachineId()
        {
            try
            {
                string raw = Environment.MachineName + "_" + Environment.UserName + "_" + Environment.OSVersion;
                using (SHA256 sha = SHA256.Create())
                {
                    byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(raw));
                    return BitConverter.ToString(bytes).Replace("-", "").Substring(0, 16).ToLowerInvariant();
                }
            }
            catch
            {
                return Guid.NewGuid().ToString("N").Substring(0, 16);
            }
        }

        private static string EscapeJson(string s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            return s.Replace("\\", "\\\\")
                    .Replace("\"", "\\\"")
                    .Replace("\r", "\\r")
                    .Replace("\n", "\\n")
                    .Replace("\t", "\\t");
        }

        private static string ExtractJsonValue(string json, string key)
        {
            try
            {
                string search = "\"" + key + "\":\"";
                int idx = json.IndexOf(search);
                if (idx != -1)
                {
                    int start = idx + search.Length;
                    int end = json.IndexOf("\"", start);
                    if (end != -1)
                    {
                        return json.Substring(start, end - start);
                    }
                }
            }
            catch { }
            return "";
        }

        private void Log(string msg)
        {
            // Optional local diagnostic log
        }

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    }

    internal class ClipboardNotificationForm : Form
    {
        private readonly MonitorApplicationContext _context;

        [DllImport("user32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool AddClipboardFormatListener(IntPtr hwnd);

        [DllImport("user32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool RemoveClipboardFormatListener(IntPtr hwnd);

        private const int WM_CLIPBOARDUPDATE = 0x031D;

        public ClipboardNotificationForm(MonitorApplicationContext context)
        {
            _context = context;

            FormBorderStyle = FormBorderStyle.None;
            ShowInTaskbar = false;
            Width = 0;
            Height = 0;
            Opacity = 0;

            IntPtr handle = Handle;
            AddClipboardFormatListener(handle);
        }

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == WM_CLIPBOARDUPDATE)
            {
                _context.HandleClipboardChange();
            }
            base.WndProc(ref m);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                RemoveClipboardFormatListener(Handle);
            }
            base.Dispose(disposing);
        }
    }
}

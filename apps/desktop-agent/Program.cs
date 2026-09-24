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
        private bool _isLoggingIn = false;

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

            // Attempt login or prompt for credentials
            PerformLoginOrPrompt();

            // Heartbeat every 15 seconds
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
                    defaultConf.AppendLine("# Terrific Travel Workstation CRM Connector Configuration");
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

        public void SaveCredentials(string serverUrl, string email, string password, string token)
        {
            _serverUrl = serverUrl;
            _agentEmail = email;
            _agentPassword = password;
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

        public bool TryAuthenticate(string serverUrl, string email, string password, out string errorMessage)
        {
            errorMessage = "";
            try
            {
                string json = string.Format("{{\"email\":\"{0}\",\"password\":\"{1}\"}}", EscapeJson(email), EscapeJson(password));
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");

                string targetEndpoint = serverUrl.TrimEnd('/') + "/auth/login";
                HttpResponseMessage res = _httpClient.PostAsync(targetEndpoint, content).Result;

                if (res.IsSuccessStatusCode)
                {
                    string body = res.Content.ReadAsStringAsync().Result;
                    string token = ExtractJsonValue(body, "accessToken");
                    if (!string.IsNullOrEmpty(token))
                    {
                        SaveCredentials(serverUrl, email, password, token);
                        SendInitialHeartbeat();
                        return true;
                    }
                    else
                    {
                        errorMessage = "Login succeeded but no access token returned.";
                        return false;
                    }
                }
                else
                {
                    errorMessage = "Invalid email or password. Please use your CRM credentials.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                errorMessage = "Connection error: Unable to reach CRM server. " + ex.Message;
                return false;
            }
        }

        public void PerformLoginOrPrompt()
        {
            if (!string.IsNullOrEmpty(_jwtToken)) return;

            // If we have saved credentials in config, try authenticating silently first
            if (!string.IsNullOrEmpty(_agentEmail) && !string.IsNullOrEmpty(_agentPassword))
            {
                string err;
                if (TryAuthenticate(_serverUrl, _agentEmail, _agentPassword, out err))
                {
                    return;
                }
            }

            // Otherwise, show the native login prompt
            ShowLoginPrompt();
        }

        public void ShowLoginPrompt()
        {
            if (_isLoggingIn) return;
            _isLoggingIn = true;

            ThreadPool.QueueUserWorkItem(delegate(object state)
            {
                try
                {
                    LoginForm form = new LoginForm(this, _serverUrl, _agentEmail);
                    Application.Run(form);
                }
                catch { }
                finally
                {
                    _isLoggingIn = false;
                }
            });
        }

        private void SendInitialHeartbeat()
        {
            ThreadPool.QueueUserWorkItem(delegate(object state)
            {
                HeartbeatCallback(null);
            });
        }

        private void HeartbeatCallback(object state)
        {
            if (string.IsNullOrEmpty(_jwtToken))
            {
                if (!string.IsNullOrEmpty(_agentEmail) && !string.IsNullOrEmpty(_agentPassword))
                {
                    string err;
                    TryAuthenticate(_serverUrl, _agentEmail, _agentPassword, out err);
                }
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

                string targetEndpoint = _serverUrl.TrimEnd('/') + "/agent-monitor/heartbeat";
                HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, targetEndpoint);
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
                req.Content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage res = _httpClient.SendAsync(req).Result;
                if (res.StatusCode == HttpStatusCode.Unauthorized)
                {
                    _jwtToken = "";
                    PerformLoginOrPrompt();
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

                string targetEndpoint = _serverUrl.TrimEnd('/') + "/agent-monitor/clipboard-event";
                HttpRequestMessage req = new HttpRequestMessage(HttpMethod.Post, targetEndpoint);
                req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _jwtToken);
                req.Content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage res = _httpClient.SendAsync(req).Result;
                if (res.StatusCode == HttpStatusCode.Unauthorized)
                {
                    _jwtToken = "";
                    PerformLoginOrPrompt();
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

    internal class LoginForm : Form
    {
        private readonly MonitorApplicationContext _context;
        private readonly string _serverUrl;
        private TextBox _txtEmail;
        private TextBox _txtPassword;
        private Label _lblStatus;
        private Button _btnConnect;

        public LoginForm(MonitorApplicationContext context, string initialServer, string initialEmail)
        {
            _context = context;
            _serverUrl = initialServer;

            Text = "Terrific Travel — CRM Connector";
            StartPosition = FormStartPosition.CenterScreen;
            Width = 430;
            Height = 370;
            FormBorderStyle = FormBorderStyle.FixedDialog;
            MaximizeBox = false;
            MinimizeBox = false;
            BackColor = Color.FromArgb(248, 250, 252);
            Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            // Title Banner
            Label lblBrand = new Label
            {
                Text = "TERRIFIC TRAVEL",
                Font = new Font("Segoe UI", 13F, FontStyle.Bold),
                ForeColor = Color.FromArgb(234, 88, 12), // Orange 600
                Location = new Point(28, 20),
                AutoSize = true
            };
            Controls.Add(lblBrand);

            Label lblTitle = new Label
            {
                Text = "Workstation CRM Connector",
                Font = new Font("Segoe UI", 10F, FontStyle.Bold),
                ForeColor = Color.FromArgb(15, 23, 42),
                Location = new Point(28, 48),
                AutoSize = true
            };
            Controls.Add(lblTitle);

            Label lblDesc = new Label
            {
                Text = "Sign in using your standard CRM agent or manager credentials to connect this workstation.",
                Font = new Font("Segoe UI", 8.5F),
                ForeColor = Color.FromArgb(100, 116, 139),
                Location = new Point(28, 72),
                Size = new Size(365, 36)
            };
            Controls.Add(lblDesc);

            // Email Field
            Label lblEmail = new Label
            {
                Text = "CRM EMAIL ADDRESS",
                Font = new Font("Segoe UI", 8F, FontStyle.Bold),
                ForeColor = Color.FromArgb(71, 85, 105),
                Location = new Point(28, 118),
                AutoSize = true
            };
            Controls.Add(lblEmail);

            _txtEmail = new TextBox
            {
                Text = initialEmail,
                Font = new Font("Segoe UI", 10F),
                Location = new Point(28, 138),
                Width = 365
            };
            Controls.Add(_txtEmail);

            // Password Field
            Label lblPass = new Label
            {
                Text = "CRM PASSWORD",
                Font = new Font("Segoe UI", 8F, FontStyle.Bold),
                ForeColor = Color.FromArgb(71, 85, 105),
                Location = new Point(28, 178),
                AutoSize = true
            };
            Controls.Add(lblPass);

            _txtPassword = new TextBox
            {
                Font = new Font("Segoe UI", 10F),
                Location = new Point(28, 198),
                Width = 365,
                UseSystemPasswordChar = true
            };
            Controls.Add(_txtPassword);

            // Status message
            _lblStatus = new Label
            {
                Text = "",
                Font = new Font("Segoe UI", 8.5F),
                ForeColor = Color.FromArgb(220, 38, 38), // Red
                Location = new Point(28, 234),
                Size = new Size(365, 28)
            };
            Controls.Add(_lblStatus);

            // Connect Button
            _btnConnect = new Button
            {
                Text = "Connect Workstation",
                Font = new Font("Segoe UI", 10F, FontStyle.Bold),
                ForeColor = Color.White,
                BackColor = Color.FromArgb(234, 88, 12),
                FlatStyle = FlatStyle.Flat,
                Location = new Point(28, 268),
                Width = 365,
                Height = 38,
                Cursor = Cursors.Hand
            };
            _btnConnect.FlatAppearance.BorderSize = 0;
            _btnConnect.Click += BtnConnect_Click;
            Controls.Add(_btnConnect);

            AcceptButton = _btnConnect;
        }

        private void BtnConnect_Click(object sender, EventArgs e)
        {
            string email = _txtEmail.Text.Trim();
            string password = _txtPassword.Text;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                _lblStatus.Text = "Please enter both your CRM email and password.";
                return;
            }

            _btnConnect.Enabled = false;
            _btnConnect.Text = "Connecting...";
            _lblStatus.ForeColor = Color.FromArgb(71, 85, 105);
            _lblStatus.Text = "Authenticating with CRM database...";

            ThreadPool.QueueUserWorkItem(delegate(object state)
            {
                string err;
                bool success = _context.TryAuthenticate(_serverUrl, email, password, out err);

                Invoke(new Action(delegate()
                {
                    if (success)
                    {
                        _lblStatus.ForeColor = Color.FromArgb(22, 163, 74);
                        _lblStatus.Text = "Connected successfully. Running in background...";
                        ThreadPool.QueueUserWorkItem(delegate(object s)
                        {
                            Thread.Sleep(700);
                            Invoke(new Action(delegate()
                            {
                                Close();
                            }));
                        });
                    }
                    else
                    {
                        _btnConnect.Enabled = true;
                        _btnConnect.Text = "Connect Workstation";
                        _lblStatus.ForeColor = Color.FromArgb(220, 38, 38);
                        _lblStatus.Text = err;
                    }
                }));
            });
        }
    }
}

import { useAuthStore } from '../store/auth.store';
import { useThemeStore } from '../store/theme.store';
import { Settings, Shield, Moon, Sun, User, Laptop } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleSaveSettings = () => {
    toast.success('System preferences saved successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Details Card */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <User size={20} className="text-primary" />
            Operator Profile
          </h3>

          <div className="flex flex-col items-center gap-4 text-center pb-4 border-b border-border/60">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary border border-primary/20 text-3xl font-bold">
              {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h4>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20 mt-1">
                {user?.roles?.[0]}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Email Address</span>
              <span className="font-semibold">{user?.email}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Account Created</span>
              <span className="font-semibold text-muted-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & RBAC */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            System Preferences
          </h3>

          <div className="space-y-6">
            {/* Theme selector */}
            <div className="flex items-center justify-between border-b border-border/60 pb-6">
              <div>
                <h4 className="font-bold text-sm">Theme Appearance</h4>
                <p className="text-xs text-muted-foreground">Select light or dark mode styling rules.</p>
              </div>

              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-secondary transition-all"
              >
                {theme === 'dark' ? <Moon size={14} className="text-primary" /> : <Sun size={14} className="text-amber-500" />}
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            {/* RBAC permissions summary */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-muted-foreground">
                <Shield size={16} />
                RBAC Security Clearances
              </h4>

              <div className="flex flex-wrap gap-2 pt-1">
                {user?.permissions?.map((perm) => (
                  <span 
                    key={perm}
                    className="px-2.5 py-1 bg-secondary/50 border border-border rounded-lg text-xs font-mono font-bold text-muted-foreground"
                  >
                    {perm}
                  </span>
                ))}
                {(!user?.permissions || user.permissions.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">No administrative clearances declared.</span>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-border mt-8">
              <button 
                onClick={handleSaveSettings}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/95 transition-all shadow"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

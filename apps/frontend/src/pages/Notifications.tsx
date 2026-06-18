import { useNotificationStore } from '../store/notification.store';
import { Bell, Check, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Notifications() {
  const { notifications, markAsRead, clearAll } = useNotificationStore();

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast.success('Marked alert as read.');
  };

  const handleClearAll = () => {
    clearAll();
    toast.success('Cleared all alerts.');
  };

  return (
    <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Bell size={20} className="text-primary" />
          Alert Notifications Center
        </h3>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground rounded-lg text-xs font-semibold hover:bg-secondary transition-all"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center bg-secondary/10 border border-dashed border-border rounded-2xl text-muted-foreground">
          No alert logs present. You are all caught up!
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 border rounded-xl flex items-start justify-between gap-4 transition-all ${
                notif.isRead 
                  ? 'bg-secondary/15 border-border/60 opacity-70' 
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="space-y-1">
                <h4 className={`text-sm font-semibold ${!notif.isRead ? 'text-primary' : 'text-foreground'}`}>
                  {notif.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {notif.message}
                </p>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-semibold">
                  <Calendar size={12} />
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-all shrink-0"
                  title="Mark as read"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

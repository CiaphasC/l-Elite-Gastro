import { AlertTriangle, Bell, CheckCircle2, Crown, Info, Trash2 } from "lucide-react";
import type { NotificationItem } from "@/types";

interface NotificationPanelProps {
  isOpen: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onClear: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationPanel = ({
  isOpen,
  notifications,
  onClose,
  onClear,
  onMarkAsRead,
}: NotificationPanelProps) => {
  if (!isOpen) {
    return null;
  }

  const renderIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "stock":
        return <AlertTriangle size={16} className="text-red-400" />;
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case "vip":
        return <Crown size={16} className="text-[#E5C07B]" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel de notificaciones"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        onClick={onClose}
      />
      <div className="absolute right-0 top-16 z-50 flex max-h-[80vh] w-[88vw] max-w-96 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/95 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-4">
          <h4 className="flex items-center gap-2 text-sm font-bold text-white">
            <Bell size={14} className="text-[#E5C07B]" />
            Notificaciones
          </h4>
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-[10px] uppercase text-zinc-500 transition-colors hover:text-white"
            >
              <Trash2 size={12} />
              Limpiar
            </button>
          )}
        </div>

        <div className="custom-scroll flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center p-8 text-center text-zinc-500">
              <Bell size={24} className="mb-2 opacity-20" />
              <p className="text-xs">Todo tranquilo por aqui.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`group relative w-full border-b border-white/5 p-4 text-left transition-colors hover:bg-white/5 ${
                  notification.read ? "opacity-60" : "bg-[#E5C07B]/5"
                }`}
              >
                {!notification.read && (
                  <span className="absolute left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[#E5C07B]" />
                )}
                <div className="flex gap-3 pl-2">
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5 ${
                      notification.type === "stock"
                        ? "bg-red-500/10"
                        : notification.type === "success"
                          ? "bg-emerald-500/10"
                          : notification.type === "vip"
                            ? "bg-[#E5C07B]/10"
                            : "bg-blue-500/10"
                    }`}
                  >
                    {renderIcon(notification.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-3">
                      <h5 className={`text-xs font-bold ${notification.read ? "text-zinc-400" : "text-white"}`}>
                        {notification.title}
                      </h5>
                      <span className="shrink-0 text-[9px] text-zinc-600">{notification.time}</span>
                    </div>
                    <p className="text-[11px] leading-snug text-zinc-400 transition-colors group-hover:text-zinc-200">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Bell, Search } from "lucide-react";
import NotificationPanel from "@/features/layout/NotificationPanel";
import type { NotificationItem, UserRole } from "@/types";

interface HeaderProps {
  role: UserRole;
  title: string;
  showSearch: boolean;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  isNotificationPanelOpen: boolean;
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
  onToggleNotifications: () => void;
  onCloseNotifications: () => void;
  onClearNotifications: () => void;
  onReadNotification: (notificationId: string) => void;
}

const Header = ({
  role,
  title,
  showSearch,
  notifications,
  unreadNotificationsCount,
  isNotificationPanelOpen,
  searchTerm,
  onSearchTermChange,
  onToggleNotifications,
  onCloseNotifications,
  onClearNotifications,
  onReadNotification,
}: HeaderProps) => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const areaLabel = role === "admin" ? "Gerencia" : "Servicio";
  const profileRoleLabel = role === "admin" ? "Gerente" : "Maitre D'";

  useEffect(() => {
    if (!titleRef.current) {
      return;
    }

    gsap.killTweensOf(titleRef.current);
    gsap.fromTo(
      titleRef.current,
      { autoAlpha: 0, y: 10, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, [title]);

  return (
    <header className="sticky top-0 z-30 mb-6 border-b border-white/5 bg-[#050505]/90 py-4 backdrop-blur-md lg:-mt-4 lg:mb-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-3">
              <div className="h-[1px] w-8 bg-[#E5C07B]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E5C07B] sm:tracking-[0.4em]">
                {areaLabel}
              </span>
            </div>
            <h1
              ref={titleRef}
              className="font-serif text-2xl tracking-tight text-white sm:text-3xl lg:text-4xl"
            >
              {title}
            </h1>
          </div>

          <div className="relative flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            {showSearch && (
              <div className="group relative hidden lg:block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(event) => onSearchTermChange(event.target.value)}
                  className="w-64 rounded-full border border-white/10 bg-white/5 py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-[#E5C07B]/40 focus:bg-white/10 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="group relative">
                <button
                  type="button"
                  onClick={onToggleNotifications}
                  className="relative cursor-pointer text-zinc-400 transition-colors hover:text-white"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#E5C07B] shadow-[0_0_10px_#E5C07B]" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 border-l border-white/10 pl-4 lg:gap-4 lg:pl-6">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-white">Jean-Luc Picard</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#E5C07B]">
                    {profileRoleLabel}
                  </p>
                </div>
                <div className="w-10 rounded-full border border-[#E5C07B]/30 p-0.5">
                  <img
                    src="https://i.pravatar.cc/100?u=1"
                    className="h-full w-full rounded-full object-cover grayscale"
                    alt="Perfil"
                  />
                </div>
              </div>
            </div>

            <NotificationPanel
              isOpen={isNotificationPanelOpen}
              notifications={notifications}
              onClose={onCloseNotifications}
              onClear={onClearNotifications}
              onMarkAsRead={onReadNotification}
            />
          </div>
        </div>

        {showSearch && (
          <div className="group relative w-full lg:hidden">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-[#E5C07B]/40 focus:bg-white/10 focus:outline-none"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

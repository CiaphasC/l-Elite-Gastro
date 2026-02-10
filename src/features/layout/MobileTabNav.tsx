import type { ActiveTab } from "@/types";
import { settingsNavItem, primaryNavItems } from "@/features/layout/navItems";

const navItems = [...primaryNavItems, settingsNavItem];

interface MobileTabNavProps {
  activeTab: ActiveTab;
  onTabChange: (tabId: ActiveTab) => void;
}

const MobileTabNav = ({ activeTab, onTabChange }: MobileTabNavProps) => (
  <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#080808]/70 p-2 lg:hidden">
    {navItems.map(({ id, shortLabel, Icon }) => (
      <button
        key={id}
        onClick={() => onTabChange(id)}
        className={`flex min-w-[90px] shrink-0 flex-col items-center gap-1.5 rounded-xl px-3 py-2 transition-all ${
          activeTab === id
            ? "bg-[#E5C07B]/15 text-[#E5C07B]"
            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
        }`}
      >
        <Icon size={16} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">{shortLabel}</span>
      </button>
    ))}
  </div>
);

export default MobileTabNav;


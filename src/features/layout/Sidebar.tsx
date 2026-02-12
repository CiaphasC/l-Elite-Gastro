import { LogOut, UtensilsCrossed } from "lucide-react";
import type { ActiveTab } from "@/types";
import NavItem from "@/shared/components/NavItem";
import { primaryNavigationModules, settingsNavigationModule } from "@/features/registry";

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tabId: ActiveTab) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => (
  <aside className="z-20 hidden w-24 flex-col items-center gap-8 border-r border-white/5 bg-[#080808]/80 py-10 backdrop-blur-xl lg:flex">
    <div className="premium-gradient flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-transform duration-500 hover:scale-105">
      <UtensilsCrossed className="text-[#050505]" size={24} />
    </div>

    <nav className="flex w-full flex-col gap-3 px-4">
      {primaryNavigationModules.map(({ id, navLabel, Icon }) => (
        <NavItem
          key={id}
          icon={<Icon size={20} />}
          isActive={activeTab === id}
          onClick={() => onTabChange(id)}
          tooltip={navLabel}
        />
      ))}
    </nav>

    <div className="mt-auto flex w-full flex-col gap-4 px-4">
      <NavItem
        icon={<settingsNavigationModule.Icon size={20} />}
        isActive={activeTab === settingsNavigationModule.id}
        onClick={() => onTabChange(settingsNavigationModule.id)}
        tooltip={settingsNavigationModule.navLabel}
      />
      <button className="flex h-12 w-12 items-center justify-center rounded-xl text-red-400/60 transition-all hover:bg-red-500/10 hover:text-red-400">
        <LogOut size={20} />
      </button>
    </div>
  </aside>
);

export default Sidebar;


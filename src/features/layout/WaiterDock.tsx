import { CalendarDays, Grid2X2, LogOut, UtensilsCrossed } from "lucide-react";
import type { ActiveTab } from "@/types";

interface WaiterDockProps {
  activeTab: ActiveTab;
  onTabChange: (tabId: ActiveTab) => void;
  onLogout: () => void;
}

const waiterTabs: Array<{ id: ActiveTab; label: string; Icon: typeof UtensilsCrossed }> = [
  { id: "menu", label: "Menú", Icon: UtensilsCrossed },
  { id: "tables", label: "Salón", Icon: Grid2X2 },
  { id: "reservations", label: "Reservas", Icon: CalendarDays },
];

const WaiterDock = ({ activeTab, onTabChange, onLogout }: WaiterDockProps) => (
  <div className="fixed bottom-6 left-1/2 z-50 w-auto -translate-x-1/2">
    <nav className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0A0A0A]/90 px-4 py-2 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      {waiterTabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
            activeTab === id
              ? "border-[#E5C07B]/30 bg-[#E5C07B]/15 text-[#E5C07B]"
              : "border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
          }`}
          title={label}
          aria-label={label}
        >
          <Icon size={20} />
        </button>
      ))}

      <div className="mx-1 h-8 w-[1px] bg-white/10" />

      <button
        type="button"
        onClick={onLogout}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-red-400 transition-all hover:bg-red-500/10"
        title="Salir"
        aria-label="Salir del sistema"
      >
        <LogOut size={20} />
      </button>
    </nav>
  </div>
);

export default WaiterDock;

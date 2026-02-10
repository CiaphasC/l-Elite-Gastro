import {
  CalendarDays,
  ChefHat,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";
import NavItem from "../../shared/components/NavItem";

const primaryNavItems = [
  { id: "dash", label: "Dashboard", Icon: LayoutDashboard },
  { id: "menu", label: "Menu", Icon: UtensilsCrossed },
  { id: "tables", label: "Salon", Icon: Grid2X2 },
  { id: "reservations", label: "Reservas", Icon: CalendarDays },
  { id: "kitchen", label: "Cocina", Icon: ChefHat },
  { id: "clients", label: "Clientes", Icon: UserCheck },
  { id: "inventory", label: "Bodega", Icon: Package },
];

const Sidebar = ({ activeTab, onTabChange }) => (
  <aside className="z-20 flex w-24 flex-col items-center gap-8 border-r border-white/5 bg-[#080808]/80 py-10 backdrop-blur-xl">
    <div className="premium-gradient flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-transform duration-500 hover:scale-105">
      <UtensilsCrossed className="text-[#050505]" size={24} />
    </div>

    <nav className="flex w-full flex-col gap-3 px-4">
      {primaryNavItems.map(({ id, label, Icon }) => (
        <NavItem
          key={id}
          icon={<Icon size={20} />}
          isActive={activeTab === id}
          onClick={() => onTabChange(id)}
          tooltip={label}
        />
      ))}
    </nav>

    <div className="mt-auto flex w-full flex-col gap-4 px-4">
      <NavItem
        icon={<Settings size={20} />}
        isActive={activeTab === "settings"}
        onClick={() => onTabChange("settings")}
        tooltip="Ajustes"
      />
      <button className="flex h-12 w-12 items-center justify-center rounded-xl text-red-400/60 transition-all hover:bg-red-500/10 hover:text-red-400">
        <LogOut size={20} />
      </button>
    </div>
  </aside>
);

export default Sidebar;

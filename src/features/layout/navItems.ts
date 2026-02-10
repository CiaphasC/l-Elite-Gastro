import {
  CalendarDays,
  ChefHat,
  Grid2X2,
  LayoutDashboard,
  Package,
  Settings,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";
import type { NavConfigItem } from "@/types";

export const primaryNavItems: NavConfigItem[] = [
  { id: "dash", label: "Dashboard", shortLabel: "Inicio", Icon: LayoutDashboard },
  { id: "menu", label: "Menu", shortLabel: "Menu", Icon: UtensilsCrossed },
  { id: "tables", label: "Salon", shortLabel: "Salon", Icon: Grid2X2 },
  { id: "reservations", label: "Reservas", shortLabel: "Reservas", Icon: CalendarDays },
  { id: "kitchen", label: "Cocina", shortLabel: "Cocina", Icon: ChefHat },
  { id: "clients", label: "Clientes", shortLabel: "Clientes", Icon: UserCheck },
  { id: "inventory", label: "Bodega", shortLabel: "Bodega", Icon: Package },
];

export const settingsNavItem: NavConfigItem = {
  id: "settings",
  label: "Ajustes",
  shortLabel: "Ajustes",
  Icon: Settings,
};


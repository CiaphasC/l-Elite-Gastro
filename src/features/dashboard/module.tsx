import { LayoutDashboard } from "lucide-react";
import DashboardView from "@/features/dashboard/DashboardView";
import type { FeatureModule } from "@/features/types";

export const dashboardFeatureModule: FeatureModule = {
  id: "dash",
  title: "Resumen Ejecutivo",
  navLabel: "Dashboard",
  shortLabel: "Inicio",
  searchEnabled: false,
  Icon: LayoutDashboard,
  render: ({ state, actions, derived }) => (
    <DashboardView
      snapshot={state.dashboard}
      currencyCode={state.currencyCode}
      stockAlerts={derived.lowStockItems}
      onOpenInventoryTab={() => actions.setActiveTab("inventory")}
    />
  ),
};

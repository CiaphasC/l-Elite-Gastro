import { LayoutDashboard } from "lucide-react";
import DashboardFeatureContent from "@/features/dashboard/DashboardFeatureContent";
import type { FeatureModule } from "@/features/types";

export const dashboardFeatureModule: FeatureModule = {
  id: "dash",
  title: "Resumen Ejecutivo",
  navLabel: "Dashboard",
  shortLabel: "Inicio",
  searchEnabled: false,
  Icon: LayoutDashboard,
  render: () => <DashboardFeatureContent />,
};

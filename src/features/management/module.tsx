import { BriefcaseBusiness } from "lucide-react";
import ManagementFeatureContent from "@/features/management/ManagementFeatureContent";
import type { FeatureModule } from "@/features/types";

export const managementFeatureModule: FeatureModule = {
  id: "management",
  title: "Administracion",
  navLabel: "Gestion",
  shortLabel: "Gestion",
  searchEnabled: false,
  Icon: BriefcaseBusiness,
  render: () => <ManagementFeatureContent />,
};

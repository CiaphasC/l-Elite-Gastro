import { Settings } from "lucide-react";
import SettingsFeatureContent from "@/features/settings/SettingsFeatureContent";
import type { FeatureModule } from "@/features/types";

export const settingsFeatureModule: FeatureModule = {
  id: "settings",
  title: "Configuracion",
  navLabel: "Ajustes",
  shortLabel: "Ajustes",
  searchEnabled: false,
  Icon: Settings,
  render: () => <SettingsFeatureContent />,
};

import { Settings } from "lucide-react";
import SettingsView from "@/features/settings/SettingsView";
import type { FeatureModule } from "@/features/types";

export const settingsFeatureModule: FeatureModule = {
  id: "settings",
  title: "Configuracion",
  navLabel: "Ajustes",
  shortLabel: "Ajustes",
  searchEnabled: false,
  Icon: Settings,
  render: ({ state, actions }) => (
    <SettingsView
      selectedCurrencyCode={state.currencyCode}
      onCurrencyChange={actions.setCurrencyCode}
    />
  ),
};

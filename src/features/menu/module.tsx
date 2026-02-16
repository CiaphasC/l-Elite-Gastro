import { UtensilsCrossed } from "lucide-react";
import MenuFeatureContent from "@/features/menu/MenuFeatureContent";
import type { FeatureModule } from "@/features/types";

export const menuFeatureModule: FeatureModule = {
  id: "menu",
  title: "Carta de Autor",
  navLabel: "Menu",
  shortLabel: "Menu",
  searchEnabled: true,
  Icon: UtensilsCrossed,
  render: () => <MenuFeatureContent />,
};

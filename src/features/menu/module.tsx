import { UtensilsCrossed } from "lucide-react";
import MenuView from "@/features/menu/MenuView";
import type { FeatureModule } from "@/features/types";

export const menuFeatureModule: FeatureModule = {
  id: "menu",
  title: "Carta de Autor",
  navLabel: "Menu",
  shortLabel: "Menu",
  searchEnabled: true,
  Icon: UtensilsCrossed,
  render: ({ state, actions, derived }) => (
    <MenuView
      selectedCategory={state.selectedCategory}
      currencyCode={state.currencyCode}
      onSelectCategory={actions.setSelectedCategory}
      items={derived.filteredMenuItems}
      onAddToCart={actions.addToCart}
    />
  ),
};

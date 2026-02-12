import { ChefHat } from "lucide-react";
import KitchenView from "@/features/kitchen/KitchenView";
import type { FeatureModule } from "@/features/types";

export const kitchenFeatureModule: FeatureModule = {
  id: "kitchen",
  title: "Pase de Cocina",
  navLabel: "Cocina",
  shortLabel: "Cocina",
  searchEnabled: false,
  Icon: ChefHat,
  render: ({ state, actions }) => (
    <KitchenView orders={state.kitchenOrders} onOpenKitchenModal={actions.openKitchenModal} />
  ),
};

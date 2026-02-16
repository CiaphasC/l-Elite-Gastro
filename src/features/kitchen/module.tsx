import { ChefHat } from "lucide-react";
import KitchenFeatureContent from "@/features/kitchen/KitchenFeatureContent";
import type { FeatureModule } from "@/features/types";

export const kitchenFeatureModule: FeatureModule = {
  id: "kitchen",
  title: "Pase de Cocina",
  navLabel: "Cocina",
  shortLabel: "Cocina",
  searchEnabled: false,
  Icon: ChefHat,
  render: () => <KitchenFeatureContent />,
};

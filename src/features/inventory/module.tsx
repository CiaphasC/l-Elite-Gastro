import { Package } from "lucide-react";
import InventoryFeatureContent from "@/features/inventory/InventoryFeatureContent";
import type { FeatureModule } from "@/features/types";

export const inventoryFeatureModule: FeatureModule = {
  id: "inventory",
  title: "Control de Bodega",
  navLabel: "Bodega",
  shortLabel: "Bodega",
  searchEnabled: true,
  Icon: Package,
  render: () => <InventoryFeatureContent />,
};

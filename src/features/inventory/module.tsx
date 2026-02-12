import { Package } from "lucide-react";
import InventoryView from "@/features/inventory/InventoryView";
import type { FeatureModule } from "@/features/types";

export const inventoryFeatureModule: FeatureModule = {
  id: "inventory",
  title: "Control de Bodega",
  navLabel: "Bodega",
  shortLabel: "Bodega",
  searchEnabled: true,
  Icon: Package,
  render: ({ actions, derived }) => (
    <InventoryView items={derived.filteredInventoryItems} onAdjustStock={actions.adjustStock} />
  ),
};

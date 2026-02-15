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
  render: ({ state, actions, derived }) => (
    <InventoryView
      items={derived.filteredInventoryItems}
      inventoryMainTab={state.inventoryMainTab}
      kitchenInventoryTab={state.kitchenInventoryTab}
      onSetInventoryMainTab={actions.setInventoryMainTab}
      onSetKitchenInventoryTab={actions.setKitchenInventoryTab}
      onOpenCreateModal={actions.openInventoryCreateModal}
      onAdjustStock={actions.adjustStock}
    />
  ),
};

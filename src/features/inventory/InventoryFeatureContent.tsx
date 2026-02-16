import { memo, useMemo } from "react";
import { filterInventoryItems } from "@/domain/selectors";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import InventoryView from "@/features/inventory/InventoryView";

const InventoryFeatureContent = memo(() => {
  const { inventory, inventoryMainTab, kitchenInventoryTab, searchTerm } =
    useRestaurantShallowSelector((state) => ({
      inventory: state.inventory,
      inventoryMainTab: state.inventoryMainTab,
      kitchenInventoryTab: state.kitchenInventoryTab,
      searchTerm: state.searchTerm,
    }));
  const {
    setInventoryMainTab,
    setKitchenInventoryTab,
    openInventoryCreateModal,
    adjustStock,
  } = useRestaurantActions();

  const items = useMemo(
    () => filterInventoryItems(inventory, inventoryMainTab, kitchenInventoryTab, searchTerm),
    [inventory, inventoryMainTab, kitchenInventoryTab, searchTerm]
  );

  return (
    <InventoryView
      items={items}
      inventoryMainTab={inventoryMainTab}
      kitchenInventoryTab={kitchenInventoryTab}
      onSetInventoryMainTab={setInventoryMainTab}
      onSetKitchenInventoryTab={setKitchenInventoryTab}
      onOpenCreateModal={openInventoryCreateModal}
      onAdjustStock={adjustStock}
    />
  );
});

InventoryFeatureContent.displayName = "InventoryFeatureContent";

export default InventoryFeatureContent;

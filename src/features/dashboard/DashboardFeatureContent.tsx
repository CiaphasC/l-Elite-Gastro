import { memo, useMemo } from "react";
import { deriveLowStockItems } from "@/domain/selectors";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import DashboardView from "@/features/dashboard/DashboardView";

const DashboardFeatureContent = memo(() => {
  const { snapshot, currencyCode, inventory } = useRestaurantShallowSelector((state) => ({
    snapshot: state.dashboard,
    currencyCode: state.currencyCode,
    inventory: state.inventory,
  }));
  const { setActiveTab } = useRestaurantActions();
  const stockAlerts = useMemo(() => deriveLowStockItems(inventory), [inventory]);

  return (
    <DashboardView
      snapshot={snapshot}
      currencyCode={currencyCode}
      stockAlerts={stockAlerts}
      onOpenInventoryTab={() => setActiveTab("inventory")}
    />
  );
});

DashboardFeatureContent.displayName = "DashboardFeatureContent";

export default DashboardFeatureContent;

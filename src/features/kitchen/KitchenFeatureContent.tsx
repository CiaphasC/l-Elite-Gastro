import { memo, useMemo } from "react";
import { useRestaurantSelector } from "@/store/hooks";
import KitchenView from "@/features/kitchen/KitchenView";

const KitchenFeatureContent = memo(() => {
  const kitchenOrders = useRestaurantSelector((state) => state.kitchenOrders);
  const orderIds = useMemo(() => kitchenOrders.map((order) => order.id), [kitchenOrders]);

  return <KitchenView orderIds={orderIds} />;
});

KitchenFeatureContent.displayName = "KitchenFeatureContent";

export default KitchenFeatureContent;

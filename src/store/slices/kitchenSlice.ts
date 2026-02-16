import { removeKitchenOrder } from "@/domain/services/restaurantService";
import {
  closeKitchenModal,
  createNotification,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";

export const createKitchenSlice: RestaurantSliceCreator = (set, get) => ({
  completeKitchenOrder: (orderId?: string) => {
    const orderIdToComplete = orderId ?? get().ui.selectedOrderId;
    if (!orderIdToComplete) {
      return;
    }

    set((state) => ({
      kitchenOrders: removeKitchenOrder(state.kitchenOrders, orderIdToComplete),
      notifications: withPrependedNotifications(state.notifications, [
        createNotification(
          "success",
          "Servicio Completado",
          `Orden ${orderIdToComplete} servida.`,
          false,
          "Ahora",
          { navigateTo: "kitchen" }
        ),
      ]),
      ui: closeKitchenModal(state.ui),
    }));
  },
});

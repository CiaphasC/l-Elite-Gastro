import { reconcileCartWithInventory, updateInventoryStock } from "@/domain/services/restaurantService";
import {
  createNotification,
  createStockNotificationForItem,
  createStockTransitionNotifications,
  withInventoryAwareNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type { MenuItem } from "@/types";

export const createInventorySlice: RestaurantSliceCreator = (set) => ({
  adjustStock: (itemId: number, delta: number) =>
    set((state) => {
      const nextInventory = updateInventoryStock(state.inventory, itemId, delta);
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);

      return {
        inventory: nextInventory,
        cart: reconcileCartWithInventory(state.cart, nextInventory),
        notifications: withInventoryAwareNotifications(
          state.notifications,
          stockNotifications,
          nextInventory
        ),
      };
    }),

  addInventoryItem: (payload) =>
    set((state) => {
      const nextInventoryId =
        state.inventory.length === 0 ? 1 : Math.max(...state.inventory.map((item) => item.id)) + 1;
      const nextItem: MenuItem = {
        id: nextInventoryId,
        ...payload,
      };
      const nextInventory = [...state.inventory, nextItem];
      const stockNotification = createStockNotificationForItem(nextItem);

      return {
        inventory: nextInventory,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Inventario Actualizado",
              `${nextItem.name} fue registrado.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
            ...(stockNotification ? [stockNotification] : []),
          ],
          nextInventory
        ),
        ui: { ...state.ui, showInventoryCreateModal: false },
      };
    }),
});

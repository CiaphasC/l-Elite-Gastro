import { create } from "zustand";
import { createInitialRestaurantState } from "@/domain/createInitialRestaurantState";
import { createCartSlice } from "@/store/slices/cartSlice";
import { createClientSlice } from "@/store/slices/clientSlice";
import { createInventorySlice } from "@/store/slices/inventorySlice";
import { createKitchenSlice } from "@/store/slices/kitchenSlice";
import { createNotificationSlice } from "@/store/slices/notificationSlice";
import { createReservationSlice } from "@/store/slices/reservationSlice";
import { createTableServiceSlice } from "@/store/slices/tableServiceSlice";
import { createUiSlice } from "@/store/slices/uiSlice";
import { createAdministrationSlice } from "@/store/slices/administrationSlice";
import type { RestaurantActions, RestaurantState } from "@/types";

export type RestaurantStore = RestaurantState & RestaurantActions;

export const useRestaurantZustandStore = create<RestaurantStore>()((...args) => ({
  ...createInitialRestaurantState(),
  ...createUiSlice(...args),
  ...createAdministrationSlice(...args),
  ...createCartSlice(...args),
  ...createReservationSlice(...args),
  ...createInventorySlice(...args),
  ...createClientSlice(...args),
  ...createNotificationSlice(...args),
  ...createTableServiceSlice(...args),
  ...createKitchenSlice(...args),
}) as RestaurantStore);

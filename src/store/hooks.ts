import { useRestaurantZustandStore } from "@/store/restaurantStore";
import type { RestaurantStore } from "@/store/restaurantStore";
import type { RestaurantActions, RestaurantState } from "@/types";
import { useShallow } from "zustand/react/shallow";

const ACTION_KEYS = [
  "hydrateState",
  "setActiveTab",
  "setCurrencyCode",
  "setServiceTable",
  "setSearchTerm",
  "setSelectedCategory",
  "addToCart",
  "updateCartQty",
  "clearCart",
  "openCheckout",
  "closeCheckout",
  "confirmCheckout",
  "openReservationModal",
  "closeReservationModal",
  "addReservation",
  "assignReservationTable",
  "adjustStock",
  "setInventoryMainTab",
  "setKitchenInventoryTab",
  "setClientFilter",
  "setClientViewMode",
  "openClientModal",
  "closeClientModal",
  "saveClient",
  "openClientDetail",
  "closeClientDetail",
  "openInventoryCreateModal",
  "closeInventoryCreateModal",
  "addInventoryItem",
  "addTable",
  "updateTable",
  "removeTable",
  "reorderTables",
  "createWorkerAccount",
  "registerWorkerAccount",
  "updateWorkerAccount",
  "validateWorkerAccount",
  "removeWorkerAccount",
  "toggleNotificationPanel",
  "closeNotificationPanel",
  "markNotificationAsRead",
  "clearNotifications",
  "openTableConfirmation",
  "closeTableConfirmation",
  "confirmTableAction",
  "startOrderTaking",
  "cancelOrderTaking",
  "confirmOrderTaking",
  "openKitchenModal",
  "closeKitchenModal",
  "completeKitchenOrder",
] as const satisfies ReadonlyArray<keyof RestaurantActions>;

const pickObject = <T extends object, K extends readonly (keyof T)[]>(
  source: T,
  keys: K
): Pick<T, K[number]> => {
  const picked = {} as Pick<T, K[number]>;

  for (const key of keys) {
    picked[key] = source[key];
  }

  return picked;
};

const pickActions = (state: RestaurantStore): RestaurantActions =>
  pickObject(state, ACTION_KEYS);

export const useRestaurantActions = (): RestaurantActions =>
  useRestaurantZustandStore(useShallow(pickActions));

export const useRestaurantSelector = <Selected>(
  selector: (state: RestaurantState) => Selected
): Selected => useRestaurantZustandStore((state) => selector(state));

export const useRestaurantShallowSelector = <Selected extends object>(
  selector: (state: RestaurantState) => Selected
): Selected => useRestaurantZustandStore(useShallow((state) => selector(state)));

import { INITIAL_ACTIVE_TAB, MENU_CATEGORIES } from "@/domain/constants";
import { DEFAULT_CURRENCY_CODE } from "@/domain/currency";
import { buildDashboardSnapshot } from "@/domain/dashboard";
import { createStartupNotifications } from "@/domain/notifications";
import {
  CLIENTS,
  INITIAL_INVENTORY,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_SALES_HISTORY,
  INITIAL_SERVICE_CONTEXT,
  TABLES,
} from "@/domain/mockData";
import type { RestaurantState } from "@/types";

export const createInitialRestaurantState = (): RestaurantState => {
  const initialInventory = INITIAL_INVENTORY;
  const initialSalesHistory = INITIAL_SALES_HISTORY;
  const initialDashboardSnapshot = buildDashboardSnapshot(CLIENTS, initialSalesHistory);

  return {
    activeTab: INITIAL_ACTIVE_TAB,
    currencyCode: DEFAULT_CURRENCY_CODE,
    selectedCategory: MENU_CATEGORIES[0],
    searchTerm: "",
    notifications: createStartupNotifications(initialInventory),
    cart: [],
    inventory: initialInventory,
    kitchenOrders: INITIAL_KITCHEN_ORDERS,
    reservations: INITIAL_RESERVATIONS,
    clients: CLIENTS,
    tables: TABLES,
    salesHistory: initialSalesHistory,
    serviceContext: INITIAL_SERVICE_CONTEXT,
    dashboard: initialDashboardSnapshot,
    inventoryMainTab: "kitchen",
    kitchenInventoryTab: "dishes",
    clientFilter: "clients",
    clientViewMode: "cards",
    orderTakingContext: null,
    ui: {
      showCheckout: false,
      showReservationModal: false,
      reservationEditingId: null,
      kitchenModalType: null,
      selectedOrderId: null,
      showNotificationPanel: false,
      showInventoryCreateModal: false,
      confirmationModal: {
        isOpen: false,
        tableId: null,
        type: null,
      },
      reservationPrefill: null,
      clientModal: {
        isOpen: false,
        mode: "create",
        targetClientId: null,
        targetSegment: "clients",
      },
      selectedClientId: null,
    },
  };
};

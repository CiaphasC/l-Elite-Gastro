import { INITIAL_ACTIVE_TAB, MENU_CATEGORIES } from "@/domain/constants";
import type { RestaurantSeedData } from "@/domain/contracts/restaurantSeed";
import { DEFAULT_CURRENCY_CODE } from "@/domain/currency";
import { buildDashboardSnapshot } from "@/domain/dashboard";
import { RESTAURANT_SEED_DATA } from "@/domain/mockData";
import { createStartupNotifications } from "@/domain/notifications";
import type { RestaurantState } from "@/types";

const createDefaultUiState = (): RestaurantState["ui"] => ({
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
});

export const createRestaurantStateFromSeed = (seed: RestaurantSeedData): RestaurantState => {
  const initialInventory = seed.inventory;
  const initialSalesHistory = seed.salesHistory;
  const initialClients = seed.clients;

  return {
    activeTab: seed.activeTab ?? INITIAL_ACTIVE_TAB,
    currencyCode: seed.currencyCode ?? DEFAULT_CURRENCY_CODE,
    selectedCategory: seed.selectedCategory ?? MENU_CATEGORIES[0],
    searchTerm: "",
    notifications: createStartupNotifications(
      initialInventory,
      seed.startupNotifications ?? []
    ),
    cart: [],
    inventory: initialInventory,
    kitchenOrders: seed.kitchenOrders,
    reservations: seed.reservations,
    clients: initialClients,
    workers: seed.workers,
    tables: seed.tables,
    salesHistory: initialSalesHistory,
    serviceContext: seed.serviceContext,
    dashboard: buildDashboardSnapshot(initialClients, initialSalesHistory),
    inventoryMainTab: "kitchen",
    kitchenInventoryTab: "dishes",
    clientFilter: "clients",
    clientViewMode: "cards",
    orderTakingContext: null,
    ui: createDefaultUiState(),
  };
};

export const createInitialRestaurantState = (): RestaurantState =>
  createRestaurantStateFromSeed(RESTAURANT_SEED_DATA);

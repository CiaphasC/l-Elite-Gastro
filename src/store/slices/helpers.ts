import { buildDashboardSnapshot } from "@/domain/dashboard";
export {
  createNotification,
  createStockNotificationForItem,
  createStockTransitionNotifications,
  withInventoryAwareNotifications,
  withPrependedNotifications,
} from "@/domain/notifications";
import type { Client, SalesRecord, UIState } from "@/types";

export const closeKitchenModal = (uiState: UIState): UIState => ({
  ...uiState,
  kitchenModalType: null,
  selectedOrderId: null,
});

export const closeTableConfirmation = (uiState: UIState): UIState => ({
  ...uiState,
  confirmationModal: {
    isOpen: false,
    tableId: null,
    type: null,
  },
});

export const resolveClientMatch = (clients: Client[], name: string): Client | undefined => {
  const normalizedName = name.trim().toLowerCase();
  return clients.find((client) => client.name.trim().toLowerCase() === normalizedName);
};

export const resolveDashboardSnapshot = (clients: Client[], salesHistory: SalesRecord[]) =>
  buildDashboardSnapshot(clients, salesHistory);

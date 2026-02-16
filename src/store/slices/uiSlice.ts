import { closeKitchenModal, closeTableConfirmation } from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type {
  ActiveTab,
  ClientFilter,
  ClientViewMode,
  InventoryMainTab,
  KitchenInventoryTab,
  KitchenModalActionType,
  MenuCategory,
  ReservationPayload,
  SupportedCurrencyCode,
  TableConfirmationAction,
} from "@/types";

export const createUiSlice: RestaurantSliceCreator = (set) => ({
  hydrateState: (nextState) => set(() => nextState),

  setActiveTab: (tabId: ActiveTab) =>
    set(() => ({
      activeTab: tabId,
      searchTerm: "",
    })),

  setCurrencyCode: (currencyCode: SupportedCurrencyCode) =>
    set(() => ({
      currencyCode,
    })),

  setServiceTable: (tableId: number) =>
    set((state) => ({
      serviceContext: {
        ...state.serviceContext,
        tableId,
      },
    })),

  setSearchTerm: (searchTerm: string) =>
    set(() => ({
      searchTerm,
    })),

  setSelectedCategory: (selectedCategory: MenuCategory) =>
    set(() => ({
      selectedCategory,
    })),

  setInventoryMainTab: (inventoryMainTab: InventoryMainTab) =>
    set(() => ({
      inventoryMainTab,
    })),

  setKitchenInventoryTab: (kitchenInventoryTab: KitchenInventoryTab) =>
    set(() => ({
      kitchenInventoryTab,
    })),

  setClientFilter: (clientFilter: ClientFilter) =>
    set(() => ({
      clientFilter,
    })),

  setClientViewMode: (clientViewMode: ClientViewMode) =>
    set(() => ({
      clientViewMode,
    })),

  openCheckout: () =>
    set((state) => ({
      ui: { ...state.ui, showCheckout: true },
    })),

  closeCheckout: () =>
    set((state) => ({
      ui: { ...state.ui, showCheckout: false },
    })),

  openReservationModal: (prefill?: Partial<ReservationPayload>, reservationId?: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        showReservationModal: true,
        reservationPrefill: prefill ?? null,
        reservationEditingId: reservationId ?? null,
      },
    })),

  closeReservationModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showReservationModal: false,
        reservationPrefill: null,
        reservationEditingId: null,
      },
    })),

  openInventoryCreateModal: () =>
    set((state) => ({
      ui: { ...state.ui, showInventoryCreateModal: true },
    })),

  closeInventoryCreateModal: () =>
    set((state) => ({
      ui: { ...state.ui, showInventoryCreateModal: false },
    })),

  openClientModal: (segment: ClientFilter, clientId?: number) =>
    set((state) => ({
      ui: {
        ...state.ui,
        clientModal: {
          isOpen: true,
          mode: typeof clientId === "number" ? "edit" : "create",
          targetClientId: clientId ?? null,
          targetSegment: segment,
        },
      },
    })),

  closeClientModal: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        clientModal: {
          ...state.ui.clientModal,
          isOpen: false,
          targetClientId: null,
        },
      },
    })),

  openClientDetail: (clientId: number) =>
    set((state) => ({
      ui: { ...state.ui, selectedClientId: clientId },
    })),

  closeClientDetail: () =>
    set((state) => ({
      ui: { ...state.ui, selectedClientId: null },
    })),

  toggleNotificationPanel: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showNotificationPanel: !state.ui.showNotificationPanel,
      },
    })),

  closeNotificationPanel: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showNotificationPanel: false,
      },
    })),

  openTableConfirmation: (payload: { tableId: number; type: TableConfirmationAction }) =>
    set((state) => ({
      ui: {
        ...state.ui,
        confirmationModal: {
          isOpen: true,
          tableId: payload.tableId,
          type: payload.type,
        },
      },
    })),

  closeTableConfirmation: () =>
    set((state) => ({
      ui: closeTableConfirmation(state.ui),
    })),

  startOrderTaking: (payload: { tableId: number; clientName: string; reservationId: string | null }) =>
    set((state) => ({
      serviceContext: {
        ...state.serviceContext,
        tableId: payload.tableId,
      },
      orderTakingContext: {
        tableId: payload.tableId,
        clientName: payload.clientName,
        reservationId: payload.reservationId,
      },
    })),

  cancelOrderTaking: () =>
    set(() => ({
      orderTakingContext: null,
    })),

  openKitchenModal: (modalType: KitchenModalActionType, orderId: string) =>
    set((state) => ({
      ui: {
        ...state.ui,
        kitchenModalType: modalType,
        selectedOrderId: orderId,
      },
    })),

  closeKitchenModal: () =>
    set((state) => ({
      ui: closeKitchenModal(state.ui),
    })),
});

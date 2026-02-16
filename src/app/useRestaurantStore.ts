import { useMemo, useReducer } from "react";
import {
  selectCartItemsCount,
  selectCartServiceFee,
  selectCartSubtotal,
  selectCartTotal,
  selectFilteredClients,
  selectFilteredInventoryItems,
  selectFilteredMenuItems,
  selectFilteredVipClients,
  selectLowStockItems,
  selectMenuCategories,
  selectSelectedClient,
  selectSelectedKitchenOrder,
  selectUnreadNotificationsCount,
} from "@/domain/selectors";
import { ACTIONS, createInitialState, restaurantReducer } from "@/state/restaurantReducer";
import type {
  ActiveTab,
  ClientFilter,
  ClientPayload,
  ClientViewMode,
  InventoryItemPayload,
  InventoryMainTab,
  KitchenInventoryTab,
  KitchenModalActionType,
  MenuCategory,
  MenuItem,
  OrderTakingConfirmationPayload,
  ReservationPayload,
  RestaurantActions,
  RestaurantDerived,
  RestaurantStore,
  SupportedCurrencyCode,
  TableConfirmationAction,
} from "@/types";

export const useRestaurantStore = (): RestaurantStore => {
  const [state, dispatch] = useReducer(restaurantReducer, undefined, createInitialState);

  const actions = useMemo<RestaurantActions>(
    () => ({
      finishBoot: () => dispatch({ type: ACTIONS.BOOT_COMPLETED }),
      setActiveTab: (tabId: ActiveTab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tabId }),
      setCurrencyCode: (currencyCode: SupportedCurrencyCode) =>
        dispatch({ type: ACTIONS.SET_CURRENCY_CODE, payload: currencyCode }),
      setServiceTable: (tableId: number) =>
        dispatch({ type: ACTIONS.SET_SERVICE_TABLE, payload: tableId }),
      setSearchTerm: (searchTerm: string) =>
        dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: searchTerm }),
      setSelectedCategory: (category: MenuCategory) =>
        dispatch({ type: ACTIONS.SET_SELECTED_CATEGORY, payload: category }),
      addToCart: (menuItem: MenuItem) => dispatch({ type: ACTIONS.ADD_TO_CART, payload: menuItem }),
      updateCartQty: (itemId: number, delta: number) =>
        dispatch({
          type: ACTIONS.UPDATE_CART_QTY,
          payload: { itemId, delta },
        }),
      clearCart: () => dispatch({ type: ACTIONS.CLEAR_CART }),
      openCheckout: () => dispatch({ type: ACTIONS.SET_CHECKOUT_OPEN, payload: true }),
      closeCheckout: () => dispatch({ type: ACTIONS.SET_CHECKOUT_OPEN, payload: false }),
      confirmCheckout: () => dispatch({ type: ACTIONS.CONFIRM_CHECKOUT }),
      openReservationModal: (
        prefill?: Partial<ReservationPayload>,
        reservationId?: string
      ) =>
        dispatch({
          type: ACTIONS.SET_RESERVATION_MODAL_OPEN,
          payload: {
            isOpen: true,
            prefill: prefill ?? null,
            reservationId: reservationId ?? null,
          },
        }),
      closeReservationModal: () =>
        dispatch({
          type: ACTIONS.SET_RESERVATION_MODAL_OPEN,
          payload: { isOpen: false },
        }),
      addReservation: (reservationPayload: ReservationPayload) =>
        dispatch({
          type: ACTIONS.ADD_RESERVATION,
          payload: reservationPayload,
        }),
      assignReservationTable: (reservationId: string, tableId: number) =>
        dispatch({
          type: ACTIONS.ASSIGN_RESERVATION_TABLE,
          payload: { reservationId, tableId },
        }),
      adjustStock: (itemId: number, delta: number) =>
        dispatch({
          type: ACTIONS.ADJUST_STOCK,
          payload: { itemId, delta },
        }),
      setInventoryMainTab: (tab: InventoryMainTab) =>
        dispatch({ type: ACTIONS.SET_INVENTORY_MAIN_TAB, payload: tab }),
      setKitchenInventoryTab: (tab: KitchenInventoryTab) =>
        dispatch({ type: ACTIONS.SET_KITCHEN_INVENTORY_TAB, payload: tab }),
      openInventoryCreateModal: () => dispatch({ type: ACTIONS.OPEN_INVENTORY_CREATE_MODAL }),
      closeInventoryCreateModal: () => dispatch({ type: ACTIONS.CLOSE_INVENTORY_CREATE_MODAL }),
      addInventoryItem: (payload: InventoryItemPayload) =>
        dispatch({ type: ACTIONS.ADD_INVENTORY_ITEM, payload }),
      setClientFilter: (filter: ClientFilter) =>
        dispatch({ type: ACTIONS.SET_CLIENT_FILTER, payload: filter }),
      setClientViewMode: (mode: ClientViewMode) =>
        dispatch({ type: ACTIONS.SET_CLIENT_VIEW_MODE, payload: mode }),
      openClientModal: (segment: ClientFilter, clientId?: number) =>
        dispatch({ type: ACTIONS.OPEN_CLIENT_MODAL, payload: { segment, clientId } }),
      closeClientModal: () => dispatch({ type: ACTIONS.CLOSE_CLIENT_MODAL }),
      saveClient: (payload: ClientPayload) =>
        dispatch({ type: ACTIONS.SAVE_CLIENT, payload }),
      openClientDetail: (clientId: number) =>
        dispatch({ type: ACTIONS.OPEN_CLIENT_DETAIL, payload: clientId }),
      closeClientDetail: () => dispatch({ type: ACTIONS.CLOSE_CLIENT_DETAIL }),
      toggleNotificationPanel: () => dispatch({ type: ACTIONS.TOGGLE_NOTIFICATION_PANEL }),
      closeNotificationPanel: () => dispatch({ type: ACTIONS.CLOSE_NOTIFICATION_PANEL }),
      markNotificationAsRead: (notificationId: string) =>
        dispatch({ type: ACTIONS.MARK_NOTIFICATION_AS_READ, payload: notificationId }),
      clearNotifications: () => dispatch({ type: ACTIONS.CLEAR_NOTIFICATIONS }),
      openTableConfirmation: (payload: { tableId: number; type: TableConfirmationAction }) =>
        dispatch({ type: ACTIONS.OPEN_TABLE_CONFIRMATION, payload }),
      closeTableConfirmation: () => dispatch({ type: ACTIONS.CLOSE_TABLE_CONFIRMATION }),
      confirmTableAction: () => dispatch({ type: ACTIONS.CONFIRM_TABLE_ACTION }),
      startOrderTaking: (payload: {
        tableId: number;
        clientName: string;
        reservationId: string | null;
      }) => dispatch({ type: ACTIONS.START_ORDER_TAKING, payload }),
      cancelOrderTaking: () => dispatch({ type: ACTIONS.CANCEL_ORDER_TAKING }),
      confirmOrderTaking: (payload: OrderTakingConfirmationPayload) =>
        dispatch({ type: ACTIONS.CONFIRM_ORDER_TAKING, payload }),
      openKitchenModal: (modalType: KitchenModalActionType, orderId: string) =>
        dispatch({
          type: ACTIONS.OPEN_KITCHEN_MODAL,
          payload: { modalType, orderId },
        }),
      closeKitchenModal: () => dispatch({ type: ACTIONS.CLOSE_KITCHEN_MODAL }),
      completeKitchenOrder: (orderId?: string) =>
        dispatch({ type: ACTIONS.COMPLETE_KITCHEN_ORDER, payload: orderId }),
    }),
    []
  );

  const derived = useMemo<RestaurantDerived>(
    () => ({
      menuCategories: selectMenuCategories(state),
      filteredMenuItems: selectFilteredMenuItems(state),
      filteredInventoryItems: selectFilteredInventoryItems(state),
      filteredClients: selectFilteredClients(state),
      filteredVipClients: selectFilteredVipClients(state),
      cartItemsCount: selectCartItemsCount(state),
      cartSubtotal: selectCartSubtotal(state),
      cartServiceFee: selectCartServiceFee(state),
      cartTotal: selectCartTotal(state),
      lowStockItems: selectLowStockItems(state),
      selectedKitchenOrder: selectSelectedKitchenOrder(state),
      unreadNotificationsCount: selectUnreadNotificationsCount(state),
      selectedClient: selectSelectedClient(state),
    }),
    [state]
  );

  return { state, actions, derived };
};

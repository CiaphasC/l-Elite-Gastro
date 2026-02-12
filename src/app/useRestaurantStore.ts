import { useMemo, useReducer } from "react";
import {
  selectCartItemsCount,
  selectCartServiceFee,
  selectCartSubtotal,
  selectCartTotal,
  selectFilteredClients,
  selectFilteredInventoryItems,
  selectFilteredMenuItems,
  selectLowStockItems,
  selectSelectedKitchenOrder,
} from "@/domain/selectors";
import { ACTIONS, createInitialState, restaurantReducer } from "@/state/restaurantReducer";
import type {
  ActiveTab,
  KitchenModalActionType,
  MenuCategory,
  MenuItem,
  ReservationPayload,
  RestaurantActions,
  RestaurantDerived,
  RestaurantStore,
  SupportedCurrencyCode,
} from "@/types";

export const useRestaurantStore = (): RestaurantStore => {
  const [state, dispatch] = useReducer(
    restaurantReducer,
    undefined,
    createInitialState
  );

  const actions = useMemo<RestaurantActions>(
    () => ({
      finishBoot: () => dispatch({ type: ACTIONS.BOOT_COMPLETED }),
      setActiveTab: (tabId: ActiveTab) =>
        dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tabId }),
      setCurrencyCode: (currencyCode: SupportedCurrencyCode) =>
        dispatch({ type: ACTIONS.SET_CURRENCY_CODE, payload: currencyCode }),
      setSearchTerm: (searchTerm: string) =>
        dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: searchTerm }),
      setSelectedCategory: (category: MenuCategory) =>
        dispatch({ type: ACTIONS.SET_SELECTED_CATEGORY, payload: category }),
      addToCart: (menuItem: MenuItem) =>
        dispatch({ type: ACTIONS.ADD_TO_CART, payload: menuItem }),
      updateCartQty: (itemId: number, delta: number) =>
        dispatch({
          type: ACTIONS.UPDATE_CART_QTY,
          payload: { itemId, delta },
        }),
      clearCart: () => dispatch({ type: ACTIONS.CLEAR_CART }),
      openCheckout: () =>
        dispatch({ type: ACTIONS.SET_CHECKOUT_OPEN, payload: true }),
      closeCheckout: () =>
        dispatch({ type: ACTIONS.SET_CHECKOUT_OPEN, payload: false }),
      confirmCheckout: () => dispatch({ type: ACTIONS.CONFIRM_CHECKOUT }),
      openReservationModal: () =>
        dispatch({
          type: ACTIONS.SET_RESERVATION_MODAL_OPEN,
          payload: true,
        }),
      closeReservationModal: () =>
        dispatch({
          type: ACTIONS.SET_RESERVATION_MODAL_OPEN,
          payload: false,
        }),
      addReservation: (reservationPayload: ReservationPayload) =>
        dispatch({
          type: ACTIONS.ADD_RESERVATION,
          payload: reservationPayload,
        }),
      adjustStock: (itemId: number, delta: number) =>
        dispatch({
          type: ACTIONS.ADJUST_STOCK,
          payload: { itemId, delta },
        }),
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
      filteredMenuItems: selectFilteredMenuItems(state),
      filteredInventoryItems: selectFilteredInventoryItems(state),
      filteredClients: selectFilteredClients(state),
      cartItemsCount: selectCartItemsCount(state),
      cartSubtotal: selectCartSubtotal(state),
      cartServiceFee: selectCartServiceFee(state),
      cartTotal: selectCartTotal(state),
      lowStockItems: selectLowStockItems(state),
      selectedKitchenOrder: selectSelectedKitchenOrder(state),
    }),
    [state]
  );

  return { state, actions, derived };
};


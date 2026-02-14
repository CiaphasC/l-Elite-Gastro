import { INITIAL_ACTIVE_TAB, MENU_CATEGORIES } from "@/domain/constants";
import { DEFAULT_CURRENCY_CODE } from "@/domain/currency";
import {
  CLIENTS,
  INITIAL_DASHBOARD_SNAPSHOT,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  INITIAL_SERVICE_CONTEXT,
  TABLES,
} from "@/domain/mockData";
import { selectCartTotal } from "@/domain/selectors";
import {
  addItemToCart,
  applyCheckoutToInventory,
  appendReservationWithTableAssignment,
  assignTableToReservation,
  reconcileCartWithInventory,
  removeKitchenOrder,
  updateCartItemQty,
  updateInventoryStock,
} from "@/domain/services/restaurantService";
import type {
  ActiveTab,
  KitchenModalType,
  MenuCategory,
  MenuItem,
  ReservationPayload,
  RestaurantState,
  SupportedCurrencyCode,
  UIState,
} from "@/types";

export const ACTIONS = Object.freeze({
  BOOT_COMPLETED: "BOOT_COMPLETED",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_CURRENCY_CODE: "SET_CURRENCY_CODE",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  ADD_TO_CART: "ADD_TO_CART",
  UPDATE_CART_QTY: "UPDATE_CART_QTY",
  CLEAR_CART: "CLEAR_CART",
  SET_CHECKOUT_OPEN: "SET_CHECKOUT_OPEN",
  CONFIRM_CHECKOUT: "CONFIRM_CHECKOUT",
  SET_RESERVATION_MODAL_OPEN: "SET_RESERVATION_MODAL_OPEN",
  ADD_RESERVATION: "ADD_RESERVATION",
  ASSIGN_RESERVATION_TABLE: "ASSIGN_RESERVATION_TABLE",
  ADJUST_STOCK: "ADJUST_STOCK",
  OPEN_KITCHEN_MODAL: "OPEN_KITCHEN_MODAL",
  CLOSE_KITCHEN_MODAL: "CLOSE_KITCHEN_MODAL",
  COMPLETE_KITCHEN_ORDER: "COMPLETE_KITCHEN_ORDER",
} as const);

type RestaurantAction =
  | { type: typeof ACTIONS.BOOT_COMPLETED }
  | { type: typeof ACTIONS.SET_ACTIVE_TAB; payload: ActiveTab }
  | { type: typeof ACTIONS.SET_CURRENCY_CODE; payload: SupportedCurrencyCode }
  | { type: typeof ACTIONS.SET_SEARCH_TERM; payload: string }
  | { type: typeof ACTIONS.SET_SELECTED_CATEGORY; payload: MenuCategory }
  | { type: typeof ACTIONS.ADD_TO_CART; payload: MenuItem }
  | {
      type: typeof ACTIONS.UPDATE_CART_QTY;
      payload: { itemId: number; delta: number };
    }
  | { type: typeof ACTIONS.CLEAR_CART }
  | { type: typeof ACTIONS.SET_CHECKOUT_OPEN; payload: boolean }
  | { type: typeof ACTIONS.CONFIRM_CHECKOUT }
  | { type: typeof ACTIONS.SET_RESERVATION_MODAL_OPEN; payload: boolean }
  | { type: typeof ACTIONS.ADD_RESERVATION; payload: ReservationPayload }
  | {
      type: typeof ACTIONS.ASSIGN_RESERVATION_TABLE;
      payload: { reservationId: string; tableId: number };
    }
  | { type: typeof ACTIONS.ADJUST_STOCK; payload: { itemId: number; delta: number } }
  | {
      type: typeof ACTIONS.OPEN_KITCHEN_MODAL;
      payload: { modalType: Exclude<KitchenModalType, null>; orderId: string };
    }
  | { type: typeof ACTIONS.CLOSE_KITCHEN_MODAL }
  | { type: typeof ACTIONS.COMPLETE_KITCHEN_ORDER; payload?: string };

export const createInitialState = (): RestaurantState => ({
  activeTab: INITIAL_ACTIVE_TAB,
  currencyCode: DEFAULT_CURRENCY_CODE,
  selectedCategory: MENU_CATEGORIES[0],
  searchTerm: "",
  notifications: 3,
  cart: [],
  inventory: INITIAL_MENU_ITEMS,
  kitchenOrders: INITIAL_KITCHEN_ORDERS,
  reservations: INITIAL_RESERVATIONS,
  clients: CLIENTS,
  tables: TABLES,
  serviceContext: INITIAL_SERVICE_CONTEXT,
  dashboard: INITIAL_DASHBOARD_SNAPSHOT,
  ui: {
    isLoading: true,
    showCheckout: false,
    showReservationModal: false,
    kitchenModalType: null,
    selectedOrderId: null,
  },
});

const closeKitchenModal = (uiState: UIState): UIState => ({
  ...uiState,
  kitchenModalType: null,
  selectedOrderId: null,
});

export const restaurantReducer = (
  state: RestaurantState,
  action: RestaurantAction
): RestaurantState => {
  switch (action.type) {
    case ACTIONS.BOOT_COMPLETED:
      return {
        ...state,
        ui: { ...state.ui, isLoading: false },
      };

    case ACTIONS.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
        searchTerm: "",
      };

    case ACTIONS.SET_CURRENCY_CODE:
      return {
        ...state,
        currencyCode: action.payload,
      };

    case ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case ACTIONS.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case ACTIONS.ADD_TO_CART: {
      return {
        ...state,
        cart: addItemToCart(state.cart, action.payload, state.inventory),
      };
    }

    case ACTIONS.UPDATE_CART_QTY:
      return {
        ...state,
        cart: updateCartItemQty(
          state.cart,
          state.inventory,
          action.payload.itemId,
          action.payload.delta
        ),
      };

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
      };

    case ACTIONS.SET_CHECKOUT_OPEN:
      return {
        ...state,
        ui: { ...state.ui, showCheckout: action.payload },
      };

    case ACTIONS.CONFIRM_CHECKOUT: {
      if (state.cart.length === 0) {
        return {
          ...state,
          ui: { ...state.ui, showCheckout: false },
        };
      }

      const checkoutTotal = selectCartTotal(state);
      const nextInventory = applyCheckoutToInventory(state.inventory, state.cart);

      return {
        ...state,
        inventory: nextInventory,
        cart: [],
        dashboard: {
          ...state.dashboard,
          netSales: state.dashboard.netSales + checkoutTotal,
        },
        ui: { ...state.ui, showCheckout: false },
      };
    }

    case ACTIONS.SET_RESERVATION_MODAL_OPEN:
      return {
        ...state,
        ui: { ...state.ui, showReservationModal: action.payload },
      };

    case ACTIONS.ADD_RESERVATION: {
      const reservationMutationResult = appendReservationWithTableAssignment(
        state.reservations,
        state.tables,
        action.payload
      );

      return {
        ...state,
        reservations: reservationMutationResult.reservations,
        tables: reservationMutationResult.tables,
        ui: { ...state.ui, showReservationModal: false },
      };
    }

    case ACTIONS.ASSIGN_RESERVATION_TABLE: {
      const assignmentResult = assignTableToReservation(
        state.reservations,
        state.tables,
        action.payload.reservationId,
        action.payload.tableId
      );

      return {
        ...state,
        reservations: assignmentResult.reservations,
        tables: assignmentResult.tables,
      };
    }

    case ACTIONS.ADJUST_STOCK: {
      const nextInventory = updateInventoryStock(
        state.inventory,
        action.payload.itemId,
        action.payload.delta
      );

      return {
        ...state,
        inventory: nextInventory,
        cart: reconcileCartWithInventory(state.cart, nextInventory),
      };
    }

    case ACTIONS.OPEN_KITCHEN_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          kitchenModalType: action.payload.modalType,
          selectedOrderId: action.payload.orderId,
        },
      };

    case ACTIONS.CLOSE_KITCHEN_MODAL:
      return {
        ...state,
        ui: closeKitchenModal(state.ui),
      };

    case ACTIONS.COMPLETE_KITCHEN_ORDER: {
      const orderIdToComplete = action.payload ?? state.ui.selectedOrderId;
      if (!orderIdToComplete) {
        return state;
      }

      return {
        ...state,
        kitchenOrders: removeKitchenOrder(state.kitchenOrders, orderIdToComplete),
        ui: closeKitchenModal(state.ui),
      };
    }

    default:
      return state;
  }
};


import { INITIAL_ACTIVE_TAB, MENU_CATEGORIES } from "@/domain/constants";
import {
  CLIENTS,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_MENU_ITEMS,
  INITIAL_RESERVATIONS,
  TABLES,
} from "@/domain/mockData";
import {
  addItemToCart,
  appendReservation,
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
  UIState,
} from "@/types";

export const ACTIONS = Object.freeze({
  BOOT_COMPLETED: "BOOT_COMPLETED",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_SELECTED_CATEGORY: "SET_SELECTED_CATEGORY",
  ADD_TO_CART: "ADD_TO_CART",
  UPDATE_CART_QTY: "UPDATE_CART_QTY",
  CLEAR_CART: "CLEAR_CART",
  SET_CHECKOUT_OPEN: "SET_CHECKOUT_OPEN",
  CONFIRM_CHECKOUT: "CONFIRM_CHECKOUT",
  SET_RESERVATION_MODAL_OPEN: "SET_RESERVATION_MODAL_OPEN",
  ADD_RESERVATION: "ADD_RESERVATION",
  ADJUST_STOCK: "ADJUST_STOCK",
  OPEN_KITCHEN_MODAL: "OPEN_KITCHEN_MODAL",
  CLOSE_KITCHEN_MODAL: "CLOSE_KITCHEN_MODAL",
  COMPLETE_KITCHEN_ORDER: "COMPLETE_KITCHEN_ORDER",
} as const);

type RestaurantAction =
  | { type: typeof ACTIONS.BOOT_COMPLETED }
  | { type: typeof ACTIONS.SET_ACTIVE_TAB; payload: ActiveTab }
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
  | { type: typeof ACTIONS.ADJUST_STOCK; payload: { itemId: number; delta: number } }
  | {
      type: typeof ACTIONS.OPEN_KITCHEN_MODAL;
      payload: { modalType: Exclude<KitchenModalType, null>; orderId: string };
    }
  | { type: typeof ACTIONS.CLOSE_KITCHEN_MODAL }
  | { type: typeof ACTIONS.COMPLETE_KITCHEN_ORDER; payload?: string };

export const createInitialState = (): RestaurantState => ({
  activeTab: INITIAL_ACTIVE_TAB,
  selectedCategory: MENU_CATEGORIES[0],
  searchTerm: "",
  notifications: 3,
  cart: [],
  inventory: INITIAL_MENU_ITEMS,
  kitchenOrders: INITIAL_KITCHEN_ORDERS,
  reservations: INITIAL_RESERVATIONS,
  clients: CLIENTS,
  tables: TABLES,
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
      const item = action.payload;
      const inventoryItem = state.inventory.find(
        (inventoryLine: MenuItem) => inventoryLine.id === item.id
      );
      if (!inventoryItem || inventoryItem.stock === 0) {
        return state;
      }

      return {
        ...state,
        cart: addItemToCart(state.cart, item),
      };
    }

    case ACTIONS.UPDATE_CART_QTY:
      return {
        ...state,
        cart: updateCartItemQty(
          state.cart,
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

    case ACTIONS.CONFIRM_CHECKOUT:
      return {
        ...state,
        cart: [],
        ui: { ...state.ui, showCheckout: false },
      };

    case ACTIONS.SET_RESERVATION_MODAL_OPEN:
      return {
        ...state,
        ui: { ...state.ui, showReservationModal: action.payload },
      };

    case ACTIONS.ADD_RESERVATION:
      return {
        ...state,
        reservations: appendReservation(state.reservations, action.payload),
        ui: { ...state.ui, showReservationModal: false },
      };

    case ACTIONS.ADJUST_STOCK:
      return {
        ...state,
        inventory: updateInventoryStock(
          state.inventory,
          action.payload.itemId,
          action.payload.delta
        ),
      };

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


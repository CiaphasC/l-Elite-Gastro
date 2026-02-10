import type {
  CartItem,
  Client,
  KitchenOrder,
  MenuItem,
  RestaurantState,
} from "@/types";

const normalizeText = (value = ""): string => value.trim().toLowerCase();

const includesText = (source: string, term: string): boolean =>
  term.length === 0 || source.toLowerCase().includes(term);

export const selectFilteredMenuItems = (state: RestaurantState): MenuItem[] => {
  const term = normalizeText(state.searchTerm);
  return state.inventory.filter(
    (item) =>
      item.category === state.selectedCategory && includesText(item.name, term)
  );
};

export const selectFilteredInventoryItems = (state: RestaurantState): MenuItem[] => {
  const term = normalizeText(state.searchTerm);
  return state.inventory.filter(
    (item) =>
      includesText(item.name, term) ||
      includesText(item.category, term) ||
      includesText(item.unit, term)
  );
};

export const selectFilteredClients = (state: RestaurantState): Client[] => {
  const term = normalizeText(state.searchTerm);
  return state.clients.filter(
    (client) =>
      includesText(client.name, term) ||
      includesText(client.tier, term) ||
      includesText(client.preferences, term)
  );
};

export const selectCartSubtotal = (state: RestaurantState): number =>
  state.cart.reduce((acc: number, item: CartItem) => acc + item.price * item.qty, 0);

export const selectCartServiceFee = (state: RestaurantState): number =>
  selectCartSubtotal(state) * 0.1;

export const selectCartTotal = (state: RestaurantState): number =>
  selectCartSubtotal(state) + selectCartServiceFee(state);

export const selectCartItemsCount = (state: RestaurantState): number =>
  state.cart.reduce((acc: number, item: CartItem) => acc + item.qty, 0);

export const selectLowStockItems = (
  state: RestaurantState,
  threshold = 10
): MenuItem[] =>
  state.inventory.filter((item) => item.stock < threshold);

export const selectSelectedKitchenOrder = (
  state: RestaurantState
): KitchenOrder | null =>
  state.kitchenOrders.find((order) => order.id === state.ui.selectedOrderId) ||
  null;


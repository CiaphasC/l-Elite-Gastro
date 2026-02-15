import { MENU_CATEGORY_PRIORITY } from "@/domain/constants";
import type {
  CartItem,
  Client,
  KitchenOrder,
  MenuCategory,
  MenuItem,
  RestaurantState,
} from "@/types";

const BAR_CATEGORIES = new Set<MenuCategory>([
  "Vinos",
  "Coctelería",
  "Cervezas",
  "Licores",
  "Refrescos",
]);

const normalizeText = (value = ""): string => value.trim().toLowerCase();

const includesText = (source: string, term: string): boolean =>
  term.length === 0 || source.toLowerCase().includes(term);

const isBarInventoryCategory = (category: MenuCategory): boolean => BAR_CATEGORIES.has(category);

export const selectMenuCategories = (state: RestaurantState): MenuCategory[] => {
  const categories = [...new Set(state.inventory.filter((item) => item.type === "dish").map((item) => item.category))];

  return categories.sort((categoryA, categoryB) => {
    const indexA = MENU_CATEGORY_PRIORITY.indexOf(categoryA);
    const indexB = MENU_CATEGORY_PRIORITY.indexOf(categoryB);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) {
      return -1;
    }

    if (indexB !== -1) {
      return 1;
    }

    return categoryA.localeCompare(categoryB);
  });
};

export const selectFilteredMenuItems = (state: RestaurantState): MenuItem[] => {
  const term = normalizeText(state.searchTerm);

  return state.inventory.filter(
    (item) =>
      item.type === "dish" &&
      item.category === state.selectedCategory &&
      includesText(item.name, term)
  );
};

export const selectFilteredInventoryItems = (state: RestaurantState): MenuItem[] => {
  const term = normalizeText(state.searchTerm);

  return state.inventory.filter((item) => {
    const inKitchen = state.inventoryMainTab === "kitchen";
    const isBarCategory = isBarInventoryCategory(item.category);

    if (inKitchen && isBarCategory) {
      return false;
    }

    if (!inKitchen && !isBarCategory) {
      return false;
    }

    if (inKitchen) {
      if (state.kitchenInventoryTab === "dishes" && item.type !== "dish") {
        return false;
      }

      if (state.kitchenInventoryTab === "ingredients" && item.type !== "ingredient") {
        return false;
      }
    }

    return (
      includesText(item.name, term) ||
      includesText(item.category, term) ||
      includesText(item.unit, term)
    );
  });
};

export const selectFilteredClients = (state: RestaurantState): Client[] => {
  const term = normalizeText(state.searchTerm);
  const isVipFilter = state.clientFilter === "vip";

  return state.clients.filter((client) => {
    const passesSegment = isVipFilter ? client.tier === "Gold" : client.tier !== "Gold";
    if (!passesSegment) {
      return false;
    }

    return (
      includesText(client.name, term) ||
      includesText(client.tier, term) ||
      includesText(client.preferences, term) ||
      includesText(client.docNumber, term)
    );
  });
};

export const selectFilteredVipClients = (state: RestaurantState): Client[] =>
  state.clients.filter((client) => client.tier === "Gold");

export const selectCartSubtotal = (state: RestaurantState): number =>
  state.cart.reduce((acc: number, item: CartItem) => acc + item.price * item.qty, 0);

export const selectCartServiceFee = (state: RestaurantState): number =>
  selectCartSubtotal(state) * 0.1;

export const selectCartTotal = (state: RestaurantState): number =>
  selectCartSubtotal(state) + selectCartServiceFee(state);

export const selectCartItemsCount = (state: RestaurantState): number =>
  state.cart.reduce((acc: number, item: CartItem) => acc + item.qty, 0);

export const selectLowStockItems = (state: RestaurantState, threshold = 10): MenuItem[] =>
  state.inventory.filter((item) => item.stock < threshold);

export const selectSelectedKitchenOrder = (state: RestaurantState): KitchenOrder | null =>
  state.kitchenOrders.find((order) => order.id === state.ui.selectedOrderId) || null;

export const selectUnreadNotificationsCount = (state: RestaurantState): number =>
  state.notifications.filter((notification) => !notification.read).length;

export const selectSelectedClient = (state: RestaurantState): Client | null =>
  state.clients.find((client) => client.id === state.ui.selectedClientId) ?? null;

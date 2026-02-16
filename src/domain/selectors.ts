import { MENU_CATEGORY_PRIORITY } from "@/domain/constants";
import type {
  Client,
  ClientFilter,
  InventoryMainTab,
  KitchenInventoryTab,
  KitchenOrder,
  MenuCategory,
  MenuItem,
  NotificationItem,
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

export const deriveMenuCategoriesFromInventory = (inventory: MenuItem[]): MenuCategory[] => {
  const categories = [...new Set(inventory.filter((item) => item.type === "dish").map((item) => item.category))];

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

export const filterMenuItems = (
  inventory: MenuItem[],
  selectedCategory: MenuCategory,
  searchTerm: string
): MenuItem[] => {
  const term = normalizeText(searchTerm);

  return inventory.filter(
    (item) =>
      item.type === "dish" &&
      item.category === selectedCategory &&
      includesText(item.name, term)
  );
};

export const filterInventoryItems = (
  inventory: MenuItem[],
  inventoryMainTab: InventoryMainTab,
  kitchenInventoryTab: KitchenInventoryTab,
  searchTerm: string
): MenuItem[] => {
  const term = normalizeText(searchTerm);

  return inventory.filter((item) => {
    const inKitchen = inventoryMainTab === "kitchen";
    const isBarCategory = isBarInventoryCategory(item.category);

    if (inKitchen && isBarCategory) {
      return false;
    }

    if (!inKitchen && !isBarCategory) {
      return false;
    }

    if (inKitchen) {
      if (kitchenInventoryTab === "dishes" && item.type !== "dish") {
        return false;
      }

      if (kitchenInventoryTab === "ingredients" && item.type !== "ingredient") {
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

export const filterClients = (
  clients: Client[],
  clientFilter: ClientFilter,
  searchTerm: string
): Client[] => {
  const term = normalizeText(searchTerm);
  const isVipFilter = clientFilter === "vip";

  return clients.filter((client) => {
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

export const deriveLowStockItems = (inventory: MenuItem[], threshold = 10): MenuItem[] =>
  inventory.filter((item) => item.stock < threshold);

export const deriveSelectedKitchenOrder = (
  kitchenOrders: KitchenOrder[],
  selectedOrderId: string | null
): KitchenOrder | null => kitchenOrders.find((order) => order.id === selectedOrderId) || null;

export const deriveUnreadNotificationsCount = (notifications: NotificationItem[]): number =>
  notifications.filter((notification) => !notification.read).length;

export const deriveSelectedClient = (clients: Client[], selectedClientId: number | null): Client | null =>
  clients.find((client) => client.id === selectedClientId) ?? null;

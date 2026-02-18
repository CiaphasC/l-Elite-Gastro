import type {
  ActiveTab,
  Client,
  KitchenOrder,
  MenuCategory,
  MenuItem,
  NotificationItem,
  Reservation,
  SalesRecord,
  ServiceContext,
  SupportedCurrencyCode,
  TableInfo,
  WorkerAccount,
} from "@/types";

export interface RestaurantSeedData {
  activeTab?: ActiveTab;
  currencyCode?: SupportedCurrencyCode;
  selectedCategory?: MenuCategory;
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  reservations: Reservation[];
  clients: Client[];
  workers: WorkerAccount[];
  tables: TableInfo[];
  salesHistory: SalesRecord[];
  serviceContext: ServiceContext;
  startupNotifications?: NotificationItem[];
}

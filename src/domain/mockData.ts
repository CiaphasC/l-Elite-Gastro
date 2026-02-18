import inventoryJson from "@/data/mockdb/inventory.json";
import tablesJson from "@/data/mockdb/tables.json";
import workersJson from "@/data/mockdb/workers.json";
import reservationsJson from "@/data/mockdb/reservations.json";
import clientsJson from "@/data/mockdb/clients.json";
import kitchenOrdersJson from "@/data/mockdb/kitchen-orders.json";
import salesHistoryJson from "@/data/mockdb/sales-history.json";
import startupNotificationsJson from "@/data/mockdb/startup-notifications.json";
import serviceContextJson from "@/data/mockdb/service-context.json";
import type { RestaurantSeedData } from "@/domain/contracts/restaurantSeed";
import type {
  Client,
  KitchenOrder,
  MenuItem,
  NotificationItem,
  Reservation,
  SalesRecord,
  ServiceContext,
  TableInfo,
  WorkerAccount,
} from "@/types";

/**
 * Fuente de datos mock persistente en archivos JSON.
 * Este módulo mantiene los mismos exports históricos para no romper consumo interno,
 * pero internamente ya está desacoplado del hardcode TypeScript.
 *
 * En una siguiente etapa con backend, sólo se reemplaza el repositorio que
 * consume este seed; la UI y el store no necesitan cambios estructurales.
 */
export const INITIAL_INVENTORY: MenuItem[] = inventoryJson as MenuItem[];

export const INITIAL_MENU_ITEMS: MenuItem[] = INITIAL_INVENTORY.filter(
  (item) => item.type === "dish"
);

export const INITIAL_INGREDIENTS: MenuItem[] = INITIAL_INVENTORY.filter(
  (item) => item.type === "ingredient"
);

export const TABLES: TableInfo[] = tablesJson as TableInfo[];
export const INITIAL_WORKERS: WorkerAccount[] = workersJson as WorkerAccount[];
export const INITIAL_RESERVATIONS: Reservation[] = reservationsJson as Reservation[];
export const CLIENTS: Client[] = clientsJson as Client[];
export const INITIAL_KITCHEN_ORDERS: KitchenOrder[] = kitchenOrdersJson as KitchenOrder[];
export const INITIAL_SALES_HISTORY: SalesRecord[] = salesHistoryJson as SalesRecord[];
export const INITIAL_NOTIFICATIONS: NotificationItem[] =
  startupNotificationsJson as NotificationItem[];
export const INITIAL_SERVICE_CONTEXT: ServiceContext =
  serviceContextJson as ServiceContext;

export const RESTAURANT_SEED_DATA: RestaurantSeedData = {
  inventory: INITIAL_INVENTORY,
  tables: TABLES,
  workers: INITIAL_WORKERS,
  reservations: INITIAL_RESERVATIONS,
  clients: CLIENTS,
  kitchenOrders: INITIAL_KITCHEN_ORDERS,
  salesHistory: INITIAL_SALES_HISTORY,
  serviceContext: INITIAL_SERVICE_CONTEXT,
  startupNotifications: INITIAL_NOTIFICATIONS,
};

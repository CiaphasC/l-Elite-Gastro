import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type ActiveTab =
  | "dash"
  | "menu"
  | "tables"
  | "reservations"
  | "kitchen"
  | "clients"
  | "inventory"
  | "settings";

export type MenuCategory =
  | "Entrantes"
  | "Principales"
  | "Vinos"
  | "Cocteleria"
  | "Postres";

export type KitchenStatus = "pending" | "cooking" | "ready";
export type KitchenModalType = "kitchen-detail" | "kitchen-serve" | null;
export type ReservationStatus = "vip" | "confirmado" | "pendiente";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
  img: string;
  stock: number;
  unit: string;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export interface TableInfo {
  id: number;
  status: string;
  guests: number;
}

export interface Reservation {
  id: number;
  name: string;
  time: string;
  guests: number;
  table: number | string;
  type: string;
  status: ReservationStatus | string;
}

export interface ReservationPayload {
  name: string;
  time: string;
  guests: number;
  type?: string;
}

export interface Client {
  id: number;
  name: string;
  tier: string;
  visits: number;
  spend: string;
  lastVisit: string;
  preferences: string;
}

export interface KitchenOrderItem {
  name: string;
  qty: number;
}

export interface KitchenOrder {
  id: string;
  items: KitchenOrderItem[];
  time: string;
  status: KitchenStatus;
  waiter: string;
  notes?: string;
}

export interface UIState {
  isLoading: boolean;
  showCheckout: boolean;
  showReservationModal: boolean;
  kitchenModalType: KitchenModalType;
  selectedOrderId: string | null;
}

export interface RestaurantState {
  activeTab: ActiveTab;
  selectedCategory: MenuCategory;
  searchTerm: string;
  notifications: number;
  cart: CartItem[];
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  reservations: Reservation[];
  clients: Client[];
  tables: TableInfo[];
  ui: UIState;
}

export interface RestaurantDerived {
  filteredMenuItems: MenuItem[];
  filteredInventoryItems: MenuItem[];
  filteredClients: Client[];
  cartItemsCount: number;
  cartSubtotal: number;
  cartServiceFee: number;
  cartTotal: number;
  lowStockItems: MenuItem[];
  selectedKitchenOrder: KitchenOrder | null;
}

export interface RestaurantActions {
  finishBoot: () => void;
  setActiveTab: (tabId: ActiveTab) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedCategory: (category: MenuCategory) => void;
  addToCart: (menuItem: MenuItem) => void;
  updateCartQty: (itemId: number, delta: number) => void;
  clearCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  confirmCheckout: () => void;
  openReservationModal: () => void;
  closeReservationModal: () => void;
  addReservation: (reservationPayload: ReservationPayload) => void;
  adjustStock: (itemId: number, delta: number) => void;
  openKitchenModal: (modalType: Exclude<KitchenModalType, null>, orderId: string) => void;
  closeKitchenModal: () => void;
  completeKitchenOrder: (orderId?: string) => void;
}

export interface RestaurantStore {
  state: RestaurantState;
  actions: RestaurantActions;
  derived: RestaurantDerived;
}

export interface NavConfigItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
}

export interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
}


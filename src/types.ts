import type { ReactNode } from "react";

export const ACTIVE_TABS = [
  "dash",
  "menu",
  "tables",
  "reservations",
  "kitchen",
  "clients",
  "inventory",
  "settings",
] as const;

export type ActiveTab = (typeof ACTIVE_TABS)[number];

export const MENU_CATEGORY_VALUES = [
  "Entrantes",
  "Principales",
  "Vinos",
  "Cocteleria",
  "Postres",
] as const;

export type MenuCategory = (typeof MENU_CATEGORY_VALUES)[number];

export type KitchenStatus = "pending" | "cooking" | "ready";
export type KitchenModalType = "kitchen-detail" | "kitchen-serve" | null;
export type KitchenModalActionType = Exclude<KitchenModalType, null>;

export const TABLE_STATUS_VALUES = ["disponible", "ocupada", "reservada", "limpieza"] as const;
export type TableStatus = (typeof TABLE_STATUS_VALUES)[number];

export const RESERVATION_TYPE_VALUES = ["Cena", "Aniversario", "Negocios", "VIP"] as const;
export type ReservationType = (typeof RESERVATION_TYPE_VALUES)[number];
export type ReservationStatus = "vip" | "confirmado" | "pendiente";

export type ClientTier = "Platinum" | "Gold" | "Silver" | "Bronze";
export const SUPPORTED_CURRENCY_VALUES = ["ARS", "UYU", "COP", "MXN", "PEN", "USD"] as const;
export type SupportedCurrencyCode = (typeof SUPPORTED_CURRENCY_VALUES)[number];

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
  status: TableStatus;
  guests: number;
}

export interface Reservation {
  id: string;
  name: string;
  time: string;
  guests: number;
  table: number | "---";
  type: ReservationType;
  status: ReservationStatus;
}

export interface ReservationPayload {
  name: string;
  time: string;
  guests: number;
  type?: ReservationType;
}

export interface Client {
  id: number;
  name: string;
  tier: ClientTier;
  visits: number;
  spend: number;
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

export interface ServiceContext {
  tableLabel: string;
  serviceTier: "VIP" | "Standard";
}

export interface DashboardSnapshot {
  netSales: number;
  diners: number;
  averageTicket: number;
  serviceTimeMinutes: number;
  weeklyPerformance: number[];
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
  currencyCode: SupportedCurrencyCode;
  selectedCategory: MenuCategory;
  searchTerm: string;
  notifications: number;
  cart: CartItem[];
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  reservations: Reservation[];
  clients: Client[];
  tables: TableInfo[];
  serviceContext: ServiceContext;
  dashboard: DashboardSnapshot;
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
  setCurrencyCode: (currencyCode: SupportedCurrencyCode) => void;
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
  openKitchenModal: (modalType: KitchenModalActionType, orderId: string) => void;
  closeKitchenModal: () => void;
  completeKitchenOrder: (orderId?: string) => void;
}

export interface RestaurantStore {
  state: RestaurantState;
  actions: RestaurantActions;
  derived: RestaurantDerived;
}

export interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
}

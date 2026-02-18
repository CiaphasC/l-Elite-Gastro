import type { ReactNode } from "react";

export const ACTIVE_TABS = [
  "dash",
  "menu",
  "tables",
  "reservations",
  "kitchen",
  "clients",
  "inventory",
  "management",
  "settings",
] as const;

export type ActiveTab = (typeof ACTIVE_TABS)[number];

export const MENU_CATEGORY_VALUES = [
  "Entrantes",
  "Principales",
  "Guarniciones",
  "Vinos",
  "Coctelería",
  "Cervezas",
  "Licores",
  "Refrescos",
  "Carnes",
  "Pescados",
  "Verduras",
  "Frutas",
  "Lácteos",
  "Secos",
  "Aceites",
  "Especias",
  "Postres",
] as const;

export type MenuCategory = (typeof MENU_CATEGORY_VALUES)[number];

export type KitchenStatus = "pending" | "cooking" | "ready";
export type KitchenModalType = "kitchen-detail" | "kitchen-serve" | null;
export type KitchenModalActionType = Exclude<KitchenModalType, null>;
export type InventoryItemType = "dish" | "ingredient";
export type InventoryMainTab = "kitchen" | "bar";
export type KitchenInventoryTab = "dishes" | "ingredients";

export const TABLE_STATUS_VALUES = ["disponible", "ocupada", "reservada", "limpieza"] as const;
export type TableStatus = (typeof TABLE_STATUS_VALUES)[number];

export const RESERVATION_TYPE_VALUES = ["Cena", "Aniversario", "Negocios", "VIP"] as const;
export type ReservationType = (typeof RESERVATION_TYPE_VALUES)[number];
export const RESERVATION_STATUS_VALUES = [
  "vip",
  "confirmado",
  "pendiente",
  "vip pendiente",
  "vip reservado",
  "en curso",
  "completado",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUS_VALUES)[number];
export type ReservationTable = number | "---";

export type ClientTier = "Gold" | "Normal";
export type ClientFilter = "clients" | "vip";
export type ClientViewMode = "cards" | "table";
export const USER_ROLE_VALUES = ["admin", "waiter"] as const;
export type UserRole = (typeof USER_ROLE_VALUES)[number];
export const SUPPORTED_CURRENCY_VALUES = ["ARS", "UYU", "COP", "MXN", "PEN", "USD"] as const;
export type SupportedCurrencyCode = (typeof SUPPORTED_CURRENCY_VALUES)[number];
export type NotificationType = "stock" | "success" | "info" | "vip";
export type ServiceNotificationEvent =
  | "table_available"
  | "table_maintenance"
  | "table_reserved";
export type WorkerAccountStatus = "pending" | "active";
export type TableConfirmationAction = "cleaning" | "reservation" | "finish_service";
export type ClientDocumentType = "DNI" | "CEDULA" | "PASAPORTE" | "CE" | "RUC";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
  img: string;
  stock: number;
  unit: string;
  type: InventoryItemType;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export interface TableSessionSummary {
  name: string;
  time: string;
  guests: number;
  type: string;
}

export interface TableInfo {
  id: number;
  name: string;
  code: string;
  capacity: number;
  status: TableStatus;
  guests: number;
  statusUpdatedAt?: string;
  cleaningStartTime?: string;
  cleaningStaff?: string;
  currentSession?: TableSessionSummary | null;
}

export interface WorkerAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: WorkerAccountStatus;
  startedAt: string;
  createdAt: string;
  validatedAt: string | null;
}

export interface WorkerAccountPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  startedAt: string;
  createdAt: string;
  validatedAt: string | null;
}

export interface Reservation {
  id: string;
  name: string;
  time: string;
  guests: number;
  table: ReservationTable;
  type: ReservationType;
  status: ReservationStatus;
}

export interface ReservationPayload {
  name: string;
  time: string;
  guests: number;
  type?: ReservationType;
  table?: ReservationTable;
}

export interface ClientHistoryItem {
  id: number;
  date: string;
  type: string;
  table: string;
  items: string[];
  total: number;
  status: string;
}

export interface Client {
  id: number;
  name: string;
  tier: ClientTier;
  visits: number;
  spend: number;
  lastVisit: string;
  preferences: string;
  docType: ClientDocumentType;
  docNumber: string;
  phone?: string;
  history: ClientHistoryItem[];
}

export interface ClientPayload {
  name: string;
  tier: ClientTier;
  preferences: string;
  docType: ClientDocumentType;
  docNumber: string;
  phone?: string;
}

export interface InventoryItemPayload {
  name: string;
  category: MenuCategory;
  stock: number;
  unit: string;
  price: number;
  type: InventoryItemType;
  img: string;
}

export interface TableManagementPayload {
  name: string;
  code: string;
  capacity: number;
}

export interface WorkerRegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  startedAt: string;
  role?: UserRole;
}

export interface KitchenOrderItem {
  itemId: number;
  name: string;
  qty: number;
  price: number;
  img: string;
}

export interface KitchenOrder {
  id: string;
  tableId: number;
  sequence: number;
  items: KitchenOrderItem[];
  status: KitchenStatus;
  waiter: string;
  notes?: string;
}

export interface ServiceContext {
  tableId: number;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  meta?: {
    stockItemId?: number;
    stockSeverity?: "low" | "critical";
    navigateTo?: ActiveTab;
    dismissOnRead?: boolean;
    serviceEvent?: ServiceNotificationEvent;
  };
}

export interface OrderTakingContext {
  tableId: number;
  clientName: string;
  reservationId: string | null;
}

export interface OrderTakingConfirmationPayload {
  items: CartItem[];
}

export interface SalesRecord {
  id: string;
  amount: number;
  createdAt: string;
}

export interface DashboardPeriodSales {
  day: number;
  week: number;
  month: number;
}

export interface WeeklyPerformancePoint {
  label: string;
  amount: number;
}

export interface DashboardSnapshot {
  netSales: number;
  diners: number;
  averageTicket: number;
  salesByPeriod: DashboardPeriodSales;
  weeklyPerformance: WeeklyPerformancePoint[];
}

export interface ConfirmationModalState {
  isOpen: boolean;
  tableId: number | null;
  type: TableConfirmationAction | null;
}

export interface ClientModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  targetClientId: number | null;
  targetSegment: ClientFilter;
}

export interface UIState {
  showCheckout: boolean;
  showReservationModal: boolean;
  reservationEditingId: string | null;
  kitchenModalType: KitchenModalType;
  selectedOrderId: string | null;
  showNotificationPanel: boolean;
  showInventoryCreateModal: boolean;
  confirmationModal: ConfirmationModalState;
  reservationPrefill: Partial<ReservationPayload> | null;
  clientModal: ClientModalState;
  selectedClientId: number | null;
}

export interface RestaurantState {
  activeTab: ActiveTab;
  currencyCode: SupportedCurrencyCode;
  selectedCategory: MenuCategory;
  searchTerm: string;
  notifications: NotificationItem[];
  cart: CartItem[];
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  reservations: Reservation[];
  clients: Client[];
  workers: WorkerAccount[];
  tables: TableInfo[];
  salesHistory: SalesRecord[];
  serviceContext: ServiceContext;
  dashboard: DashboardSnapshot;
  inventoryMainTab: InventoryMainTab;
  kitchenInventoryTab: KitchenInventoryTab;
  clientFilter: ClientFilter;
  clientViewMode: ClientViewMode;
  orderTakingContext: OrderTakingContext | null;
  ui: UIState;
}

export interface RestaurantActions {
  hydrateState: (nextState: RestaurantState) => void;
  setActiveTab: (tabId: ActiveTab) => void;
  setCurrencyCode: (currencyCode: SupportedCurrencyCode) => void;
  setServiceTable: (tableId: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedCategory: (category: MenuCategory) => void;
  addToCart: (menuItem: MenuItem) => void;
  updateCartQty: (itemId: number, delta: number) => void;
  clearCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  confirmCheckout: () => void;
  openReservationModal: (
    prefill?: Partial<ReservationPayload>,
    reservationId?: string
  ) => void;
  closeReservationModal: () => void;
  addReservation: (reservationPayload: ReservationPayload) => void;
  assignReservationTable: (reservationId: string, tableId: number) => void;
  adjustStock: (itemId: number, delta: number) => void;
  setInventoryMainTab: (tab: InventoryMainTab) => void;
  setKitchenInventoryTab: (tab: KitchenInventoryTab) => void;
  setClientFilter: (filter: ClientFilter) => void;
  setClientViewMode: (mode: ClientViewMode) => void;
  openClientModal: (segment: ClientFilter, clientId?: number) => void;
  closeClientModal: () => void;
  saveClient: (payload: ClientPayload) => void;
  openClientDetail: (clientId: number) => void;
  closeClientDetail: () => void;
  openInventoryCreateModal: () => void;
  closeInventoryCreateModal: () => void;
  addInventoryItem: (payload: InventoryItemPayload) => void;
  addTable: (payload: TableManagementPayload) => void;
  updateTable: (tableId: number, payload: TableManagementPayload) => void;
  removeTable: (tableId: number) => void;
  reorderTables: (activeTableId: number, overTableId: number) => void;
  createWorkerAccount: (payload: WorkerAccountPayload) => void;
  registerWorkerAccount: (payload: WorkerRegistrationPayload) => void;
  updateWorkerAccount: (workerId: string, payload: WorkerAccountPayload) => void;
  validateWorkerAccount: (workerId: string) => void;
  removeWorkerAccount: (workerId: string) => void;
  toggleNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  openTableConfirmation: (payload: {
    tableId: number;
    type: TableConfirmationAction;
  }) => void;
  closeTableConfirmation: () => void;
  confirmTableAction: () => void;
  startOrderTaking: (payload: {
    tableId: number;
    clientName: string;
    reservationId: string | null;
  }) => void;
  cancelOrderTaking: () => void;
  confirmOrderTaking: (payload: OrderTakingConfirmationPayload) => void;
  openKitchenModal: (modalType: KitchenModalActionType, orderId: string) => void;
  closeKitchenModal: () => void;
  completeKitchenOrder: (orderId?: string) => void;
}

export interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  icon: ReactNode;
}

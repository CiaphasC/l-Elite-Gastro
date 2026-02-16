import { INITIAL_ACTIVE_TAB, MENU_CATEGORIES } from "@/domain/constants";
import { DEFAULT_CURRENCY_CODE } from "@/domain/currency";
import { buildDashboardSnapshot, createSalesRecord } from "@/domain/dashboard";
import {
  CLIENTS,
  INITIAL_INVENTORY,
  INITIAL_KITCHEN_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RESERVATIONS,
  INITIAL_SALES_HISTORY,
  INITIAL_SERVICE_CONTEXT,
  TABLES,
} from "@/domain/mockData";
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
import { formatCurrency } from "@/shared/formatters/currency";
import type {
  ActiveTab,
  CartItem,
  Client,
  ClientFilter,
  ClientPayload,
  ClientViewMode,
  InventoryItemPayload,
  InventoryMainTab,
  KitchenInventoryTab,
  KitchenModalType,
  MenuCategory,
  MenuItem,
  NotificationItem,
  OrderTakingConfirmationPayload,
  ReservationPayload,
  RestaurantState,
  SalesRecord,
  SupportedCurrencyCode,
  TableConfirmationAction,
  TableInfo,
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
  SET_INVENTORY_MAIN_TAB: "SET_INVENTORY_MAIN_TAB",
  SET_KITCHEN_INVENTORY_TAB: "SET_KITCHEN_INVENTORY_TAB",
  OPEN_INVENTORY_CREATE_MODAL: "OPEN_INVENTORY_CREATE_MODAL",
  CLOSE_INVENTORY_CREATE_MODAL: "CLOSE_INVENTORY_CREATE_MODAL",
  ADD_INVENTORY_ITEM: "ADD_INVENTORY_ITEM",
  SET_CLIENT_FILTER: "SET_CLIENT_FILTER",
  SET_CLIENT_VIEW_MODE: "SET_CLIENT_VIEW_MODE",
  OPEN_CLIENT_MODAL: "OPEN_CLIENT_MODAL",
  CLOSE_CLIENT_MODAL: "CLOSE_CLIENT_MODAL",
  SAVE_CLIENT: "SAVE_CLIENT",
  OPEN_CLIENT_DETAIL: "OPEN_CLIENT_DETAIL",
  CLOSE_CLIENT_DETAIL: "CLOSE_CLIENT_DETAIL",
  TOGGLE_NOTIFICATION_PANEL: "TOGGLE_NOTIFICATION_PANEL",
  CLOSE_NOTIFICATION_PANEL: "CLOSE_NOTIFICATION_PANEL",
  MARK_NOTIFICATION_AS_READ: "MARK_NOTIFICATION_AS_READ",
  CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",
  OPEN_TABLE_CONFIRMATION: "OPEN_TABLE_CONFIRMATION",
  CLOSE_TABLE_CONFIRMATION: "CLOSE_TABLE_CONFIRMATION",
  CONFIRM_TABLE_ACTION: "CONFIRM_TABLE_ACTION",
  START_ORDER_TAKING: "START_ORDER_TAKING",
  CANCEL_ORDER_TAKING: "CANCEL_ORDER_TAKING",
  CONFIRM_ORDER_TAKING: "CONFIRM_ORDER_TAKING",
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
  | { type: typeof ACTIONS.UPDATE_CART_QTY; payload: { itemId: number; delta: number } }
  | { type: typeof ACTIONS.CLEAR_CART }
  | { type: typeof ACTIONS.SET_CHECKOUT_OPEN; payload: boolean }
  | { type: typeof ACTIONS.CONFIRM_CHECKOUT }
  | {
      type: typeof ACTIONS.SET_RESERVATION_MODAL_OPEN;
      payload: {
        isOpen: boolean;
        prefill?: Partial<ReservationPayload> | null;
        reservationId?: string | null;
      };
    }
  | { type: typeof ACTIONS.ADD_RESERVATION; payload: ReservationPayload }
  | {
      type: typeof ACTIONS.ASSIGN_RESERVATION_TABLE;
      payload: { reservationId: string; tableId: number };
    }
  | { type: typeof ACTIONS.ADJUST_STOCK; payload: { itemId: number; delta: number } }
  | { type: typeof ACTIONS.SET_INVENTORY_MAIN_TAB; payload: InventoryMainTab }
  | { type: typeof ACTIONS.SET_KITCHEN_INVENTORY_TAB; payload: KitchenInventoryTab }
  | { type: typeof ACTIONS.OPEN_INVENTORY_CREATE_MODAL }
  | { type: typeof ACTIONS.CLOSE_INVENTORY_CREATE_MODAL }
  | { type: typeof ACTIONS.ADD_INVENTORY_ITEM; payload: InventoryItemPayload }
  | { type: typeof ACTIONS.SET_CLIENT_FILTER; payload: ClientFilter }
  | { type: typeof ACTIONS.SET_CLIENT_VIEW_MODE; payload: ClientViewMode }
  | {
      type: typeof ACTIONS.OPEN_CLIENT_MODAL;
      payload: { segment: ClientFilter; clientId?: number };
    }
  | { type: typeof ACTIONS.CLOSE_CLIENT_MODAL }
  | { type: typeof ACTIONS.SAVE_CLIENT; payload: ClientPayload }
  | { type: typeof ACTIONS.OPEN_CLIENT_DETAIL; payload: number }
  | { type: typeof ACTIONS.CLOSE_CLIENT_DETAIL }
  | { type: typeof ACTIONS.TOGGLE_NOTIFICATION_PANEL }
  | { type: typeof ACTIONS.CLOSE_NOTIFICATION_PANEL }
  | { type: typeof ACTIONS.MARK_NOTIFICATION_AS_READ; payload: string }
  | { type: typeof ACTIONS.CLEAR_NOTIFICATIONS }
  | {
      type: typeof ACTIONS.OPEN_TABLE_CONFIRMATION;
      payload: { tableId: number; type: TableConfirmationAction };
    }
  | { type: typeof ACTIONS.CLOSE_TABLE_CONFIRMATION }
  | { type: typeof ACTIONS.CONFIRM_TABLE_ACTION }
  | {
      type: typeof ACTIONS.START_ORDER_TAKING;
      payload: { tableId: number; clientName: string; reservationId: string | null };
    }
  | { type: typeof ACTIONS.CANCEL_ORDER_TAKING }
  | { type: typeof ACTIONS.CONFIRM_ORDER_TAKING; payload: OrderTakingConfirmationPayload }
  | {
      type: typeof ACTIONS.OPEN_KITCHEN_MODAL;
      payload: { modalType: Exclude<KitchenModalType, null>; orderId: string };
    }
  | { type: typeof ACTIONS.CLOSE_KITCHEN_MODAL }
  | { type: typeof ACTIONS.COMPLETE_KITCHEN_ORDER; payload?: string };

const stockAlertThreshold = 5;

const createNotificationId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `notif-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

const withPrependedNotifications = (
  current: NotificationItem[],
  incoming: NotificationItem[]
): NotificationItem[] => [...incoming, ...current].slice(0, 80);

const createNotification = (
  type: NotificationItem["type"],
  title: string,
  message: string,
  read = false,
  time = "Ahora",
  meta?: NotificationItem["meta"]
): NotificationItem => ({
  id: createNotificationId(),
  type,
  title,
  message,
  time,
  read,
  meta,
});

const resolveStockSeverity = (stock: number): "low" | "critical" | null => {
  if (stock <= 0) {
    return "critical";
  }

  if (stock < stockAlertThreshold) {
    return "low";
  }

  return null;
};

const createStockNotificationForItem = (
  item: MenuItem,
  severity = resolveStockSeverity(item.stock)
): NotificationItem | null => {
  if (!severity) {
    return null;
  }

  if (severity === "critical") {
    return createNotification(
      "stock",
      "Stock Critico",
      `${item.name} esta agotado en inventario.`,
      false,
      "Ahora",
      {
        stockItemId: item.id,
        stockSeverity: "critical",
        navigateTo: "inventory",
      }
    );
  }

  return createNotification(
    "stock",
    "Alerta de Stock",
    `Quedan pocas unidades de ${item.name} (${item.stock} ${item.unit}).`,
    false,
    "Ahora",
    {
      stockItemId: item.id,
      stockSeverity: "low",
      navigateTo: "inventory",
    }
  );
};

const createStockTransitionNotifications = (
  previousInventory: MenuItem[],
  nextInventory: MenuItem[]
): NotificationItem[] => {
  const notifications: NotificationItem[] = [];

  for (const previousItem of previousInventory) {
    const nextItem = nextInventory.find((item) => item.id === previousItem.id);
    if (!nextItem) {
      continue;
    }

    const previousSeverity = resolveStockSeverity(previousItem.stock);
    const nextSeverity = resolveStockSeverity(nextItem.stock);

    if (nextSeverity && previousSeverity !== nextSeverity) {
      const notification = createStockNotificationForItem(nextItem, nextSeverity);
      if (notification) {
        notifications.push(notification);
      }
    }
  }

  return notifications;
};

const createStartupNotifications = (inventory: MenuItem[]): NotificationItem[] => [
  ...inventory
    .map((item) => createStockNotificationForItem(item))
    .filter((item): item is NotificationItem => item !== null),
  ...INITIAL_NOTIFICATIONS,
];

const pruneResolvedStockNotifications = (
  notifications: NotificationItem[],
  inventory: MenuItem[]
): NotificationItem[] =>
  notifications.filter((notification) => {
    if (notification.type !== "stock") {
      return true;
    }

    const stockItemId = notification.meta?.stockItemId;
    if (typeof stockItemId !== "number") {
      return true;
    }

    const currentItem = inventory.find((item) => item.id === stockItemId);
    if (!currentItem) {
      return false;
    }

    const currentSeverity = resolveStockSeverity(currentItem.stock);
    if (!currentSeverity) {
      return false;
    }

    const notificationSeverity = notification.meta?.stockSeverity;
    if (!notificationSeverity) {
      return true;
    }

    return notificationSeverity === currentSeverity;
  });

const withInventoryAwareNotifications = (
  currentNotifications: NotificationItem[],
  incomingNotifications: NotificationItem[],
  inventory: MenuItem[]
): NotificationItem[] =>
  pruneResolvedStockNotifications(
    withPrependedNotifications(currentNotifications, incomingNotifications),
    inventory
  );

const toCartQtyMap = (items: CartItem[]): Map<number, number> =>
  new Map(items.map((item) => [item.id, item.qty]));

const hasCartChanged = (previousItems: CartItem[], nextItems: CartItem[]): boolean => {
  if (previousItems.length !== nextItems.length) {
    return true;
  }

  const previousQtyById = toCartQtyMap(previousItems);
  const nextQtyById = toCartQtyMap(nextItems);

  if (previousQtyById.size !== nextQtyById.size) {
    return true;
  }

  for (const [itemId, previousQty] of previousQtyById) {
    if (nextQtyById.get(itemId) !== previousQty) {
      return true;
    }
  }

  return false;
};

const calculateCartTotal = (items: CartItem[]): number => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  return subtotal + subtotal * 0.1;
};

const createKitchenOrderId = (orders: { id: string }[]): string => {
  const numericIds = orders
    .map((order) => {
      const [, numericPart] = order.id.split("-");
      const parsed = Number.parseInt(numericPart ?? "", 10);
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((id): id is number => id !== null);

  const nextNumericId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 200;
  return `T-${nextNumericId}`;
};

const closeKitchenModal = (uiState: UIState): UIState => ({
  ...uiState,
  kitchenModalType: null,
  selectedOrderId: null,
});

const closeTableConfirmation = (uiState: UIState): UIState => ({
  ...uiState,
  confirmationModal: {
    isOpen: false,
    tableId: null,
    type: null,
  },
});

const resolveClientMatch = (clients: Client[], name: string): Client | undefined => {
  const normalizedName = name.trim().toLowerCase();
  return clients.find((client) => client.name.trim().toLowerCase() === normalizedName);
};

const resolveDashboardSnapshot = (clients: Client[], salesHistory: SalesRecord[]) =>
  buildDashboardSnapshot(clients, salesHistory);

export const createInitialState = (): RestaurantState => {
  const initialInventory = INITIAL_INVENTORY;
  const initialSalesHistory = INITIAL_SALES_HISTORY;
  const initialDashboardSnapshot = resolveDashboardSnapshot(CLIENTS, initialSalesHistory);

  return {
    activeTab: INITIAL_ACTIVE_TAB,
    currencyCode: DEFAULT_CURRENCY_CODE,
    selectedCategory: MENU_CATEGORIES[0],
    searchTerm: "",
    notifications: createStartupNotifications(initialInventory),
    cart: [],
    inventory: initialInventory,
    kitchenOrders: INITIAL_KITCHEN_ORDERS,
    reservations: INITIAL_RESERVATIONS,
    clients: CLIENTS,
    tables: TABLES,
    salesHistory: initialSalesHistory,
    serviceContext: INITIAL_SERVICE_CONTEXT,
    dashboard: initialDashboardSnapshot,
    inventoryMainTab: "kitchen",
    kitchenInventoryTab: "dishes",
    clientFilter: "clients",
    clientViewMode: "cards",
    orderTakingContext: null,
    ui: {
      isLoading: true,
      showCheckout: false,
      showReservationModal: false,
      reservationEditingId: null,
      kitchenModalType: null,
      selectedOrderId: null,
      showNotificationPanel: false,
      showInventoryCreateModal: false,
      confirmationModal: {
        isOpen: false,
        tableId: null,
        type: null,
      },
      reservationPrefill: null,
      clientModal: {
        isOpen: false,
        mode: "create",
        targetClientId: null,
        targetSegment: "clients",
      },
      selectedClientId: null,
    },
  };
};

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
      const nextCart = addItemToCart(state.cart, action.payload, state.inventory);
      if (nextCart === state.cart) {
        return {
          ...state,
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Stock Insuficiente",
              `No hay stock disponible para ${action.payload.name}.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
        };
      }

      return {
        ...state,
        cart: nextCart,
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

      const effectiveCart = reconcileCartWithInventory(state.cart, state.inventory);
      if (effectiveCart.length === 0) {
        return {
          ...state,
          cart: [],
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Stock Insuficiente",
              "La comanda no pudo confirmarse porque no hay stock disponible.",
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
          ui: { ...state.ui, showCheckout: false },
        };
      }

      const checkoutTotal = calculateCartTotal(effectiveCart);
      const cartWasAdjusted = hasCartChanged(state.cart, effectiveCart);
      const nextInventory = applyCheckoutToInventory(state.inventory, effectiveCart);
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);
      const nextSalesHistory = [createSalesRecord(checkoutTotal), ...state.salesHistory];
      const newKitchenOrderId = createKitchenOrderId(state.kitchenOrders);
      const nextKitchenOrder = {
        id: newKitchenOrderId,
        items: effectiveCart.map((item) => ({ name: item.name, qty: item.qty })),
        time: "0 min",
        status: "pending" as const,
        waiter: "Jean-Luc P.",
        notes: "Prioridad alta",
      };
      const nextDashboard = resolveDashboardSnapshot(state.clients, nextSalesHistory);

      return {
        ...state,
        inventory: nextInventory,
        kitchenOrders: [nextKitchenOrder, ...state.kitchenOrders],
        salesHistory: nextSalesHistory,
        cart: [],
        dashboard: nextDashboard,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Orden Confirmada",
              `Comanda #${newKitchenOrderId} enviada a cocina. Total ${formatCurrency(checkoutTotal, state.currencyCode)}.`,
              false,
              "Ahora",
              { navigateTo: "kitchen" }
            ),
            ...(cartWasAdjusted
              ? [
                  createNotification(
                    "stock",
                    "Comanda Ajustada",
                    "Algunos items se ajustaron automaticamente por stock disponible.",
                    false,
                    "Ahora",
                    { navigateTo: "inventory" }
                  ),
                ]
              : []),
            ...stockNotifications,
          ],
          nextInventory
        ),
        ui: { ...state.ui, showCheckout: false },
      };
    }

    case ACTIONS.SET_RESERVATION_MODAL_OPEN:
      return {
        ...state,
        ui: {
          ...state.ui,
          showReservationModal: action.payload.isOpen,
          reservationPrefill: action.payload.isOpen ? action.payload.prefill ?? null : null,
          reservationEditingId: action.payload.isOpen
            ? action.payload.reservationId ?? null
            : null,
        },
      };

    case ACTIONS.ADD_RESERVATION: {
      const isVipReservation =
        action.payload.type === "VIP" ||
        Boolean(resolveClientMatch(state.clients, action.payload.name)?.tier === "Gold");
      const editingReservationId = state.ui.reservationEditingId;

      if (editingReservationId) {
        const targetReservation = state.reservations.find(
          (reservation) => reservation.id === editingReservationId
        );

        if (!targetReservation) {
          return {
            ...state,
            ui: {
              ...state.ui,
              showReservationModal: false,
              reservationPrefill: null,
              reservationEditingId: null,
            },
          };
        }

        const requestedTable =
          typeof action.payload.table === "number" || action.payload.table === "---"
            ? action.payload.table
            : targetReservation.table;
        const oldTable = targetReservation.table;
        const requestedTableInfo =
          typeof requestedTable === "number"
            ? state.tables.find((table) => table.id === requestedTable)
            : undefined;
        const canUseRequestedTable =
          requestedTable === "---" ||
          requestedTable === oldTable ||
          requestedTableInfo?.status === "disponible";
        const finalTable =
          canUseRequestedTable && requestedTable !== undefined
            ? requestedTable
            : targetReservation.table;
        const keepsLiveStatus =
          targetReservation.status === "en curso" || targetReservation.status === "completado";
        const nextStatus = keepsLiveStatus
          ? targetReservation.status
          : isVipReservation
            ? typeof finalTable === "number"
              ? "vip reservado"
              : "vip pendiente"
            : typeof finalTable === "number"
              ? "confirmado"
              : "pendiente";

        const nextReservations = state.reservations.map((reservation) =>
          reservation.id === editingReservationId
            ? {
                ...reservation,
                name: action.payload.name,
                time: action.payload.time,
                guests: action.payload.guests,
                type: action.payload.type ?? reservation.type,
                table: finalTable,
                status: nextStatus,
              }
            : reservation
        );

        const nextTables: TableInfo[] = state.tables.map((table): TableInfo => {
          if (
            typeof oldTable === "number" &&
            oldTable !== finalTable &&
            table.id === oldTable &&
            table.status === "reservada"
          ) {
            return { ...table, status: "disponible", guests: 0 };
          }

          if (typeof finalTable === "number" && table.id === finalTable) {
            return {
              ...table,
              status: nextStatus === "en curso" ? "ocupada" : "reservada",
              guests: action.payload.guests,
            };
          }

          return table;
        });

        return {
          ...state,
          reservations: nextReservations,
          tables: nextTables,
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Reserva Actualizada",
              `La reserva de ${action.payload.name} fue actualizada.`,
              false,
              "Ahora",
              { navigateTo: "reservations" }
            ),
            ...(!canUseRequestedTable && requestedTable !== targetReservation.table
              ? [
                  createNotification(
                    "stock",
                    "Mesa No Disponible",
                    `Se mantuvo la mesa actual porque la mesa ${String(requestedTable)} no estaba disponible.`,
                    false,
                    "Ahora",
                    { navigateTo: "reservations" }
                  ),
                ]
              : []),
          ]),
          ui: {
            ...state.ui,
            showReservationModal: false,
            reservationPrefill: null,
            reservationEditingId: null,
          },
        };
      }

      const reservationMutationResult = appendReservationWithTableAssignment(
        state.reservations,
        state.tables,
        action.payload
      );
      const nextReservations = [...reservationMutationResult.reservations];
      const createdReservation = nextReservations[nextReservations.length - 1];

      if (createdReservation) {
        const hasTable = typeof createdReservation.table === "number";
        nextReservations[nextReservations.length - 1] = {
          ...createdReservation,
          status: isVipReservation
            ? hasTable
              ? "vip reservado"
              : "vip pendiente"
            : hasTable
              ? "confirmado"
              : "pendiente",
        };
      }

      return {
        ...state,
        reservations: nextReservations,
        tables: reservationMutationResult.tables,
        notifications: withPrependedNotifications(state.notifications, [
          isVipReservation
            ? createNotification(
                "vip",
                "Nueva Reserva VIP",
                `Reserva prioritaria para ${action.payload.name} registrada.`,
                false,
                "Ahora",
                { navigateTo: "reservations" }
              )
            : createNotification(
                "info",
                "Nueva Reserva",
                `Reserva para ${action.payload.name} a las ${action.payload.time}.`,
                false,
                "Ahora",
                { navigateTo: "reservations" }
              ),
        ]),
        ui: {
          ...state.ui,
          showReservationModal: false,
          reservationPrefill: null,
          reservationEditingId: null,
        },
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
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);

      return {
        ...state,
        inventory: nextInventory,
        cart: reconcileCartWithInventory(state.cart, nextInventory),
        notifications: withInventoryAwareNotifications(
          state.notifications,
          stockNotifications,
          nextInventory
        ),
      };
    }

    case ACTIONS.SET_INVENTORY_MAIN_TAB:
      return {
        ...state,
        inventoryMainTab: action.payload,
      };

    case ACTIONS.SET_KITCHEN_INVENTORY_TAB:
      return {
        ...state,
        kitchenInventoryTab: action.payload,
      };

    case ACTIONS.OPEN_INVENTORY_CREATE_MODAL:
      return {
        ...state,
        ui: { ...state.ui, showInventoryCreateModal: true },
      };

    case ACTIONS.CLOSE_INVENTORY_CREATE_MODAL:
      return {
        ...state,
        ui: { ...state.ui, showInventoryCreateModal: false },
      };

    case ACTIONS.ADD_INVENTORY_ITEM: {
      const nextInventoryId =
        state.inventory.length === 0 ? 1 : Math.max(...state.inventory.map((item) => item.id)) + 1;
      const nextItem: MenuItem = {
        id: nextInventoryId,
        ...action.payload,
      };
      const nextInventory = [...state.inventory, nextItem];
      const stockNotification = createStockNotificationForItem(nextItem);

      return {
        ...state,
        inventory: nextInventory,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Inventario Actualizado",
              `${nextItem.name} fue registrado.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
            ...(stockNotification ? [stockNotification] : []),
          ],
          nextInventory
        ),
        ui: { ...state.ui, showInventoryCreateModal: false },
      };
    }

    case ACTIONS.SET_CLIENT_FILTER:
      return {
        ...state,
        clientFilter: action.payload,
      };

    case ACTIONS.SET_CLIENT_VIEW_MODE:
      return {
        ...state,
        clientViewMode: action.payload,
      };

    case ACTIONS.OPEN_CLIENT_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          clientModal: {
            isOpen: true,
            mode: typeof action.payload.clientId === "number" ? "edit" : "create",
            targetClientId: action.payload.clientId ?? null,
            targetSegment: action.payload.segment,
          },
        },
      };

    case ACTIONS.CLOSE_CLIENT_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          clientModal: {
            ...state.ui.clientModal,
            isOpen: false,
            targetClientId: null,
          },
        },
      };

    case ACTIONS.SAVE_CLIENT: {
      const editingClientId = state.ui.clientModal.targetClientId;

      if (typeof editingClientId === "number") {
        const nextClients = state.clients.map((client) =>
          client.id === editingClientId
            ? {
                ...client,
                ...action.payload,
              }
            : client
        );
        return {
          ...state,
          clients: nextClients,
          dashboard: resolveDashboardSnapshot(nextClients, state.salesHistory),
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Cliente Actualizado",
              `${action.payload.name} fue actualizado.`,
              false,
              "Ahora",
              { navigateTo: "clients" }
            ),
          ]),
          ui: {
            ...state.ui,
            clientModal: {
              ...state.ui.clientModal,
              isOpen: false,
              targetClientId: null,
            },
          },
        };
      }

      const nextClientId =
        state.clients.length === 0 ? 1 : Math.max(...state.clients.map((client) => client.id)) + 1;
      const nextClient: Client = {
        id: nextClientId,
        ...action.payload,
        visits: 1,
        spend: 0,
        lastVisit: "Hoy",
        history: [],
      };
      const nextClients = [...state.clients, nextClient];

      return {
        ...state,
        clients: nextClients,
        dashboard: resolveDashboardSnapshot(nextClients, state.salesHistory),
        notifications: withPrependedNotifications(state.notifications, [
          nextClient.tier === "Gold"
            ? createNotification(
                "vip",
                "Nuevo Cliente VIP",
                `${nextClient.name} fue agregado como miembro Gold.`,
                false,
                "Ahora",
                { navigateTo: "clients" }
              )
            : createNotification(
                "info",
                "Nuevo Cliente",
                `${nextClient.name} fue agregado.`,
                false,
                "Ahora",
                { navigateTo: "clients" }
              ),
        ]),
        ui: {
          ...state.ui,
          clientModal: {
            ...state.ui.clientModal,
            isOpen: false,
            targetClientId: null,
          },
        },
      };
    }

    case ACTIONS.OPEN_CLIENT_DETAIL:
      return {
        ...state,
        ui: { ...state.ui, selectedClientId: action.payload },
      };

    case ACTIONS.CLOSE_CLIENT_DETAIL:
      return {
        ...state,
        ui: { ...state.ui, selectedClientId: null },
      };

    case ACTIONS.TOGGLE_NOTIFICATION_PANEL:
      return {
        ...state,
        ui: {
          ...state.ui,
          showNotificationPanel: !state.ui.showNotificationPanel,
        },
      };

    case ACTIONS.CLOSE_NOTIFICATION_PANEL:
      return {
        ...state,
        ui: {
          ...state.ui,
          showNotificationPanel: false,
        },
      };

    case ACTIONS.MARK_NOTIFICATION_AS_READ: {
      const notification = state.notifications.find((item) => item.id === action.payload);
      const nextActiveTab = notification?.meta?.navigateTo
        ? notification.meta.navigateTo
        : notification?.type === "stock"
          ? "inventory"
          : notification?.type === "vip"
            ? "reservations"
            : notification?.type === "success" || notification?.type === "info"
              ? "kitchen"
              : state.activeTab;
      const nextNotifications =
        notification?.meta?.dismissOnRead === true
          ? state.notifications.filter((item) => item.id !== action.payload)
          : state.notifications.map((item) =>
              item.id === action.payload ? { ...item, read: true } : item
            );

      return {
        ...state,
        notifications: nextNotifications,
        activeTab: nextActiveTab,
        ui: { ...state.ui, showNotificationPanel: false },
      };
    }

    case ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };

    case ACTIONS.OPEN_TABLE_CONFIRMATION:
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmationModal: {
            isOpen: true,
            tableId: action.payload.tableId,
            type: action.payload.type,
          },
        },
      };

    case ACTIONS.CLOSE_TABLE_CONFIRMATION:
      return {
        ...state,
        ui: closeTableConfirmation(state.ui),
      };

    case ACTIONS.CONFIRM_TABLE_ACTION: {
      const { tableId, type } = state.ui.confirmationModal;

      if (!tableId || !type) {
        return {
          ...state,
          ui: closeTableConfirmation(state.ui),
        };
      }

      if (type === "reservation") {
        const reservation = state.reservations.find(
          (reservationItem) =>
            reservationItem.table === tableId &&
            (reservationItem.status === "confirmado" ||
              reservationItem.status === "vip" ||
              reservationItem.status === "pendiente" ||
              reservationItem.status === "vip pendiente" ||
              reservationItem.status === "vip reservado")
        );

        return {
          ...state,
          orderTakingContext: {
            tableId,
            clientName: reservation?.name ?? "Comensal",
            reservationId: reservation?.id ?? null,
          },
          ui: closeTableConfirmation(state.ui),
        };
      }

      if (type === "cleaning") {
        return {
          ...state,
          tables: state.tables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                  status: "disponible",
                  guests: 0,
                  cleaningStartTime: undefined,
                  currentSession: null,
                }
              : table
          ),
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Mesa Disponible",
              `Mesa ${tableId} habilitada para servicio.`,
              false,
              "Ahora",
              { navigateTo: "tables" }
            ),
          ]),
          ui: closeTableConfirmation(state.ui),
        };
      }

      const now = new Date();
      const cleaningStartTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      return {
        ...state,
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: "limpieza",
                guests: 0,
                cleaningStartTime,
              }
            : table
        ),
        reservations: state.reservations.map((reservation) =>
          reservation.table === tableId && reservation.status === "en curso"
            ? { ...reservation, status: "completado" }
            : reservation
        ),
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "info",
            "Mesa en Limpieza",
            `Mesa ${tableId} paso a mantenimiento luego del servicio.`,
            false,
            "Ahora",
            { navigateTo: "tables" }
          ),
        ]),
        ui: closeTableConfirmation(state.ui),
      };
    }

    case ACTIONS.START_ORDER_TAKING:
      return {
        ...state,
        orderTakingContext: {
          tableId: action.payload.tableId,
          clientName: action.payload.clientName,
          reservationId: action.payload.reservationId,
        },
      };

    case ACTIONS.CANCEL_ORDER_TAKING:
      return {
        ...state,
        orderTakingContext: null,
      };

    case ACTIONS.CONFIRM_ORDER_TAKING: {
      if (!state.orderTakingContext || action.payload.items.length === 0) {
        return {
          ...state,
          orderTakingContext: null,
        };
      }

      const { tableId, clientName, reservationId } = state.orderTakingContext;
      const effectiveItems = reconcileCartWithInventory(action.payload.items, state.inventory);
      if (effectiveItems.length === 0) {
        return {
          ...state,
          orderTakingContext: null,
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Sin Stock Para Servicio",
              `No se pudo iniciar servicio en mesa ${tableId} por falta de stock.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
        };
      }

      const itemsWereAdjusted = hasCartChanged(action.payload.items, effectiveItems);
      const effectiveTotal = calculateCartTotal(effectiveItems);
      const nextInventory = applyCheckoutToInventory(state.inventory, effectiveItems);
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);
      const nextSalesHistory = [createSalesRecord(effectiveTotal), ...state.salesHistory];
      const kitchenOrderId = `T-${tableId}`;
      const nextKitchenOrders = (() => {
        const existingOrderIndex = state.kitchenOrders.findIndex((order) => order.id === kitchenOrderId);
        const nextOrder = {
          id: kitchenOrderId,
          items: effectiveItems.map((item) => ({ name: item.name, qty: item.qty })),
          time: "0 min",
          status: "pending" as const,
          waiter: "Jean-Luc P.",
          notes: existingOrderIndex >= 0 ? "Orden actualizada" : "Inicio servicio",
        };

        if (existingOrderIndex < 0) {
          return [nextOrder, ...state.kitchenOrders];
        }

        return state.kitchenOrders.map((order, index) =>
          index === existingOrderIndex ? nextOrder : order
        );
      })();

      const now = new Date();
      const dateString = `${now.getDate()} ${[
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ][now.getMonth()]} ${now.getFullYear()}`;

      const reservationInContext = state.reservations.find((reservation) => reservation.id === reservationId);
      const guestsInContext = reservationInContext?.guests ?? 2;

      const nextClients = state.clients.map((client) => {
        if (client.name.trim().toLowerCase() !== clientName.trim().toLowerCase()) {
          return client;
        }

        return {
          ...client,
          visits: client.visits + 1,
          spend: client.spend + effectiveTotal,
          lastVisit: "Hoy",
          history: [
            {
              id: Date.now(),
              date: dateString,
              type: "Cena",
              table: String(tableId),
              items: effectiveItems.map((item) => item.name),
              total: effectiveTotal,
              status: "En Curso",
            },
            ...client.history,
          ],
        };
      });
      const nextDashboard = resolveDashboardSnapshot(nextClients, nextSalesHistory);

      return {
        ...state,
        inventory: nextInventory,
        kitchenOrders: nextKitchenOrders,
        salesHistory: nextSalesHistory,
        reservations: state.reservations.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, status: "en curso" } : reservation
        ),
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: "ocupada",
                guests: guestsInContext,
                currentSession: {
                  name: clientName,
                  time: "Ahora",
                  guests: guestsInContext,
                  type: reservationInContext?.type ?? "Cena",
                },
              }
            : table
        ),
        clients: nextClients,
        dashboard: nextDashboard,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Servicio Iniciado",
              `Mesa ${tableId} ocupada. Comanda enviada a cocina.`,
              false,
              "Ahora",
              { navigateTo: "tables", dismissOnRead: true }
            ),
            ...(itemsWereAdjusted
              ? [
                  createNotification(
                    "stock",
                    "Comanda Ajustada",
                    "Se ajustaron cantidades por disponibilidad real de stock.",
                    false,
                    "Ahora",
                    { navigateTo: "inventory" }
                  ),
                ]
              : []),
            ...stockNotifications,
          ],
          nextInventory
        ),
        orderTakingContext: null,
        activeTab: "tables",
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
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Servicio Completado",
            `Orden ${orderIdToComplete} servida.`,
            false,
            "Ahora",
            { navigateTo: "kitchen" }
          ),
        ]),
        ui: closeKitchenModal(state.ui),
      };
    }

    default:
      return state;
  }
};

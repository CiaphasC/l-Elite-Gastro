import type {
  CartItem,
  KitchenOrder,
  MenuItem,
  Reservation,
  ReservationTable,
  ReservationPayload,
  TableInfo,
} from "@/types";

const clampAtZero = (value: number): number => Math.max(0, value);
const clampInRange = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getInventoryStock = (inventory: MenuItem[], itemId: number): number =>
  inventory.find((item) => item.id === itemId)?.stock ?? 0;

const normalizeReservationTable = (
  table: ReservationPayload["table"] | number
): ReservationTable => {
  if (table === "---") {
    return table;
  }

  if (typeof table !== "number" || !Number.isFinite(table)) {
    return "---";
  }

  return Math.max(1, Math.trunc(table));
};

const isTableReserved = (table: TableInfo): boolean => table.status === "reservada";
const isTableAvailable = (table: TableInfo): boolean => table.status === "disponible";

const resolveStatusOnTableAssignment = (
  status: Reservation["status"]
): Reservation["status"] => (status === "vip" ? "vip" : "confirmado");

const createReservationId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `rsv-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

export const addItemToCart = (
  cart: CartItem[],
  item: MenuItem,
  inventory: MenuItem[]
): CartItem[] => {
  const itemStock = getInventoryStock(inventory, item.id);
  if (itemStock <= 0) {
    return cart;
  }

  const existingItem = cart.find((line) => line.id === item.id);
  if (existingItem) {
    if (existingItem.qty >= itemStock) {
      return cart;
    }

    return cart.map((line) =>
      line.id === item.id ? { ...line, qty: line.qty + 1 } : line
    );
  }

  return [...cart, { ...item, qty: 1 }];
};

export const updateCartItemQty = (
  cart: CartItem[],
  inventory: MenuItem[],
  itemId: number,
  delta: number
): CartItem[] =>
  cart
    .map((line) => {
      if (line.id !== itemId) {
        return line;
      }

      const stock = getInventoryStock(inventory, itemId);
      const nextQty = clampInRange(line.qty + delta, 0, stock);
      return { ...line, qty: nextQty };
    })
    .filter((line) => line.qty > 0);

export const updateInventoryStock = (
  inventory: MenuItem[],
  itemId: number,
  delta: number
): MenuItem[] =>
  inventory.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return { ...item, stock: clampAtZero(item.stock + delta) };
  });

export const reconcileCartWithInventory = (
  cart: CartItem[],
  inventory: MenuItem[]
): CartItem[] =>
  cart
    .map((line) => {
      const stock = getInventoryStock(inventory, line.id);
      return { ...line, qty: clampInRange(line.qty, 0, stock) };
    })
    .filter((line) => line.qty > 0);

export const applyCheckoutToInventory = (
  inventory: MenuItem[],
  cart: CartItem[]
): MenuItem[] => {
  const qtyByItemId = new Map<number, number>();
  for (const cartItem of cart) {
    qtyByItemId.set(cartItem.id, (qtyByItemId.get(cartItem.id) ?? 0) + cartItem.qty);
  }

  return inventory.map((inventoryItem) => {
    const reservedQty = qtyByItemId.get(inventoryItem.id) ?? 0;
    if (reservedQty === 0) {
      return inventoryItem;
    }

    return {
      ...inventoryItem,
      stock: clampAtZero(inventoryItem.stock - reservedQty),
    };
  });
};

export const appendReservation = (
  reservations: Reservation[],
  reservationPayload: ReservationPayload
): Reservation[] => {
  const normalizedGuests = Number.isFinite(reservationPayload.guests)
    ? Math.max(1, Math.trunc(reservationPayload.guests))
    : 1;
  const normalizedTable = normalizeReservationTable(reservationPayload.table);

  const reservation: Reservation = {
    id: createReservationId(),
    name: reservationPayload.name.trim(),
    time: reservationPayload.time,
    guests: normalizedGuests,
    table: normalizedTable,
    type: reservationPayload.type || "Cena",
    status: "pendiente",
  };

  return [...reservations, reservation];
};

export interface ReservationTableMutationResult {
  reservations: Reservation[];
  tables: TableInfo[];
}

export const appendReservationWithTableAssignment = (
  reservations: Reservation[],
  tables: TableInfo[],
  reservationPayload: ReservationPayload
): ReservationTableMutationResult => {
  const requestedTableId = normalizeReservationTable(reservationPayload.table);

  const requestedTable =
    typeof requestedTableId === "number"
      ? tables.find((table) => table.id === requestedTableId)
      : undefined;

  const canReserveRequestedTable = Boolean(requestedTable && isTableAvailable(requestedTable));

  const nextReservationPayload: ReservationPayload = {
    ...reservationPayload,
    table:
      canReserveRequestedTable && typeof requestedTableId === "number"
        ? requestedTableId
        : "---",
  };

  const nextReservations = appendReservation(reservations, nextReservationPayload);
  const createdReservation = nextReservations[nextReservations.length - 1];

  if (!createdReservation || typeof createdReservation.table !== "number") {
    return {
      reservations: nextReservations,
      tables,
    };
  }

  const nextTables: TableInfo[] = tables.map((table): TableInfo =>
    table.id === createdReservation.table
      ? { ...table, status: "reservada", guests: createdReservation.guests }
      : table
  );

  return {
    reservations: nextReservations,
    tables: nextTables,
  };
};

export const assignTableToReservation = (
  reservations: Reservation[],
  tables: TableInfo[],
  reservationId: string,
  nextTableId: number
): ReservationTableMutationResult => {
  const reservation = reservations.find(
    (reservationItem) => reservationItem.id === reservationId
  );

  if (!reservation) {
    return { reservations, tables };
  }

  const normalizedNextTableId = normalizeReservationTable(nextTableId);
  if (normalizedNextTableId === "---") {
    return { reservations, tables };
  }

  const targetTable = tables.find((table) => table.id === normalizedNextTableId);
  if (!targetTable) {
    return { reservations, tables };
  }

  const currentTableId = reservation.table;
  const isSameTable =
    typeof currentTableId === "number" && currentTableId === normalizedNextTableId;

  if (!isSameTable && !isTableAvailable(targetTable)) {
    return { reservations, tables };
  }

  const nextReservations = reservations.map((reservationItem) => {
    if (reservationItem.id !== reservationId) {
      return reservationItem;
    }

    return {
      ...reservationItem,
      table: normalizedNextTableId,
      status: resolveStatusOnTableAssignment(reservationItem.status),
    };
  });

  const nextTables: TableInfo[] = tables.map((table): TableInfo => {
    if (
      typeof currentTableId === "number" &&
      currentTableId !== normalizedNextTableId &&
      table.id === currentTableId &&
      isTableReserved(table)
    ) {
      return { ...table, status: "disponible", guests: 0 };
    }

    if (table.id === normalizedNextTableId) {
      return { ...table, status: "reservada", guests: reservation.guests };
    }

    return table;
  });

  return {
    reservations: nextReservations,
    tables: nextTables,
  };
};

export const removeKitchenOrder = (
  orders: KitchenOrder[],
  orderId: string
): KitchenOrder[] =>
  orders.filter((order) => order.id !== orderId);


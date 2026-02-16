import type { CartItem, KitchenOrder, KitchenOrderItem } from "@/types";

const FALLBACK_ORDER_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800";

export interface KitchenOrderLineDisplay {
  key: string;
  name: string;
  qty: number;
  price: number;
  img: string;
  lineTotal: number;
}

interface HistoricalOrderBatch {
  id: string;
  sequence: number;
  waiter: string;
  notes?: string;
  items: KitchenOrderLineDisplay[];
  subtotal: number;
}

interface KitchenOrderLabels {
  tableId: number;
  sequence: number;
  tableLabel: string;
  orderLabel: string;
}

const resolveKitchenOrderTableId = (order: Pick<KitchenOrder, "tableId">): number =>
  order.tableId;

const resolveKitchenOrderSequence = (
  order: Pick<KitchenOrder, "sequence">
): number => order.sequence;

export const resolveKitchenOrderLabels = (
  order: Pick<KitchenOrder, "tableId" | "sequence">
): KitchenOrderLabels => {
  const tableId = resolveKitchenOrderTableId(order);
  const sequence = resolveKitchenOrderSequence(order);

  return {
    tableId,
    sequence,
    tableLabel: `Mesa ${tableId}`,
    orderLabel: `Orden #${String(sequence).padStart(2, "0")}`,
  };
};

export const resolveKitchenOrderLineDisplay = (
  line: KitchenOrderItem
): KitchenOrderLineDisplay => {
  return {
    key: `${line.itemId}-${line.qty}`,
    name: line.name,
    qty: line.qty,
    price: line.price,
    img: line.img || FALLBACK_ORDER_ITEM_IMAGE,
    lineTotal: line.price * line.qty,
  };
};

export const buildKitchenOrderId = (tableId: number, sequence: number): string => {
  return `T-${tableId}-${String(sequence).padStart(2, "0")}`;
};

export const getNextKitchenOrderSequence = (
  orders: KitchenOrder[],
  tableId: number
): number => {
  const tableSequences = orders
    .filter((order) => resolveKitchenOrderTableId(order) === tableId)
    .map((order) => resolveKitchenOrderSequence(order))
    .filter((sequence): sequence is number => typeof sequence === "number" && sequence > 0);

  if (tableSequences.length === 0) {
    return 1;
  }

  return Math.max(...tableSequences) + 1;
};

export const buildKitchenOrderFromCart = (
  tableId: number,
  currentOrders: KitchenOrder[],
  items: CartItem[],
  notes: string,
  waiter = "Jean-Luc P."
): KitchenOrder => {
  const sequence = getNextKitchenOrderSequence(currentOrders, tableId);

  return {
    id: buildKitchenOrderId(tableId, sequence),
    tableId,
    sequence,
    items: items.map((item) => ({
      itemId: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      img: item.img,
    })),
    status: "pending",
    waiter,
    notes,
  };
};

const sortKitchenOrdersBySequence = (orders: KitchenOrder[]): KitchenOrder[] =>
  [...orders].sort((left, right) => {
    if (left.sequence === right.sequence) {
      return left.id.localeCompare(right.id);
    }

    return left.sequence - right.sequence;
  });

export const buildHistoricalBatchesForTable = (
  tableId: number,
  kitchenOrders: KitchenOrder[]
): HistoricalOrderBatch[] => {
  const ordersByTable = sortKitchenOrdersBySequence(
    kitchenOrders.filter((order) => resolveKitchenOrderTableId(order) === tableId)
  );

  return ordersByTable.map((order, index) => {
    const sequence = resolveKitchenOrderSequence(order);
    const resolvedSequence = sequence > 0 ? sequence : index + 1;
    const items = order.items.map((line) => resolveKitchenOrderLineDisplay(line));
    const subtotal = items.reduce((acc, line) => acc + line.lineTotal, 0);

    return {
      id: order.id,
      sequence: resolvedSequence,
      waiter: order.waiter,
      notes: order.notes,
      items,
      subtotal,
    };
  });
};

import type { KitchenOrder } from "@/types";

const kitchenOrderIdPattern = /^T-(\d+)(?:-(\d+))?$/;

const parseKitchenOrderId = (
  orderId: string
): { tableId: number | null; sequence: number | null } => {
  const match = orderId.match(kitchenOrderIdPattern);
  if (!match) {
    return { tableId: null, sequence: null };
  }

  const parsedTableId = Number.parseInt(match[1] ?? "", 10);
  const parsedSequence =
    typeof match[2] === "string" ? Number.parseInt(match[2], 10) : Number.NaN;

  return {
    tableId: Number.isFinite(parsedTableId) ? parsedTableId : null,
    sequence: Number.isFinite(parsedSequence) ? parsedSequence : null,
  };
};

export const extractTableIdFromLabel = (tableLabel: string): number | null => {
  const match = tableLabel.match(/\d+/);
  if (!match) {
    return null;
  }

  const parsedTableId = Number.parseInt(match[0], 10);
  return Number.isFinite(parsedTableId) ? parsedTableId : null;
};

export const resolveKitchenOrderTableId = (order: Pick<KitchenOrder, "id" | "tableId">): number | null => {
  if (typeof order.tableId === "number" && Number.isFinite(order.tableId)) {
    return order.tableId;
  }

  return parseKitchenOrderId(order.id).tableId;
};

export const resolveKitchenOrderSequence = (
  order: Pick<KitchenOrder, "id" | "sequence">
): number | null => {
  if (typeof order.sequence === "number" && Number.isFinite(order.sequence)) {
    return order.sequence;
  }

  const parsed = parseKitchenOrderId(order.id);
  if (typeof parsed.sequence === "number" && Number.isFinite(parsed.sequence)) {
    return parsed.sequence;
  }

  // Legacy ids like T-102 were single-batch orders. Treat as sequence #1.
  if (typeof parsed.tableId === "number" && Number.isFinite(parsed.tableId)) {
    return 1;
  }

  return null;
};

export const buildKitchenOrderId = (tableId: number, sequence: number): string =>
  `T-${tableId}-${String(sequence).padStart(2, "0")}`;

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

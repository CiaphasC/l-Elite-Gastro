import { createSalesRecord } from "@/domain/dashboard";
import { buildKitchenOrderFromCart } from "@/domain/orders";
import { calculateCartTotal } from "@/domain/pricing";
import {
  applyCheckoutToInventory,
  reconcileCartWithInventory,
} from "@/domain/services/restaurantService";
import type { CartItem, KitchenOrder, MenuItem, SalesRecord } from "@/types";

const toQtyByItemId = (items: CartItem[]): Map<number, number> =>
  new Map(items.map((item) => [item.id, item.qty]));

export const hasCartItemQuantitiesChanged = (
  requestedItems: CartItem[],
  effectiveItems: CartItem[]
): boolean => {
  if (requestedItems.length !== effectiveItems.length) {
    return true;
  }

  const requestedQtyById = toQtyByItemId(requestedItems);
  const effectiveQtyById = toQtyByItemId(effectiveItems);

  if (requestedQtyById.size !== effectiveQtyById.size) {
    return true;
  }

  for (const [itemId, requestedQty] of requestedQtyById) {
    if (effectiveQtyById.get(itemId) !== requestedQty) {
      return true;
    }
  }

  return false;
};

export interface PrepareOrderWorkflowInput {
  requestedItems: CartItem[];
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  tableId: number;
  orderNotes: string;
}

export interface PreparedOrderWorkflow {
  effectiveItems: CartItem[];
  wasAdjusted: boolean;
  orderTotal: number;
  nextInventory: MenuItem[];
  nextKitchenOrder: KitchenOrder;
  nextSalesRecord: SalesRecord;
}

export const prepareOrderWorkflow = ({
  requestedItems,
  inventory,
  kitchenOrders,
  tableId,
  orderNotes,
}: PrepareOrderWorkflowInput): PreparedOrderWorkflow | null => {
  const effectiveItems = reconcileCartWithInventory(requestedItems, inventory);
  if (effectiveItems.length === 0) {
    return null;
  }

  const wasAdjusted = hasCartItemQuantitiesChanged(requestedItems, effectiveItems);
  const orderTotal = calculateCartTotal(effectiveItems);
  const nextInventory = applyCheckoutToInventory(inventory, effectiveItems);
  const nextKitchenOrder = buildKitchenOrderFromCart(
    tableId,
    kitchenOrders,
    effectiveItems,
    orderNotes
  );
  const nextSalesRecord = createSalesRecord(orderTotal);

  return {
    effectiveItems,
    wasAdjusted,
    orderTotal,
    nextInventory,
    nextKitchenOrder,
    nextSalesRecord,
  };
};


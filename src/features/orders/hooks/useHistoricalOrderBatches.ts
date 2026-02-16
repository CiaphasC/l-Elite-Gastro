import { useMemo } from "react";
import { buildHistoricalBatchesForTable } from "@/domain/orders";
import type { KitchenOrder } from "@/types";

export const useHistoricalOrderBatches = (
  tableId: number,
  kitchenOrders: KitchenOrder[]
) =>
  useMemo(() => buildHistoricalBatchesForTable(tableId, kitchenOrders), [tableId, kitchenOrders]);

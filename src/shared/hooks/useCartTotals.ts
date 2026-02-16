import { useMemo } from "react";
import { calculateCartPricing, DEFAULT_SERVICE_FEE_RATE } from "@/domain/pricing";
import type { CartItem } from "@/types";

interface UseCartTotalsOptions {
  serviceFeeRate?: number;
}

interface CartTotalsSnapshot {
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export const useCartTotals = (
  cartItems: CartItem[],
  options: UseCartTotalsOptions = {}
): CartTotalsSnapshot => {
  const serviceFeeRate = options.serviceFeeRate ?? DEFAULT_SERVICE_FEE_RATE;

  return useMemo(() => calculateCartPricing(cartItems, serviceFeeRate), [cartItems, serviceFeeRate]);
};

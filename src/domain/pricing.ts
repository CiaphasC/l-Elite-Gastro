import type { CartItem } from "@/types";

export const DEFAULT_SERVICE_FEE_RATE = 0.1;

export interface CartPricingSnapshot {
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export const calculateCartPricing = (
  items: CartItem[],
  serviceFeeRate = DEFAULT_SERVICE_FEE_RATE
): CartPricingSnapshot => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);
  const serviceFee = subtotal * serviceFeeRate;

  return {
    itemCount,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
};

export const calculateCartTotal = (
  items: CartItem[],
  serviceFeeRate = DEFAULT_SERVICE_FEE_RATE
): number => calculateCartPricing(items, serviceFeeRate).total;


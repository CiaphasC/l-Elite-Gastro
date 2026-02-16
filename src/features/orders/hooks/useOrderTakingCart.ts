import { useCallback, useState } from "react";
import { addItemToCart, updateCartItemQty } from "@/domain/services/restaurantService";
import type { CartItem, MenuItem } from "@/types";

interface UseOrderTakingCartResult {
  localCart: CartItem[];
  addToLocalCart: (item: MenuItem) => void;
  updateQty: (itemId: number, delta: number) => void;
}

export const useOrderTakingCart = (inventory: MenuItem[]): UseOrderTakingCartResult => {
  const [localCart, setLocalCart] = useState<CartItem[]>([]);

  const addToLocalCart = useCallback(
    (item: MenuItem) => {
      setLocalCart((previousCart) => addItemToCart(previousCart, item, inventory));
    },
    [inventory]
  );

  const updateQty = useCallback(
    (itemId: number, delta: number) => {
      setLocalCart((previousCart) => updateCartItemQty(previousCart, inventory, itemId, delta));
    },
    [inventory]
  );

  return {
    localCart,
    addToLocalCart,
    updateQty,
  };
};

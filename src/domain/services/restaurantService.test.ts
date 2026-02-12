import {
  addItemToCart,
  applyCheckoutToInventory,
  appendReservation,
  reconcileCartWithInventory,
  updateCartItemQty,
} from "@/domain/services/restaurantService";
import { describe, expect, it } from "vitest";
import type { CartItem, MenuItem } from "@/types";

const inventory: MenuItem[] = [
  {
    id: 1,
    name: "Item A",
    price: 10,
    category: "Entrantes",
    img: "x",
    stock: 2,
    unit: "u",
  },
  {
    id: 2,
    name: "Item B",
    price: 12,
    category: "Postres",
    img: "y",
    stock: 5,
    unit: "u",
  },
];

describe("restaurantService stock invariants", () => {
  it("does not allow adding cart quantity above inventory stock", () => {
    let cart: CartItem[] = [];

    cart = addItemToCart(cart, inventory[0], inventory);
    cart = addItemToCart(cart, inventory[0], inventory);
    cart = addItemToCart(cart, inventory[0], inventory);

    expect(cart[0]?.qty).toBe(2);
  });

  it("clamps cart qty updates by inventory stock", () => {
    const cart: CartItem[] = [{ ...inventory[0], qty: 1 }];

    const nextCart = updateCartItemQty(cart, inventory, 1, 10);

    expect(nextCart[0]?.qty).toBe(2);
  });

  it("reconciles cart when stock is reduced", () => {
    const cart: CartItem[] = [{ ...inventory[1], qty: 4 }];
    const reducedInventory: MenuItem[] = [{ ...inventory[1], stock: 2 }];

    const nextCart = reconcileCartWithInventory(cart, reducedInventory);

    expect(nextCart[0]?.qty).toBe(2);
  });

  it("deducts inventory stock on checkout", () => {
    const cart: CartItem[] = [{ ...inventory[1], qty: 3 }];

    const nextInventory = applyCheckoutToInventory(inventory, cart);

    expect(nextInventory.find((item) => item.id === 2)?.stock).toBe(2);
    expect(nextInventory.find((item) => item.id === 1)?.stock).toBe(2);
  });
});

describe("appendReservation", () => {
  it("creates reservations with robust string ids", () => {
    const payload = {
      name: "Mesa Lopez",
      guests: 2,
      time: "20:00",
      type: "Cena" as const,
    };

    const first = appendReservation([], payload)[0];
    const second = appendReservation([], payload)[0];

    expect(typeof first.id).toBe("string");
    expect(first.id.length).toBeGreaterThan(0);
    expect(first.id).not.toBe(second.id);
  });
});

import {
  addItemToCart,
  applyCheckoutToInventory,
  appendReservation,
  appendReservationWithTableAssignment,
  assignTableToReservation,
  reconcileCartWithInventory,
  updateCartItemQty,
} from "@/domain/services/restaurantService";
import { describe, expect, it } from "vitest";
import type { CartItem, MenuItem, Reservation, TableInfo } from "@/types";

const inventory: MenuItem[] = [
  {
    id: 1,
    name: "Item A",
    price: 10,
    category: "Entrantes",
    img: "x",
    stock: 2,
    unit: "u",
    type: "dish",
  },
  {
    id: 2,
    name: "Item B",
    price: 12,
    category: "Postres",
    img: "y",
    stock: 5,
    unit: "u",
    type: "dish",
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

describe("reservation table assignment", () => {
  const reservationTables: TableInfo[] = [
    { id: 11, status: "disponible", guests: 0 },
    { id: 12, status: "reservada", guests: 2 },
    { id: 13, status: "disponible", guests: 0 },
    { id: 14, status: "reservada", guests: 5 },
  ];

  const baseReservations: Reservation[] = [
    {
      id: "rsv-a",
      name: "Cliente A",
      time: "20:00",
      guests: 2,
      table: 12,
      type: "Cena",
      status: "pendiente",
    },
  ];

  it("creates a reservation and reserves the selected available table", () => {
    const result = appendReservationWithTableAssignment([], reservationTables, {
      name: "Mesa Nova",
      guests: 4,
      time: "21:00",
      type: "Negocios",
      table: 11,
    });

    expect(result.reservations).toHaveLength(1);
    expect(result.reservations[0]?.table).toBe(11);
    expect(result.tables.find((table) => table.id === 11)?.status).toBe("reservada");
    expect(result.tables.find((table) => table.id === 11)?.guests).toBe(4);
  });

  it("reassigns reservation table and syncs table availability", () => {
    const result = assignTableToReservation(
      baseReservations,
      reservationTables,
      "rsv-a",
      13
    );

    expect(result.reservations[0]?.table).toBe(13);
    expect(result.reservations[0]?.status).toBe("confirmado");
    expect(result.tables.find((table) => table.id === 12)?.status).toBe("disponible");
    expect(result.tables.find((table) => table.id === 13)?.status).toBe("reservada");
  });

  it("does not reassign reservation to a non-available table", () => {
    const result = assignTableToReservation(
      baseReservations,
      reservationTables,
      "rsv-a",
      14
    );

    expect(result.reservations).toEqual(baseReservations);
    expect(result.tables).toEqual(reservationTables);
  });
});

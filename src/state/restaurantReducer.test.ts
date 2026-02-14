import { ACTIONS, createInitialState, restaurantReducer } from "@/state/restaurantReducer";
import { describe, expect, it } from "vitest";

const runAction = (action: { type: string; payload?: unknown }) => {
  const state = createInitialState();
  return restaurantReducer(state, action as never);
};

describe("restaurantReducer", () => {
  it("caps add-to-cart by available stock", () => {
    const state = createInitialState();
    const oysters = state.inventory.find((item) => item.id === 2);

    if (!oysters) {
      throw new Error("Missing fixture item");
    }

    let nextState = state;
    for (let i = 0; i < 10; i += 1) {
      nextState = restaurantReducer(nextState, {
        type: ACTIONS.ADD_TO_CART,
        payload: oysters,
      } as never);
    }

    expect(nextState.cart.find((item) => item.id === oysters.id)?.qty).toBe(oysters.stock);
  });

  it("deducts inventory and updates dashboard on checkout", () => {
    const state = createInitialState();
    const firstItem = state.inventory[0];

    const withCart = {
      ...state,
      cart: [{ ...firstItem, qty: 2 }],
      ui: { ...state.ui, showCheckout: true },
    };

    const nextState = restaurantReducer(withCart, { type: ACTIONS.CONFIRM_CHECKOUT } as never);

    expect(nextState.inventory.find((item) => item.id === firstItem.id)?.stock).toBe(
      firstItem.stock - 2
    );
    expect(nextState.cart).toHaveLength(0);
    expect(nextState.ui.showCheckout).toBe(false);
    expect(nextState.dashboard.netSales).toBeGreaterThan(state.dashboard.netSales);
  });

  it("reconciles cart when stock adjustment goes below current qty", () => {
    const state = createInitialState();
    const item = state.inventory[0];

    const withCart = {
      ...state,
      cart: [{ ...item, qty: 3 }],
    };

    const nextState = restaurantReducer(withCart, {
      type: ACTIONS.ADJUST_STOCK,
      payload: { itemId: item.id, delta: -10 },
    } as never);

    expect(nextState.inventory.find((inventoryItem) => inventoryItem.id === item.id)?.stock).toBe(
      item.stock - 10
    );
    expect(nextState.cart.find((cartItem) => cartItem.id === item.id)?.qty).toBe(item.stock - 10);
  });

  it("closes checkout modal even when cart is empty", () => {
    const nextState = runAction({ type: ACTIONS.CONFIRM_CHECKOUT });
    expect(nextState.ui.showCheckout).toBe(false);
  });

  it("updates selected currency", () => {
    const nextState = runAction({ type: ACTIONS.SET_CURRENCY_CODE, payload: "MXN" });
    expect(nextState.currencyCode).toBe("MXN");
  });

  it("creates reservations with optional table assignment and reserves the table", () => {
    const state = createInitialState();

    const nextState = restaurantReducer(state, {
      type: ACTIONS.ADD_RESERVATION,
      payload: {
        name: "Familia Nova",
        time: "20:45",
        guests: 3,
        type: "Cena",
        table: 104,
      },
    } as never);

    const createdReservation = nextState.reservations[nextState.reservations.length - 1];
    expect(createdReservation?.table).toBe(104);
    expect(nextState.tables.find((table) => table.id === 104)?.status).toBe("reservada");
    expect(nextState.tables.find((table) => table.id === 104)?.guests).toBe(3);
    expect(nextState.ui.showReservationModal).toBe(false);
  });

  it("reassigns reservation table and syncs both table states", () => {
    const state = createInitialState();

    const nextState = restaurantReducer(state, {
      type: ACTIONS.ASSIGN_RESERVATION_TABLE,
      payload: {
        reservationId: "rsv-001",
        tableId: 104,
      },
    } as never);

    const updatedReservation = nextState.reservations.find(
      (reservation) => reservation.id === "rsv-001"
    );

    expect(updatedReservation?.table).toBe(104);
    expect(updatedReservation?.status).toBe("confirmado");
    expect(nextState.tables.find((table) => table.id === 103)?.status).toBe("disponible");
    expect(nextState.tables.find((table) => table.id === 104)?.status).toBe("reservada");
  });
});

import { ACTIONS, createInitialState, restaurantReducer } from "@/state/restaurantReducer";
import { selectMenuCategories } from "@/domain/selectors";
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

  it("reconciles checkout cart against inventory before confirming order", () => {
    const state = createInitialState();
    const item = state.inventory[0];

    const withCart = {
      ...state,
      cart: [{ ...item, qty: item.stock + 5 }],
      ui: { ...state.ui, showCheckout: true },
    };

    const nextState = restaurantReducer(withCart, { type: ACTIONS.CONFIRM_CHECKOUT } as never);

    expect(nextState.inventory.find((inventoryItem) => inventoryItem.id === item.id)?.stock).toBe(0);
    expect(nextState.cart).toHaveLength(0);
    expect(nextState.notifications.some((notification) => notification.title === "Comanda Ajustada")).toBe(
      true
    );
  });

  it("closes checkout modal even when cart is empty", () => {
    const nextState = runAction({ type: ACTIONS.CONFIRM_CHECKOUT });
    expect(nextState.ui.showCheckout).toBe(false);
  });

  it("updates selected currency", () => {
    const nextState = runAction({ type: ACTIONS.SET_CURRENCY_CODE, payload: "MXN" });
    expect(nextState.currencyCode).toBe("MXN");
  });

  it("recomputes dashboard diners and average ticket from client base", () => {
    const state = createInitialState();

    const nextState = restaurantReducer(state, {
      type: ACTIONS.SAVE_CLIENT,
      payload: {
        name: "Cliente Nuevo",
        tier: "Normal",
        preferences: "",
        docType: "DNI",
        docNumber: "00000000",
      },
    } as never);

    const totalSpend = nextState.clients.reduce((acc, client) => acc + client.spend, 0);
    const expectedAverage = Math.round((totalSpend / nextState.clients.length) * 100) / 100;

    expect(nextState.dashboard.diners).toBe(nextState.clients.length);
    expect(nextState.dashboard.averageTicket).toBe(expectedAverage);
  });

  it("adds kitchen/bar dish stock into menu categories", () => {
    const state = createInitialState();

    const nextState = restaurantReducer(state, {
      type: ACTIONS.ADD_INVENTORY_ITEM,
      payload: {
        name: "Negroni de Autor",
        category: "Coctelería",
        stock: 12,
        unit: "copas",
        price: 19,
        type: "dish",
        img: "https://example.com/negroni.jpg",
      },
    } as never);

    const categories = selectMenuCategories(nextState);
    expect(categories).toContain("Coctelería");
    expect(
      nextState.inventory.some((item) => item.name === "Negroni de Autor" && item.type === "dish")
    ).toBe(true);
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

  it("edits reservation from modal context without creating duplicates", () => {
    const state = createInitialState();
    const withEditingContext = {
      ...state,
      ui: {
        ...state.ui,
        showReservationModal: true,
        reservationEditingId: "rsv-001",
      },
    };

    const nextState = restaurantReducer(withEditingContext, {
      type: ACTIONS.ADD_RESERVATION,
      payload: {
        name: "Roberto M. Actualizado",
        time: "21:20",
        guests: 3,
        type: "Cena",
        table: 104,
      },
    } as never);

    const updatedReservation = nextState.reservations.find(
      (reservation) => reservation.id === "rsv-001"
    );

    expect(nextState.reservations).toHaveLength(state.reservations.length);
    expect(updatedReservation?.name).toBe("Roberto M. Actualizado");
    expect(updatedReservation?.table).toBe(104);
    expect(nextState.tables.find((table) => table.id === 103)?.status).toBe("disponible");
    expect(nextState.tables.find((table) => table.id === 104)?.status).toBe("reservada");
    expect(nextState.ui.reservationEditingId).toBeNull();
    expect(nextState.ui.showReservationModal).toBe(false);
  });

  it("keeps current table when editing reservation to an unavailable table", () => {
    const state = createInitialState();
    const withEditingContext = {
      ...state,
      ui: {
        ...state.ui,
        showReservationModal: true,
        reservationEditingId: "rsv-001",
      },
    };

    const nextState = restaurantReducer(withEditingContext, {
      type: ACTIONS.ADD_RESERVATION,
      payload: {
        name: "Roberto M.",
        time: "21:10",
        guests: 2,
        type: "Cena",
        table: 102,
      },
    } as never);

    const unchangedReservation = nextState.reservations.find(
      (reservation) => reservation.id === "rsv-001"
    );

    expect(unchangedReservation?.table).toBe(103);
    expect(nextState.notifications.some((notification) => notification.title === "Mesa No Disponible")).toBe(
      true
    );
  });

  it("reconciles order-taking items against stock before sending to kitchen", () => {
    const state = createInitialState();
    const dish = state.inventory.find((item) => item.type === "dish");

    if (!dish) {
      throw new Error("Missing dish fixture item");
    }

    const withOrderTakingContext = {
      ...state,
      orderTakingContext: {
        tableId: 101,
        clientName: state.clients[0]?.name ?? "Cliente",
        reservationId: null,
      },
    };

    const nextState = restaurantReducer(withOrderTakingContext, {
      type: ACTIONS.CONFIRM_ORDER_TAKING,
      payload: {
        items: [{ ...dish, qty: dish.stock + 8 }],
        total: 9999,
      },
    } as never);

    const updatedKitchenOrder = nextState.kitchenOrders.find((order) => order.id === "T-101");
    const kitchenLine = updatedKitchenOrder?.items.find((line) => line.name === dish.name);

    expect(kitchenLine?.qty).toBe(dish.stock);
    expect(nextState.inventory.find((item) => item.id === dish.id)?.stock).toBe(0);
    expect(nextState.notifications.some((notification) => notification.title === "Comanda Ajustada")).toBe(
      true
    );
  });

  it("removes stock alerts when item stock is resolved", () => {
    const state = createInitialState();
    const lowStockItem = state.inventory.find((item) => item.stock > 0 && item.stock < 5);

    if (!lowStockItem) {
      throw new Error("Missing low stock fixture item");
    }

    expect(
      state.notifications.some((notification) => notification.meta?.stockItemId === lowStockItem.id)
    ).toBe(true);

    const nextState = restaurantReducer(state, {
      type: ACTIONS.ADJUST_STOCK,
      payload: { itemId: lowStockItem.id, delta: 10 },
    } as never);

    expect(nextState.inventory.find((item) => item.id === lowStockItem.id)?.stock).toBeGreaterThanOrEqual(
      5
    );
    expect(
      nextState.notifications.some((notification) => notification.meta?.stockItemId === lowStockItem.id)
    ).toBe(false);
  });

  it("dismisses service started notification after reading it", () => {
    const state = createInitialState();
    const dish = state.inventory.find((item) => item.type === "dish" && item.stock > 0);

    if (!dish) {
      throw new Error("Missing dish fixture item");
    }

    const withOrderTakingContext = {
      ...state,
      orderTakingContext: {
        tableId: 101,
        clientName: state.clients[0]?.name ?? "Cliente",
        reservationId: null,
      },
    };

    const withStartedService = restaurantReducer(withOrderTakingContext, {
      type: ACTIONS.CONFIRM_ORDER_TAKING,
      payload: {
        items: [{ ...dish, qty: 1 }],
        total: dish.price,
      },
    } as never);

    const serviceNotification = withStartedService.notifications.find(
      (notification) => notification.title === "Servicio Iniciado"
    );

    if (!serviceNotification) {
      throw new Error("Expected service-started notification");
    }

    const afterRead = restaurantReducer(withStartedService, {
      type: ACTIONS.MARK_NOTIFICATION_AS_READ,
      payload: serviceNotification.id,
    } as never);

    expect(afterRead.notifications.some((notification) => notification.id === serviceNotification.id)).toBe(
      false
    );
    expect(afterRead.activeTab).toBe("tables");
  });
});

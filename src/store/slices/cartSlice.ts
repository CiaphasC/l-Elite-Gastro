import { prepareOrderWorkflow } from "@/domain/services/orderWorkflowService";
import { addItemToCart, updateCartItemQty } from "@/domain/services/restaurantService";
import { formatCurrency } from "@/shared/formatters/currency";
import {
  createNotification,
  createStockTransitionNotifications,
  resolveDashboardSnapshot,
  withInventoryAwareNotifications,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type { MenuItem, ReservationStatus, RestaurantState } from "@/types";

const shouldConfirmReservation = (reservationStatus: ReservationStatus) =>
  reservationStatus !== "confirmado" &&
  reservationStatus !== "en curso" &&
  reservationStatus !== "completado";

export const createCartSlice: RestaurantSliceCreator = (set) => ({
  addToCart: (menuItem: MenuItem) =>
    set((state) => {
      const nextCart = addItemToCart(state.cart, menuItem, state.inventory);
      if (nextCart === state.cart) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Stock Insuficiente",
              `No hay stock disponible para ${menuItem.name}.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
        };
      }

      return {
        cart: nextCart,
      };
    }),

  updateCartQty: (itemId: number, delta: number) =>
    set((state) => ({
      cart: updateCartItemQty(state.cart, state.inventory, itemId, delta),
    })),

  clearCart: () =>
    set(() => ({
      cart: [],
    })),

  confirmCheckout: () =>
    set((state) => {
      if (state.cart.length === 0) {
        return {
          ui: { ...state.ui, showCheckout: false },
        };
      }

      const preparedOrder = prepareOrderWorkflow({
        requestedItems: state.cart,
        inventory: state.inventory,
        kitchenOrders: state.kitchenOrders,
        tableId: state.serviceContext.tableId,
        orderNotes: "Orden tomada en recibo",
      });

      if (!preparedOrder) {
        return {
          cart: [],
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Stock Insuficiente",
              "La comanda no pudo confirmarse porque no hay stock disponible.",
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
          ui: { ...state.ui, showCheckout: false },
        };
      }

      const {
        wasAdjusted,
        orderTotal,
        nextInventory,
        nextKitchenOrder,
        nextSalesRecord,
      } = preparedOrder;
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);
      const nextSalesHistory = [nextSalesRecord, ...state.salesHistory];
      const checkoutTableId = state.serviceContext.tableId;

      const reservationWasConfirmed = state.reservations.some(
        (reservation) =>
          reservation.table === checkoutTableId && shouldConfirmReservation(reservation.status)
      );

      const nextReservations: RestaurantState["reservations"] = state.reservations.map(
        (reservation) =>
          reservation.table === checkoutTableId && shouldConfirmReservation(reservation.status)
            ? { ...reservation, status: "confirmado" as const }
            : reservation
      );

      const confirmedReservation = nextReservations.find(
        (reservation) => reservation.table === checkoutTableId && reservation.status === "confirmado"
      );
      const hasReservationForCheckoutTable = nextReservations.some(
        (reservation) => reservation.table === checkoutTableId
      );
      const nextTables: RestaurantState["tables"] = hasReservationForCheckoutTable
        ? state.tables.map((table) =>
            table.id === checkoutTableId && table.status !== "ocupada"
              ? {
                  ...table,
                  status: "reservada" as const,
                  guests: confirmedReservation?.guests ?? table.guests,
                }
              : table
          )
        : state.tables;

      const nextDashboard = resolveDashboardSnapshot(state.clients, nextSalesHistory);

      return {
        inventory: nextInventory,
        kitchenOrders: [nextKitchenOrder, ...state.kitchenOrders],
        salesHistory: nextSalesHistory,
        reservations: nextReservations,
        tables: nextTables,
        cart: [],
        dashboard: nextDashboard,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Orden Confirmada",
              `Comanda #${nextKitchenOrder.id} enviada a cocina. Total ${formatCurrency(orderTotal, state.currencyCode)}.`,
              false,
              "Ahora",
              { navigateTo: "kitchen" }
            ),
            ...(reservationWasConfirmed
              ? [
                  createNotification(
                    "info",
                    "Reserva Confirmada",
                    `La reserva de la mesa ${checkoutTableId} fue actualizada a confirmado.`,
                    false,
                    "Ahora",
                    { navigateTo: "reservations" }
                  ),
                ]
              : []),
            ...(wasAdjusted
              ? [
                  createNotification(
                    "stock",
                    "Comanda Ajustada",
                    "Algunos items se ajustaron automaticamente por stock disponible.",
                    false,
                    "Ahora",
                    { navigateTo: "inventory" }
                  ),
                ]
              : []),
            ...stockNotifications,
          ],
          nextInventory
        ),
        ui: { ...state.ui, showCheckout: false },
      };
    }),
});

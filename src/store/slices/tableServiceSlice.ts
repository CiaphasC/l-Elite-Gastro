import { prepareOrderWorkflow } from "@/domain/services/orderWorkflowService";
import {
  closeTableConfirmation,
  createNotification,
  createStockTransitionNotifications,
  resolveDashboardSnapshot,
  withInventoryAwareNotifications,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";

export const createTableServiceSlice: RestaurantSliceCreator = (set) => ({
  confirmTableAction: () =>
    set((state) => {
      const { tableId, type } = state.ui.confirmationModal;
      const nowIso = new Date().toISOString();

      if (!tableId || !type) {
        return {
          ui: closeTableConfirmation(state.ui),
        };
      }

      if (type === "reservation") {
        const reservation = state.reservations.find(
          (reservationItem) =>
            reservationItem.table === tableId &&
            (reservationItem.status === "confirmado" ||
              reservationItem.status === "vip" ||
              reservationItem.status === "pendiente" ||
              reservationItem.status === "vip pendiente" ||
              reservationItem.status === "vip reservado")
        );

        return {
          serviceContext: {
            ...state.serviceContext,
            tableId,
          },
          orderTakingContext: {
            tableId,
            clientName: reservation?.name ?? "Comensal",
            reservationId: reservation?.id ?? null,
          },
          ui: closeTableConfirmation(state.ui),
        };
      }

      if (type === "cleaning") {
        return {
          tables: state.tables.map((table) =>
            table.id === tableId
              ? {
                  ...table,
                status: "disponible",
                guests: 0,
                cleaningStartTime: undefined,
                cleaningStaff: undefined,
                currentSession: null,
                statusUpdatedAt: nowIso,
              }
            : table
          ),
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Mesa Disponible",
              `Mesa ${tableId} habilitada para servicio.`,
              false,
              "Ahora",
              { navigateTo: "tables", serviceEvent: "table_available" }
            ),
          ]),
          ui: closeTableConfirmation(state.ui),
        };
      }

      const now = new Date();
      const cleaningStartTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      return {
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: "limpieza",
                guests: 0,
                cleaningStartTime,
                cleaningStaff: "Roberto S.",
                statusUpdatedAt: nowIso,
              }
            : table
        ),
        reservations: state.reservations.map((reservation) =>
          reservation.table === tableId && reservation.status === "en curso"
            ? { ...reservation, status: "completado" }
            : reservation
        ),
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "info",
            "Mesa en Limpieza",
            `Mesa ${tableId} paso a mantenimiento luego del servicio.`,
            false,
            "Ahora",
            { navigateTo: "tables", serviceEvent: "table_maintenance" }
          ),
        ]),
        ui: closeTableConfirmation(state.ui),
      };
    }),

  confirmOrderTaking: (payload) =>
    set((state) => {
      const nowIso = new Date().toISOString();
      if (!state.orderTakingContext || payload.items.length === 0) {
        return {
          orderTakingContext: null,
        };
      }

      const { tableId, clientName, reservationId } = state.orderTakingContext;
      const preparedOrder = prepareOrderWorkflow({
        requestedItems: payload.items,
        inventory: state.inventory,
        kitchenOrders: state.kitchenOrders,
        tableId,
        orderNotes: "Inicio servicio",
      });

      if (!preparedOrder) {
        return {
          orderTakingContext: null,
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "stock",
              "Sin Stock Para Servicio",
              `No se pudo iniciar servicio en mesa ${tableId} por falta de stock.`,
              false,
              "Ahora",
              { navigateTo: "inventory" }
            ),
          ]),
        };
      }

      const {
        effectiveItems,
        wasAdjusted,
        orderTotal,
        nextInventory,
        nextKitchenOrder,
        nextSalesRecord,
      } = preparedOrder;
      const stockNotifications = createStockTransitionNotifications(state.inventory, nextInventory);
      const nextSalesHistory = [nextSalesRecord, ...state.salesHistory];

      const now = new Date();
      const dateString = `${now.getDate()} ${[
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ][now.getMonth()]} ${now.getFullYear()}`;

      const reservationInContext = state.reservations.find(
        (reservation) => reservation.id === reservationId
      );
      const guestsInContext = reservationInContext?.guests ?? 2;

      const nextClients = state.clients.map((client) => {
        if (client.name.trim().toLowerCase() !== clientName.trim().toLowerCase()) {
          return client;
        }

        return {
          ...client,
          visits: client.visits + 1,
          spend: client.spend + orderTotal,
          lastVisit: "Hoy",
          history: [
            {
              id: Date.now(),
              date: dateString,
              type: "Cena",
              table: String(tableId),
              items: effectiveItems.map((item) => item.name),
              total: orderTotal,
              status: "En Curso",
            },
            ...client.history,
          ],
        };
      });
      const nextDashboard = resolveDashboardSnapshot(nextClients, nextSalesHistory);

      return {
        inventory: nextInventory,
        kitchenOrders: [nextKitchenOrder, ...state.kitchenOrders],
        salesHistory: nextSalesHistory,
        reservations:
          typeof reservationId === "string"
            ? state.reservations.map((reservation) =>
                reservation.id === reservationId ? { ...reservation, status: "en curso" } : reservation
              )
            : state.reservations,
        tables: state.tables.map((table) =>
          table.id === tableId
            ? {
                ...table,
                status: "ocupada",
                guests: guestsInContext,
                statusUpdatedAt: nowIso,
                cleaningStartTime: undefined,
                cleaningStaff: undefined,
                currentSession: {
                  name: clientName,
                  time: "Ahora",
                  guests: guestsInContext,
                  type: reservationInContext?.type ?? "Cena",
                },
              }
            : table
        ),
        clients: nextClients,
        dashboard: nextDashboard,
        notifications: withInventoryAwareNotifications(
          state.notifications,
          [
            createNotification(
              "success",
              "Servicio Iniciado",
              `Mesa ${tableId} ocupada. Comanda enviada a cocina.`,
              false,
              "Ahora",
              { navigateTo: "tables", dismissOnRead: true }
            ),
            ...(wasAdjusted
              ? [
                  createNotification(
                    "stock",
                    "Comanda Ajustada",
                    "Se ajustaron cantidades por disponibilidad real de stock.",
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
        orderTakingContext: null,
        activeTab: "tables",
      };
    }),
});

import {
  createNotification,
  resolveDashboardSnapshot,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type { Client } from "@/types";

export const createClientSlice: RestaurantSliceCreator = (set) => ({
  saveClient: (payload) =>
    set((state) => {
      const editingClientId = state.ui.clientModal.targetClientId;

      if (typeof editingClientId === "number") {
        const nextClients = state.clients.map((client) =>
          client.id === editingClientId
            ? {
                ...client,
                ...payload,
              }
            : client
        );

        return {
          clients: nextClients,
          dashboard: resolveDashboardSnapshot(nextClients, state.salesHistory),
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Cliente Actualizado",
              `${payload.name} fue actualizado.`,
              false,
              "Ahora",
              { navigateTo: "clients" }
            ),
          ]),
          ui: {
            ...state.ui,
            clientModal: {
              ...state.ui.clientModal,
              isOpen: false,
              targetClientId: null,
            },
          },
        };
      }

      const nextClientId =
        state.clients.length === 0 ? 1 : Math.max(...state.clients.map((client) => client.id)) + 1;
      const nextClient: Client = {
        id: nextClientId,
        ...payload,
        visits: 1,
        spend: 0,
        lastVisit: "Hoy",
        history: [],
      };
      const nextClients = [...state.clients, nextClient];

      return {
        clients: nextClients,
        dashboard: resolveDashboardSnapshot(nextClients, state.salesHistory),
        notifications: withPrependedNotifications(state.notifications, [
          nextClient.tier === "Gold"
            ? createNotification(
                "vip",
                "Nuevo Cliente VIP",
                `${nextClient.name} fue agregado como miembro Gold.`,
                false,
                "Ahora",
                { navigateTo: "clients" }
              )
            : createNotification(
                "info",
                "Nuevo Cliente",
                `${nextClient.name} fue agregado.`,
                false,
                "Ahora",
                { navigateTo: "clients" }
              ),
        ]),
        ui: {
          ...state.ui,
          clientModal: {
            ...state.ui.clientModal,
            isOpen: false,
            targetClientId: null,
          },
        },
      };
    }),
});

import {
  appendReservationWithTableAssignment,
  assignTableToReservation,
} from "@/domain/services/restaurantService";
import {
  createNotification,
  resolveClientMatch,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type { TableInfo } from "@/types";

const createTableReservedNotification = (
  tableId: number,
  reservationName: string,
  reservationTime: string
) =>
  createNotification(
    "info",
    "Mesa Reservada",
    `Mesa ${tableId} reservada para ${reservationName} (${reservationTime}).`,
    false,
    "Ahora",
    { navigateTo: "reservations", serviceEvent: "table_reserved" }
  );

export const createReservationSlice: RestaurantSliceCreator = (set) => ({
  addReservation: (payload) =>
    set((state) => {
      const nowIso = new Date().toISOString();
      const isVipReservation =
        payload.type === "VIP" ||
        Boolean(resolveClientMatch(state.clients, payload.name)?.tier === "Gold");
      const editingReservationId = state.ui.reservationEditingId;

      if (editingReservationId) {
        const targetReservation = state.reservations.find(
          (reservation) => reservation.id === editingReservationId
        );

        if (!targetReservation) {
          return {
            ui: {
              ...state.ui,
              showReservationModal: false,
              reservationPrefill: null,
              reservationEditingId: null,
            },
          };
        }

        const requestedTable =
          typeof payload.table === "number" || payload.table === "---"
            ? payload.table
            : targetReservation.table;
        const oldTable = targetReservation.table;
        const requestedTableInfo =
          typeof requestedTable === "number"
            ? state.tables.find((table) => table.id === requestedTable)
            : undefined;
        const canUseRequestedTable =
          requestedTable === "---" ||
          requestedTable === oldTable ||
          requestedTableInfo?.status === "disponible";
        const finalTable =
          canUseRequestedTable && requestedTable !== undefined
            ? requestedTable
            : targetReservation.table;
        const keepsLiveStatus =
          targetReservation.status === "en curso" || targetReservation.status === "completado";
        const nextStatus = keepsLiveStatus
          ? targetReservation.status
          : isVipReservation
            ? typeof finalTable === "number"
              ? "vip reservado"
              : "vip pendiente"
            : typeof finalTable === "number"
              ? "confirmado"
              : "pendiente";
        const reservedTableId = typeof finalTable === "number" ? finalTable : null;
        const shouldNotifyTableReserved =
          reservedTableId !== null && nextStatus !== "en curso" && nextStatus !== "completado";

        const nextReservations = state.reservations.map((reservation) =>
          reservation.id === editingReservationId
            ? {
                ...reservation,
                name: payload.name,
                time: payload.time,
                guests: payload.guests,
                type: payload.type ?? reservation.type,
                table: finalTable,
                status: nextStatus,
              }
            : reservation
        );

        const nextTables: TableInfo[] = state.tables.map((table): TableInfo => {
          if (
            typeof oldTable === "number" &&
            oldTable !== finalTable &&
            table.id === oldTable &&
            table.status === "reservada"
          ) {
            return {
              ...table,
              status: "disponible",
              guests: 0,
              statusUpdatedAt: nowIso,
            };
          }

          if (typeof finalTable === "number" && table.id === finalTable) {
            return {
              ...table,
              status: nextStatus === "en curso" ? "ocupada" : "reservada",
              guests: payload.guests,
              statusUpdatedAt: nowIso,
            };
          }

          return table;
        });

        return {
          reservations: nextReservations,
          tables: nextTables,
          notifications: withPrependedNotifications(state.notifications, [
            ...(shouldNotifyTableReserved
              ? [createTableReservedNotification(reservedTableId, payload.name, payload.time)]
              : []),
            createNotification(
              "info",
              "Reserva Actualizada",
              `La reserva de ${payload.name} fue actualizada.`,
              false,
              "Ahora",
              { navigateTo: "reservations" }
            ),
            ...(!canUseRequestedTable && requestedTable !== targetReservation.table
              ? [
                  createNotification(
                    "stock",
                    "Mesa No Disponible",
                    `Se mantuvo la mesa actual porque la mesa ${String(requestedTable)} no estaba disponible.`,
                    false,
                    "Ahora",
                    { navigateTo: "reservations" }
                  ),
                ]
              : []),
          ]),
          ui: {
            ...state.ui,
            showReservationModal: false,
            reservationPrefill: null,
            reservationEditingId: null,
          },
        };
      }

      const reservationMutationResult = appendReservationWithTableAssignment(
        state.reservations,
        state.tables,
        payload
      );
      const nextReservations = [...reservationMutationResult.reservations];
      const createdReservation = nextReservations[nextReservations.length - 1];
      const hasAssignedTable = typeof createdReservation?.table === "number";
      const assignedTableId =
        createdReservation && typeof createdReservation.table === "number"
          ? createdReservation.table
          : null;

      if (createdReservation) {
        nextReservations[nextReservations.length - 1] = {
          ...createdReservation,
          status: isVipReservation
            ? hasAssignedTable
              ? "vip reservado"
              : "vip pendiente"
            : hasAssignedTable
              ? "confirmado"
              : "pendiente",
        };
      }

      return {
        reservations: nextReservations,
        tables: reservationMutationResult.tables,
        notifications: withPrependedNotifications(state.notifications, [
          ...(assignedTableId !== null
            ? [createTableReservedNotification(assignedTableId, payload.name, payload.time)]
            : []),
          isVipReservation
            ? createNotification(
                "vip",
                "Nueva Reserva VIP",
                `Reserva prioritaria para ${payload.name} registrada.`,
                false,
                "Ahora",
                { navigateTo: "reservations" }
              )
            : createNotification(
                "info",
                "Nueva Reserva",
                `Reserva para ${payload.name} a las ${payload.time}.`,
                false,
                "Ahora",
                { navigateTo: "reservations" }
              ),
        ]),
        ui: {
          ...state.ui,
          showReservationModal: false,
          reservationPrefill: null,
          reservationEditingId: null,
        },
      };
    }),

  assignReservationTable: (reservationId: string, tableId: number) =>
    set((state) => {
      const previousReservation = state.reservations.find(
        (reservation) => reservation.id === reservationId
      );
      const assignmentResult = assignTableToReservation(
        state.reservations,
        state.tables,
        reservationId,
        tableId
      );
      const nextReservation = assignmentResult.reservations.find(
        (reservation) => reservation.id === reservationId
      );
      const hasReservedTable =
        typeof nextReservation?.table === "number" &&
        (nextReservation.table !== previousReservation?.table ||
          nextReservation.status !== previousReservation?.status);
      const reservedTableId =
        hasReservedTable && typeof nextReservation?.table === "number"
          ? nextReservation.table
          : null;

      return {
        reservations: assignmentResult.reservations,
        tables: assignmentResult.tables,
        ...(reservedTableId !== null && nextReservation
          ? {
              notifications: withPrependedNotifications(state.notifications, [
                createTableReservedNotification(
                  reservedTableId,
                  nextReservation.name,
                  nextReservation.time
                ),
              ]),
            }
          : {}),
      };
    }),
});

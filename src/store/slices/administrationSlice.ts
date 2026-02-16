import {
  createPendingWorkerFromRegistration,
  createTable,
  createWorkerAccount,
  isWorkerEmailTaken,
  updateTableData,
  updateWorkerAccountData,
} from "@/domain/services/administrationService";
import {
  createNotification,
  withPrependedNotifications,
} from "@/store/slices/helpers";
import type { RestaurantSliceCreator } from "@/store/slices/context";
import type { TableInfo } from "@/types";

const buildTableCodeByPosition = (position: number): string => `M-${(101 + position).toString()}`;
const applySequentialTableCodes = (tables: TableInfo[]): TableInfo[] =>
  tables.map((table, index) => ({
    ...table,
    code: buildTableCodeByPosition(index),
  }));

const reorderTablesByIds = (
  tables: TableInfo[],
  activeTableId: number,
  overTableId: number
): TableInfo[] => {
  const activeIndex = tables.findIndex((table) => table.id === activeTableId);
  const overIndex = tables.findIndex((table) => table.id === overTableId);

  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
    return tables;
  }

  const reorderedTables = [...tables];
  const [movedTable] = reorderedTables.splice(activeIndex, 1);
  reorderedTables.splice(overIndex, 0, movedTable);

  return reorderedTables;
};

export const createAdministrationSlice: RestaurantSliceCreator = (set) => ({
  addTable: (payload) =>
    set((state) => {
      const normalizedName = payload.name.trim();
      if (!normalizedName) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Datos Incompletos",
              "Completa el nombre de la mesa para registrarla.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const newTable = createTable(state.tables, {
        ...payload,
        name: normalizedName,
      });
      const nextTables = applySequentialTableCodes([...state.tables, newTable]);
      const indexedNewTable = nextTables.find((table) => table.id === newTable.id) ?? newTable;

      return {
        tables: nextTables,
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Mesa Registrada",
            `${indexedNewTable.name} (${indexedNewTable.code}) fue agregada al salon.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  updateTable: (tableId, payload) =>
    set((state) => {
      const targetTable = state.tables.find((table) => table.id === tableId);
      if (!targetTable) {
        return {};
      }

      const normalizedName = payload.name.trim();
      if (!normalizedName) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Datos Incompletos",
              "Completa el nombre de la mesa para guardar cambios.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const updatedTables = state.tables.map((table) =>
        table.id === tableId
          ? updateTableData(table, {
              ...payload,
              name: normalizedName,
            })
          : table
      );
      const nextTables = applySequentialTableCodes(updatedTables);

      return {
        tables: nextTables,
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Mesa Actualizada",
            `${payload.name.trim()} fue actualizada correctamente.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  removeTable: (tableId: number) =>
    set((state) => {
      const tableToRemove = state.tables.find((table) => table.id === tableId);
      if (!tableToRemove) {
        return {};
      }

      if (tableToRemove.status === "ocupada" || tableToRemove.status === "reservada") {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Mesa No Disponible",
              `No se puede eliminar ${tableToRemove.name} mientras esté ${tableToRemove.status}.`,
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const hasActiveReservations = state.reservations.some(
        (reservation) =>
          reservation.table === tableId &&
          reservation.status !== "completado"
      );
      const hasKitchenOrders = state.kitchenOrders.some(
        (order) => order.tableId === tableId
      );

      if (hasActiveReservations || hasKitchenOrders) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Mesa En Operacion",
              `No se puede eliminar ${tableToRemove.name} porque tiene servicio activo.`,
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      if (state.tables.length <= 1) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Operacion Bloqueada",
              "Debe existir al menos una mesa registrada en el sistema.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const nextTables = state.tables.filter((table) => table.id !== tableId);
      const normalizedNextTables = applySequentialTableCodes(nextTables);
      const nextServiceTableId =
        state.serviceContext.tableId === tableId
          ? normalizedNextTables[0]?.id ?? state.serviceContext.tableId
          : state.serviceContext.tableId;

      return {
        tables: normalizedNextTables,
        reservations: state.reservations.map((reservation) =>
          reservation.table === tableId ? { ...reservation, table: "---" } : reservation
        ),
        serviceContext: {
          ...state.serviceContext,
          tableId: nextServiceTableId,
        },
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Mesa Eliminada",
            `${tableToRemove.name} (${tableToRemove.code}) fue retirada del plano.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  reorderTables: (activeTableId, overTableId) =>
    set((state) => {
      if (activeTableId === overTableId) {
        return {};
      }

      const reorderedTables = reorderTablesByIds(
        state.tables,
        activeTableId,
        overTableId
      );
      if (reorderedTables === state.tables) {
        return {};
      }

      return {
        tables: applySequentialTableCodes(reorderedTables),
      };
    }),

  createWorkerAccount: (payload) =>
    set((state) => {
      if (isWorkerEmailTaken(state.workers, payload.email)) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Correo Ya Registrado",
              "Ya existe un trabajador con ese correo corporativo.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const worker = createWorkerAccount(payload, "active");

      return {
        workers: [worker, ...state.workers],
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Trabajador Registrado",
            `${worker.fullName} fue creado y validado para operar.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  registerWorkerAccount: (payload) =>
    set((state) => {
      if (isWorkerEmailTaken(state.workers, payload.email)) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Registro Duplicado",
              "Ese correo ya se encuentra registrado en el sistema.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const worker = createPendingWorkerFromRegistration(payload);

      return {
        workers: [worker, ...state.workers],
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "info",
            "Cuenta Pendiente",
            `${worker.fullName} debe ser validado desde Administracion.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  updateWorkerAccount: (workerId, payload) =>
    set((state) => {
      const workerToUpdate = state.workers.find((worker) => worker.id === workerId);
      if (!workerToUpdate) {
        return {};
      }

      if (isWorkerEmailTaken(state.workers, payload.email, workerId)) {
        return {
          notifications: withPrependedNotifications(state.notifications, [
            createNotification(
              "info",
              "Correo No Disponible",
              "El correo indicado ya esta asociado a otro trabajador.",
              false,
              "Ahora",
              { navigateTo: "management" }
            ),
          ]),
        };
      }

      const nextWorkers = state.workers.map((worker) =>
        worker.id === workerId ? updateWorkerAccountData(worker, payload) : worker
      );

      return {
        workers: nextWorkers,
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Trabajador Actualizado",
            `La cuenta de ${payload.fullName} fue actualizada.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  validateWorkerAccount: (workerId) =>
    set((state) => {
      const workerToValidate = state.workers.find((worker) => worker.id === workerId);
      if (!workerToValidate) {
        return {};
      }

      if (workerToValidate.status === "active") {
        return {};
      }

      const validatedAt = new Date().toISOString();

      return {
        workers: state.workers.map((worker) =>
          worker.id === workerId
            ? {
                ...worker,
                status: "active",
                validatedAt: worker.validatedAt ?? validatedAt,
              }
            : worker
        ),
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Cuenta Validada",
            `${workerToValidate.fullName} ya puede iniciar sesion.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),

  removeWorkerAccount: (workerId) =>
    set((state) => {
      const workerToRemove = state.workers.find((worker) => worker.id === workerId);
      if (!workerToRemove) {
        return {};
      }

      if (workerToRemove.role === "admin") {
        const activeAdmins = state.workers.filter(
          (worker) => worker.role === "admin" && worker.status === "active"
        );
        if (activeAdmins.length <= 1) {
          return {
            notifications: withPrependedNotifications(state.notifications, [
              createNotification(
                "info",
                "Operacion Bloqueada",
                "Debe existir al menos un administrador activo en el sistema.",
                false,
                "Ahora",
                { navigateTo: "management" }
              ),
            ]),
          };
        }
      }

      return {
        workers: state.workers.filter((worker) => worker.id !== workerId),
        notifications: withPrependedNotifications(state.notifications, [
          createNotification(
            "success",
            "Cuenta Eliminada",
            `La cuenta de ${workerToRemove.fullName} fue eliminada.`,
            false,
            "Ahora",
            { navigateTo: "management" }
          ),
        ]),
      };
    }),
});

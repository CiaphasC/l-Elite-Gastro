import type {
  TableInfo,
  TableManagementPayload,
  WorkerAccount,
  WorkerAccountPayload,
  WorkerAccountStatus,
  WorkerRegistrationPayload,
} from "@/types";

const createEntityId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

const normalizeText = (value: string): string => value.trim();
const normalizeOptionalDate = (value: string | null | undefined): string | null => {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : null;
};

export const normalizeWorkerEmail = (email: string): string =>
  email.trim().toLowerCase();

export const isWorkerEmailTaken = (
  workers: WorkerAccount[],
  email: string,
  excludedWorkerId?: string
): boolean => {
  const normalizedEmail = normalizeWorkerEmail(email);

  return workers.some(
    (worker) =>
      normalizeWorkerEmail(worker.email) === normalizedEmail &&
      worker.id !== excludedWorkerId
  );
};

const normalizeRole = (role: WorkerRegistrationPayload["role"]): WorkerAccount["role"] =>
  role === "admin" ? "admin" : "waiter";

export const createWorkerAccount = (
  payload: WorkerAccountPayload,
  status: WorkerAccountStatus
): WorkerAccount => {
  const nowIso = new Date().toISOString();
  const createdAt = payload.createdAt.trim() || nowIso;
  const validatedAt =
    status === "active"
      ? normalizeOptionalDate(payload.validatedAt) ?? createdAt
      : null;

  return {
    id: createEntityId("wrk"),
    fullName: normalizeText(payload.fullName),
    email: normalizeWorkerEmail(payload.email),
    password: payload.password,
    role: payload.role,
    status,
    startedAt: payload.startedAt,
    createdAt,
    validatedAt,
  };
};

export const createPendingWorkerFromRegistration = (
  payload: WorkerRegistrationPayload
): WorkerAccount =>
  createWorkerAccount(
    {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: normalizeRole(payload.role),
      startedAt: payload.startedAt,
      createdAt: new Date().toISOString(),
      validatedAt: null,
    },
    "pending"
  );

export const updateWorkerAccountData = (
  worker: WorkerAccount,
  payload: WorkerAccountPayload
): WorkerAccount => {
  const createdAt = payload.createdAt.trim() || worker.createdAt;
  const requestedValidatedAt = normalizeOptionalDate(payload.validatedAt);
  const validatedAt =
    worker.status === "active"
      ? requestedValidatedAt ?? worker.validatedAt ?? createdAt
      : requestedValidatedAt;

  return {
    ...worker,
    fullName: normalizeText(payload.fullName),
    email: normalizeWorkerEmail(payload.email),
    password: payload.password,
    role: payload.role,
    startedAt: payload.startedAt,
    createdAt,
    validatedAt,
  };
};

export const createTable = (
  tables: TableInfo[],
  payload: TableManagementPayload
): TableInfo => {
  const nextId =
    tables.length === 0 ? 100 : Math.max(...tables.map((table) => table.id)) + 1;
  const nowIso = new Date().toISOString();

  return {
    id: nextId,
    name: normalizeText(payload.name),
    code: normalizeText(payload.code).toUpperCase(),
    capacity: Math.max(1, Math.trunc(payload.capacity)),
    status: "disponible",
    guests: 0,
    statusUpdatedAt: nowIso,
  };
};

export const updateTableData = (
  table: TableInfo,
  payload: TableManagementPayload
): TableInfo => ({
  ...table,
  name: normalizeText(payload.name),
  code: normalizeText(payload.code).toUpperCase(),
  capacity: Math.max(1, Math.trunc(payload.capacity)),
});

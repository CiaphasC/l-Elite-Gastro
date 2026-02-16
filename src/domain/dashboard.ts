import type { Client, DashboardSnapshot, SalesRecord } from "@/types";

const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"] as const;

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const toStartOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const toStartOfWeek = (date: Date): Date => {
  const start = toStartOfDay(date);
  const weekday = start.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  start.setDate(start.getDate() - daysFromMonday);
  return start;
};

const toValidDate = (value: string): Date | null => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isWithinRange = (date: Date, rangeStart: Date, rangeEnd: Date): boolean =>
  date.getTime() >= rangeStart.getTime() && date.getTime() < rangeEnd.getTime();

const getSalesTotalInRange = (salesHistory: SalesRecord[], rangeStart: Date, rangeEnd: Date): number =>
  roundMoney(
    salesHistory.reduce((acc, record) => {
      const recordDate = toValidDate(record.createdAt);
      if (!recordDate || !isWithinRange(recordDate, rangeStart, rangeEnd)) {
        return acc;
      }

      return acc + record.amount;
    }, 0)
  );

const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `sale-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

export const createSalesRecord = (amount: number, createdAt = new Date()): SalesRecord => ({
  id: createId(),
  amount: roundMoney(amount),
  createdAt: createdAt.toISOString(),
});

export const buildDashboardSnapshot = (
  clients: Client[],
  salesHistory: SalesRecord[],
  referenceDate = new Date()
): DashboardSnapshot => {
  const startOfDay = toStartOfDay(referenceDate);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const startOfWeek = toStartOfWeek(referenceDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1);

  const salesDay = getSalesTotalInRange(salesHistory, startOfDay, endOfDay);
  const salesWeek = getSalesTotalInRange(salesHistory, startOfWeek, endOfWeek);
  const salesMonth = getSalesTotalInRange(salesHistory, startOfMonth, endOfMonth);

  const weeklyPerformance = Array.from({ length: 7 }, (_, index) => {
    const dayStart = new Date(startOfWeek);
    dayStart.setDate(dayStart.getDate() + index);

    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return {
      label: WEEKDAY_LABELS[dayStart.getDay()],
      amount: getSalesTotalInRange(salesHistory, dayStart, dayEnd),
    };
  });

  const totalClientSpend = clients.reduce((acc, client) => acc + client.spend, 0);
  const diners = clients.length;
  const averageTicket = diners === 0 ? 0 : roundMoney(totalClientSpend / diners);

  return {
    netSales: salesMonth,
    diners,
    averageTicket,
    salesByPeriod: {
      day: salesDay,
      week: salesWeek,
      month: salesMonth,
    },
    weeklyPerformance,
  };
};

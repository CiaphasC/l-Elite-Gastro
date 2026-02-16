import { INITIAL_NOTIFICATIONS } from "@/domain/mockData";
import type { MenuItem, NotificationItem } from "@/types";

const STOCK_ALERT_THRESHOLD = 5;

const createNotificationId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `notif-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

export const withPrependedNotifications = (
  current: NotificationItem[],
  incoming: NotificationItem[]
): NotificationItem[] => [...incoming, ...current].slice(0, 80);

export const createNotification = (
  type: NotificationItem["type"],
  title: string,
  message: string,
  read = false,
  time = "Ahora",
  meta?: NotificationItem["meta"]
): NotificationItem => ({
  id: createNotificationId(),
  type,
  title,
  message,
  time,
  read,
  meta,
});

const resolveStockSeverity = (stock: number): "low" | "critical" | null => {
  if (stock <= 0) {
    return "critical";
  }

  if (stock < STOCK_ALERT_THRESHOLD) {
    return "low";
  }

  return null;
};

export const createStockNotificationForItem = (
  item: MenuItem,
  severity = resolveStockSeverity(item.stock)
): NotificationItem | null => {
  if (!severity) {
    return null;
  }

  if (severity === "critical") {
    return createNotification(
      "stock",
      "Stock Critico",
      `${item.name} esta agotado en inventario.`,
      false,
      "Ahora",
      {
        stockItemId: item.id,
        stockSeverity: "critical",
        navigateTo: "inventory",
      }
    );
  }

  return createNotification(
    "stock",
    "Alerta de Stock",
    `Quedan pocas unidades de ${item.name} (${item.stock} ${item.unit}).`,
    false,
    "Ahora",
    {
      stockItemId: item.id,
      stockSeverity: "low",
      navigateTo: "inventory",
    }
  );
};

export const createStockTransitionNotifications = (
  previousInventory: MenuItem[],
  nextInventory: MenuItem[]
): NotificationItem[] => {
  const notifications: NotificationItem[] = [];

  for (const previousItem of previousInventory) {
    const nextItem = nextInventory.find((item) => item.id === previousItem.id);
    if (!nextItem) {
      continue;
    }

    const previousSeverity = resolveStockSeverity(previousItem.stock);
    const nextSeverity = resolveStockSeverity(nextItem.stock);

    if (nextSeverity && previousSeverity !== nextSeverity) {
      const notification = createStockNotificationForItem(nextItem, nextSeverity);
      if (notification) {
        notifications.push(notification);
      }
    }
  }

  return notifications;
};

export const createStartupNotifications = (inventory: MenuItem[]): NotificationItem[] => [
  ...inventory
    .map((item) => createStockNotificationForItem(item))
    .filter((item): item is NotificationItem => item !== null),
  ...INITIAL_NOTIFICATIONS,
];

const pruneResolvedStockNotifications = (
  notifications: NotificationItem[],
  inventory: MenuItem[]
): NotificationItem[] =>
  notifications.filter((notification) => {
    if (notification.type !== "stock") {
      return true;
    }

    const stockItemId = notification.meta?.stockItemId;
    if (typeof stockItemId !== "number") {
      return true;
    }

    const currentItem = inventory.find((item) => item.id === stockItemId);
    if (!currentItem) {
      return false;
    }

    const currentSeverity = resolveStockSeverity(currentItem.stock);
    if (!currentSeverity) {
      return false;
    }

    const notificationSeverity = notification.meta?.stockSeverity;
    if (!notificationSeverity) {
      return true;
    }

    return notificationSeverity === currentSeverity;
  });

export const withInventoryAwareNotifications = (
  currentNotifications: NotificationItem[],
  incomingNotifications: NotificationItem[],
  inventory: MenuItem[]
): NotificationItem[] =>
  pruneResolvedStockNotifications(
    withPrependedNotifications(currentNotifications, incomingNotifications),
    inventory
  );

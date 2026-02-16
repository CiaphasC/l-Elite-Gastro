import type { RestaurantSliceCreator } from "@/store/slices/context";

export const createNotificationSlice: RestaurantSliceCreator = (set) => ({
  markNotificationAsRead: (notificationId: string) =>
    set((state) => {
      const notification = state.notifications.find((item) => item.id === notificationId);
      const nextActiveTab = notification?.meta?.navigateTo
        ? notification.meta.navigateTo
        : notification?.type === "stock"
          ? "inventory"
          : notification?.type === "vip"
            ? "reservations"
            : notification?.type === "success" || notification?.type === "info"
              ? "kitchen"
              : state.activeTab;
      const nextNotifications =
        notification?.meta?.dismissOnRead === true
          ? state.notifications.filter((item) => item.id !== notificationId)
          : state.notifications.map((item) =>
              item.id === notificationId ? { ...item, read: true } : item
            );

      return {
        notifications: nextNotifications,
        activeTab: nextActiveTab,
        ui: { ...state.ui, showNotificationPanel: false },
      };
    }),

  clearNotifications: () =>
    set(() => ({
      notifications: [],
    })),
});

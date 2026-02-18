import { useMemo } from "react";
import {
  deriveNotificationsByRole,
  deriveUnreadNotificationsCount,
} from "@/domain/selectors";
import Header from "@/features/layout/Header";
import {
  useRestaurantAction,
  useRestaurantShallowSelector,
} from "@/store/hooks";
import type { UserRole } from "@/types";

interface SystemHeaderProps {
  role: UserRole;
  title: string;
  showSearch: boolean;
}

const SystemHeader = ({ role, title, showSearch }: SystemHeaderProps) => {
  const { notifications, showNotificationPanel, searchTerm } = useRestaurantShallowSelector(
    (state) => ({
      notifications: state.notifications,
      showNotificationPanel: state.ui.showNotificationPanel,
      searchTerm: state.searchTerm,
    })
  );

  const setSearchTerm = useRestaurantAction("setSearchTerm");
  const toggleNotificationPanel = useRestaurantAction("toggleNotificationPanel");
  const closeNotificationPanel = useRestaurantAction("closeNotificationPanel");
  const clearNotifications = useRestaurantAction("clearNotifications");
  const markNotificationAsRead = useRestaurantAction("markNotificationAsRead");

  const visibleNotifications = useMemo(
    () => deriveNotificationsByRole(notifications, role),
    [notifications, role]
  );
  const unreadNotificationsCount = useMemo(
    () => deriveUnreadNotificationsCount(visibleNotifications),
    [visibleNotifications]
  );

  return (
    <Header
      role={role}
      title={title}
      showSearch={showSearch}
      notifications={visibleNotifications}
      unreadNotificationsCount={unreadNotificationsCount}
      isNotificationPanelOpen={showNotificationPanel}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      onToggleNotifications={toggleNotificationPanel}
      onCloseNotifications={closeNotificationPanel}
      onClearNotifications={clearNotifications}
      onReadNotification={markNotificationAsRead}
    />
  );
};

export default SystemHeader;

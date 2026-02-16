import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import {
  deriveSelectedClient,
  deriveSelectedKitchenOrder,
  deriveUnreadNotificationsCount,
} from "@/domain/selectors";
import {
  useRestaurantActions,
  useRestaurantShallowSelector,
} from "@/store/hooks";
import { useCartTotals } from "@/shared/hooks/useCartTotals";
import CartPanel from "@/features/cart/CartPanel";
import MobileCartDrawer from "@/features/cart/MobileCartDrawer";
import { featureRegistry } from "@/features/registry";
import Header from "@/features/layout/Header";
import MobileTabNav from "@/features/layout/MobileTabNav";
import Sidebar from "@/features/layout/Sidebar";
import CheckoutModal from "@/features/modals/CheckoutModal";
import KitchenDetailModal from "@/features/modals/KitchenDetailModal";
import KitchenServeModal from "@/features/modals/KitchenServeModal";
import ReservationModal from "@/features/modals/ReservationModal";
import TableConfirmationModal from "@/features/modals/TableConfirmationModal";
import AddInventoryModal from "@/features/modals/AddInventoryModal";
import ClientModal from "@/features/modals/ClientModal";
import ClientDetailView from "@/features/clients/ClientDetailView";
import OrderTakingInterface from "@/features/orders/OrderTakingInterface";

interface RestaurantSystemProps {
  onLogout: () => void;
}

const RestaurantSystem = ({ onLogout }: RestaurantSystemProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const isLogoutTransitionRunningRef = useRef(false);

  const actions = useRestaurantActions();
  const {
    activeTab,
    currencyCode,
    searchTerm,
    notifications,
    cart,
    serviceContext,
    tables,
    kitchenOrders,
    inventory,
    clients,
    inventoryMainTab,
    kitchenInventoryTab,
    orderTakingContext,
    ui,
  } = useRestaurantShallowSelector((state) => ({
    activeTab: state.activeTab,
    currencyCode: state.currencyCode,
    searchTerm: state.searchTerm,
    notifications: state.notifications,
    cart: state.cart,
    serviceContext: state.serviceContext,
    tables: state.tables,
    kitchenOrders: state.kitchenOrders,
    inventory: state.inventory,
    clients: state.clients,
    inventoryMainTab: state.inventoryMainTab,
    kitchenInventoryTab: state.kitchenInventoryTab,
    orderTakingContext: state.orderTakingContext,
    ui: state.ui,
  }));

  const {
    showCheckout,
    showReservationModal,
    reservationEditingId,
    reservationPrefill,
    kitchenModalType,
    selectedOrderId,
    showNotificationPanel,
    showInventoryCreateModal,
    confirmationModal,
    clientModal,
    selectedClientId,
  } = ui;

  useEffect(() => {
    if (!rootRef.current || !mainContentRef.current) {
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .to(rootRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.95,
        ease: "power2.out",
      })
      .fromTo(
        mainContentRef.current,
        { opacity: 0, y: 20, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
        "-=0.65"
      );

    return () => {
      timeline.kill();
    };
  }, []);

  const handleLogout = () => {
    if (isLogoutTransitionRunningRef.current) {
      return;
    }

    if (!rootRef.current) {
      onLogout();
      return;
    }

    isLogoutTransitionRunningRef.current = true;
    gsap.killTweensOf(rootRef.current);

    gsap.to(rootRef.current, {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.985,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: () => {
        isLogoutTransitionRunningRef.current = false;
        onLogout();
      },
    });
  };

  const unreadNotificationsCount = useMemo(
    () => deriveUnreadNotificationsCount(notifications),
    [notifications]
  );
  const cartTotals = useCartTotals(cart);
  const selectedKitchenOrder = useMemo(
    () => deriveSelectedKitchenOrder(kitchenOrders, selectedOrderId),
    [kitchenOrders, selectedOrderId]
  );
  const selectedClient = useMemo(
    () => deriveSelectedClient(clients, selectedClientId),
    [clients, selectedClientId]
  );
  const activeFeature = featureRegistry[activeTab];
  const editingClient =
    typeof clientModal.targetClientId === "number"
      ? clients.find((client) => client.id === clientModal.targetClientId) ?? null
      : null;
  const reservationModalKey = `reservation-${
    showReservationModal
      ? `${reservationEditingId ?? "new"}-${JSON.stringify(reservationPrefill ?? {})}`
      : "closed"
  }`;
  const clientModalKey = `client-${clientModal.isOpen ? "open" : "closed"}-${clientModal.mode}-${clientModal.targetClientId ?? "new"}-${clientModal.targetSegment}`;

  if (selectedClient) {
    return (
      <div className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300">
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        </div>

        <main className="relative z-10 h-full flex-1">
          <ClientDetailView
            client={selectedClient}
            currencyCode={currencyCode}
            onBack={actions.closeClientDetail}
          />
        </main>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300 opacity-0 [filter:blur(14px)] [transform:scale(1.01)]"
    >
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
      </div>

      <Sidebar activeTab={activeTab} onTabChange={actions.setActiveTab} onLogout={handleLogout} />

      <main
        ref={mainContentRef}
        className="custom-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:p-10 lg:pb-10"
      >
        <Header
          title={activeFeature.title}
          showSearch={activeFeature.searchEnabled}
          notifications={notifications}
          unreadNotificationsCount={unreadNotificationsCount}
          isNotificationPanelOpen={showNotificationPanel}
          searchTerm={searchTerm}
          onSearchTermChange={actions.setSearchTerm}
          onToggleNotifications={actions.toggleNotificationPanel}
          onCloseNotifications={actions.closeNotificationPanel}
          onClearNotifications={actions.clearNotifications}
          onReadNotification={actions.markNotificationAsRead}
        />
        <MobileTabNav activeTab={activeTab} onTabChange={actions.setActiveTab} />
        {activeFeature.render()}
      </main>

      <CartPanel
        cartItems={cart}
        currencyCode={currencyCode}
        subtotal={cartTotals.subtotal}
        serviceFee={cartTotals.serviceFee}
        total={cartTotals.total}
        serviceContext={serviceContext}
        tables={tables}
        onClearCart={actions.clearCart}
        onUpdateQty={actions.updateCartQty}
        onOpenCheckout={actions.openCheckout}
        onSelectTable={actions.setServiceTable}
      />

      <MobileCartDrawer
        cartItems={cart}
        currencyCode={currencyCode}
        itemCount={cartTotals.itemCount}
        subtotal={cartTotals.subtotal}
        serviceFee={cartTotals.serviceFee}
        total={cartTotals.total}
        onClearCart={actions.clearCart}
        onUpdateQty={actions.updateCartQty}
        onOpenCheckout={actions.openCheckout}
      />

      <CheckoutModal
        isOpen={showCheckout}
        currencyCode={currencyCode}
        total={cartTotals.total}
        onClose={actions.closeCheckout}
        onConfirm={actions.confirmCheckout}
      />

      <KitchenServeModal
        order={kitchenModalType === "kitchen-serve" ? selectedKitchenOrder : null}
        onClose={actions.closeKitchenModal}
        onConfirm={() => actions.completeKitchenOrder(selectedKitchenOrder?.id)}
      />

      <KitchenDetailModal
        order={kitchenModalType === "kitchen-detail" ? selectedKitchenOrder : null}
        currencyCode={currencyCode}
        onClose={actions.closeKitchenModal}
        onMarkToServe={() => {
          if (selectedKitchenOrder) {
            actions.openKitchenModal("kitchen-serve", selectedKitchenOrder.id);
          }
        }}
      />

      <ReservationModal
        key={reservationModalKey}
        isOpen={showReservationModal}
        tables={tables}
        prefill={reservationPrefill}
        mode={reservationEditingId ? "edit" : "create"}
        onClose={actions.closeReservationModal}
        onSubmitReservation={actions.addReservation}
      />

      <ClientModal
        key={clientModalKey}
        isOpen={clientModal.isOpen}
        mode={clientModal.mode}
        segment={clientModal.targetSegment}
        initialClient={editingClient}
        onClose={actions.closeClientModal}
        onSubmit={actions.saveClient}
      />

      <AddInventoryModal
        isOpen={showInventoryCreateModal}
        inventoryMainTab={inventoryMainTab}
        kitchenInventoryTab={kitchenInventoryTab}
        onClose={actions.closeInventoryCreateModal}
        onSubmit={actions.addInventoryItem}
      />

      <TableConfirmationModal
        modalState={confirmationModal}
        onClose={actions.closeTableConfirmation}
        onConfirm={actions.confirmTableAction}
      />

      {orderTakingContext && (
        <OrderTakingInterface
          context={orderTakingContext}
          inventory={inventory}
          kitchenOrders={kitchenOrders}
          currencyCode={currencyCode}
          onCancel={actions.cancelOrderTaking}
          onConfirmOrder={actions.confirmOrderTaking}
        />
      )}
    </div>
  );
};

export default RestaurantSystem;

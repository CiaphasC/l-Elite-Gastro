import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useRestaurantStore } from "@/app/useRestaurantStore";
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
import ClientDetailModal from "@/features/modals/ClientDetailModal";
import OrderTakingInterface from "@/features/orders/OrderTakingInterface";

interface RestaurantSystemProps {
  onLogout: () => void;
}

const RestaurantSystem = ({ onLogout }: RestaurantSystemProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const isLogoutTransitionRunningRef = useRef(false);
  const { state, actions, derived } = useRestaurantStore();

  useEffect(() => {
    actions.finishBoot();
  }, [actions]);

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

  const selectedKitchenOrder = derived.selectedKitchenOrder;
  const selectedClient = derived.selectedClient;
  const activeFeature = featureRegistry[state.activeTab];
  const editingClient =
    typeof state.ui.clientModal.targetClientId === "number"
      ? state.clients.find((client) => client.id === state.ui.clientModal.targetClientId) ?? null
      : null;
  const reservationModalKey = `reservation-${state.ui.showReservationModal ? JSON.stringify(state.ui.reservationPrefill ?? {}) : "closed"}`;
  const clientModalKey = `client-${state.ui.clientModal.isOpen ? "open" : "closed"}-${state.ui.clientModal.mode}-${state.ui.clientModal.targetClientId ?? "new"}-${state.ui.clientModal.targetSegment}`;

  return (
    <div
      ref={rootRef}
      className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300 opacity-0 [filter:blur(14px)] [transform:scale(1.01)]"
    >
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
      </div>

      <Sidebar activeTab={state.activeTab} onTabChange={actions.setActiveTab} onLogout={handleLogout} />

      <main
        ref={mainContentRef}
        className="custom-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:p-10 lg:pb-10"
      >
        <Header
          title={activeFeature.title}
          showSearch={activeFeature.searchEnabled}
          notifications={state.notifications}
          unreadNotificationsCount={derived.unreadNotificationsCount}
          isNotificationPanelOpen={state.ui.showNotificationPanel}
          searchTerm={state.searchTerm}
          onSearchTermChange={actions.setSearchTerm}
          onToggleNotifications={actions.toggleNotificationPanel}
          onCloseNotifications={actions.closeNotificationPanel}
          onClearNotifications={actions.clearNotifications}
          onReadNotification={actions.markNotificationAsRead}
        />
        <MobileTabNav activeTab={state.activeTab} onTabChange={actions.setActiveTab} />
        {activeFeature.render({ state, actions, derived })}
      </main>

      <CartPanel
        cartItems={state.cart}
        currencyCode={state.currencyCode}
        subtotal={derived.cartSubtotal}
        serviceFee={derived.cartServiceFee}
        total={derived.cartTotal}
        serviceContext={state.serviceContext}
        onClearCart={actions.clearCart}
        onUpdateQty={actions.updateCartQty}
        onOpenCheckout={actions.openCheckout}
      />

      <MobileCartDrawer
        cartItems={state.cart}
        currencyCode={state.currencyCode}
        itemCount={derived.cartItemsCount}
        subtotal={derived.cartSubtotal}
        serviceFee={derived.cartServiceFee}
        total={derived.cartTotal}
        onClearCart={actions.clearCart}
        onUpdateQty={actions.updateCartQty}
        onOpenCheckout={actions.openCheckout}
      />

      <CheckoutModal
        isOpen={state.ui.showCheckout}
        currencyCode={state.currencyCode}
        total={derived.cartTotal}
        onClose={actions.closeCheckout}
        onConfirm={actions.confirmCheckout}
      />

      <KitchenServeModal
        order={state.ui.kitchenModalType === "kitchen-serve" ? selectedKitchenOrder : null}
        onClose={actions.closeKitchenModal}
        onConfirm={() => actions.completeKitchenOrder(selectedKitchenOrder?.id)}
      />

      <KitchenDetailModal
        order={state.ui.kitchenModalType === "kitchen-detail" ? selectedKitchenOrder : null}
        onClose={actions.closeKitchenModal}
        onMarkToServe={() => {
          if (selectedKitchenOrder) {
            actions.openKitchenModal("kitchen-serve", selectedKitchenOrder.id);
          }
        }}
      />

      <ReservationModal
        key={reservationModalKey}
        isOpen={state.ui.showReservationModal}
        tables={state.tables}
        prefill={state.ui.reservationPrefill}
        onClose={actions.closeReservationModal}
        onSubmitReservation={actions.addReservation}
      />

      <ClientModal
        key={clientModalKey}
        isOpen={state.ui.clientModal.isOpen}
        mode={state.ui.clientModal.mode}
        segment={state.ui.clientModal.targetSegment}
        initialClient={editingClient}
        onClose={actions.closeClientModal}
        onSubmit={actions.saveClient}
      />

      <ClientDetailModal
        client={selectedClient}
        currencyCode={state.currencyCode}
        onClose={actions.closeClientDetail}
      />

      <AddInventoryModal
        isOpen={state.ui.showInventoryCreateModal}
        inventoryMainTab={state.inventoryMainTab}
        kitchenInventoryTab={state.kitchenInventoryTab}
        onClose={actions.closeInventoryCreateModal}
        onSubmit={actions.addInventoryItem}
      />

      <TableConfirmationModal
        modalState={state.ui.confirmationModal}
        onClose={actions.closeTableConfirmation}
        onConfirm={actions.confirmTableAction}
      />

      {state.orderTakingContext && (
        <OrderTakingInterface
          context={state.orderTakingContext}
          inventory={state.inventory}
          kitchenOrders={state.kitchenOrders}
          currencyCode={state.currencyCode}
          onCancel={actions.cancelOrderTaking}
          onConfirmOrder={actions.confirmOrderTaking}
        />
      )}
    </div>
  );
};

export default RestaurantSystem;

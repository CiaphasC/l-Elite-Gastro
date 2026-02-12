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
import LoadingScreen from "@/shared/components/LoadingScreen";

const App = () => {
  const mainContentRef = useRef<HTMLElement | null>(null);
  const { state, actions, derived } = useRestaurantStore();

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      actions.finishBoot();
    }, 900);

    return () => window.clearTimeout(bootTimer);
  }, [actions]);

  useEffect(() => {
    if (state.ui.isLoading || !mainContentRef.current) {
      return;
    }

    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 20, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.65, ease: "power3.out" }
    );
  }, [state.ui.isLoading]);

  if (state.ui.isLoading) {
    return <LoadingScreen />;
  }

  const selectedKitchenOrder = derived.selectedKitchenOrder;
  const activeFeature = featureRegistry[state.activeTab];

  return (
    <div className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300">
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
      </div>

      <Sidebar activeTab={state.activeTab} onTabChange={actions.setActiveTab} />

      <main
        ref={mainContentRef}
        className="custom-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:p-10 lg:pb-10"
      >
        <Header
          title={activeFeature.title}
          showSearch={activeFeature.searchEnabled}
          notifications={state.notifications}
          searchTerm={state.searchTerm}
          onSearchTermChange={actions.setSearchTerm}
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
        isOpen={state.ui.showReservationModal}
        onClose={actions.closeReservationModal}
        onSubmitReservation={actions.addReservation}
      />
    </div>
  );
};

export default App;

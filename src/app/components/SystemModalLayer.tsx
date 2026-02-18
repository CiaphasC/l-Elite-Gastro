import { useMemo } from "react";
import { deriveSelectedKitchenOrder } from "@/domain/selectors";
import AddInventoryModal from "@/features/modals/AddInventoryModal";
import CheckoutModal from "@/features/modals/CheckoutModal";
import ClientModal from "@/features/modals/ClientModal";
import KitchenDetailModal from "@/features/modals/KitchenDetailModal";
import KitchenServeModal from "@/features/modals/KitchenServeModal";
import ReservationModal from "@/features/modals/ReservationModal";
import TableConfirmationModal from "@/features/modals/TableConfirmationModal";
import OrderTakingInterface from "@/features/orders/OrderTakingInterface";
import { useCartTotals } from "@/shared/hooks/useCartTotals";
import {
  useRestaurantAction,
  useRestaurantShallowSelector,
} from "@/store/hooks";

const SharedModalLayer = () => {
  const {
    currencyCode,
    tables,
    inventory,
    kitchenOrders,
    orderTakingContext,
    showReservationModal,
    reservationEditingId,
    reservationPrefill,
    confirmationModal,
  } = useRestaurantShallowSelector((state) => ({
    currencyCode: state.currencyCode,
    tables: state.tables,
    inventory: state.inventory,
    kitchenOrders: state.kitchenOrders,
    orderTakingContext: state.orderTakingContext,
    showReservationModal: state.ui.showReservationModal,
    reservationEditingId: state.ui.reservationEditingId,
    reservationPrefill: state.ui.reservationPrefill,
    confirmationModal: state.ui.confirmationModal,
  }));

  const closeReservationModal = useRestaurantAction("closeReservationModal");
  const addReservation = useRestaurantAction("addReservation");
  const closeTableConfirmation = useRestaurantAction("closeTableConfirmation");
  const confirmTableAction = useRestaurantAction("confirmTableAction");
  const cancelOrderTaking = useRestaurantAction("cancelOrderTaking");
  const confirmOrderTaking = useRestaurantAction("confirmOrderTaking");

  const reservationModalKey = `reservation-${
    showReservationModal
      ? `${reservationEditingId ?? "new"}-${JSON.stringify(reservationPrefill ?? {})}`
      : "closed"
  }`;

  return (
    <>
      <ReservationModal
        key={reservationModalKey}
        isOpen={showReservationModal}
        tables={tables}
        prefill={reservationPrefill}
        mode={reservationEditingId ? "edit" : "create"}
        onClose={closeReservationModal}
        onSubmitReservation={addReservation}
      />

      <TableConfirmationModal
        modalState={confirmationModal}
        onClose={closeTableConfirmation}
        onConfirm={confirmTableAction}
      />

      {orderTakingContext && (
        <OrderTakingInterface
          context={orderTakingContext}
          inventory={inventory}
          kitchenOrders={kitchenOrders}
          currencyCode={currencyCode}
          onCancel={cancelOrderTaking}
          onConfirmOrder={confirmOrderTaking}
        />
      )}
    </>
  );
};

const AdminModalLayer = () => {
  const {
    currencyCode,
    cart,
    kitchenOrders,
    clients,
    inventoryMainTab,
    kitchenInventoryTab,
    showCheckout,
    kitchenModalType,
    selectedOrderId,
    showInventoryCreateModal,
    clientModal,
  } = useRestaurantShallowSelector((state) => ({
    currencyCode: state.currencyCode,
    cart: state.cart,
    kitchenOrders: state.kitchenOrders,
    clients: state.clients,
    inventoryMainTab: state.inventoryMainTab,
    kitchenInventoryTab: state.kitchenInventoryTab,
    showCheckout: state.ui.showCheckout,
    kitchenModalType: state.ui.kitchenModalType,
    selectedOrderId: state.ui.selectedOrderId,
    showInventoryCreateModal: state.ui.showInventoryCreateModal,
    clientModal: state.ui.clientModal,
  }));

  const closeCheckout = useRestaurantAction("closeCheckout");
  const confirmCheckout = useRestaurantAction("confirmCheckout");
  const closeKitchenModal = useRestaurantAction("closeKitchenModal");
  const completeKitchenOrder = useRestaurantAction("completeKitchenOrder");
  const openKitchenModal = useRestaurantAction("openKitchenModal");
  const closeClientModal = useRestaurantAction("closeClientModal");
  const saveClient = useRestaurantAction("saveClient");
  const closeInventoryCreateModal = useRestaurantAction("closeInventoryCreateModal");
  const addInventoryItem = useRestaurantAction("addInventoryItem");

  const selectedKitchenOrder = useMemo(
    () => deriveSelectedKitchenOrder(kitchenOrders, selectedOrderId),
    [kitchenOrders, selectedOrderId]
  );
  const editingClient = useMemo(
    () =>
      typeof clientModal.targetClientId === "number"
        ? clients.find((client) => client.id === clientModal.targetClientId) ?? null
        : null,
    [clientModal.targetClientId, clients]
  );
  const clientModalKey = `client-${
    clientModal.isOpen ? "open" : "closed"
  }-${clientModal.mode}-${clientModal.targetClientId ?? "new"}-${
    clientModal.targetSegment
  }`;

  const cartTotals = useCartTotals(cart);

  return (
    <>
      <CheckoutModal
        isOpen={showCheckout}
        currencyCode={currencyCode}
        total={cartTotals.total}
        onClose={closeCheckout}
        onConfirm={confirmCheckout}
      />

      <KitchenServeModal
        order={kitchenModalType === "kitchen-serve" ? selectedKitchenOrder : null}
        onClose={closeKitchenModal}
        onConfirm={() => completeKitchenOrder(selectedKitchenOrder?.id)}
      />

      <KitchenDetailModal
        order={kitchenModalType === "kitchen-detail" ? selectedKitchenOrder : null}
        currencyCode={currencyCode}
        onClose={closeKitchenModal}
        onMarkToServe={() => {
          if (selectedKitchenOrder) {
            openKitchenModal("kitchen-serve", selectedKitchenOrder.id);
          }
        }}
      />

      <ClientModal
        key={clientModalKey}
        isOpen={clientModal.isOpen}
        mode={clientModal.mode}
        segment={clientModal.targetSegment}
        initialClient={editingClient}
        onClose={closeClientModal}
        onSubmit={saveClient}
      />

      <AddInventoryModal
        isOpen={showInventoryCreateModal}
        inventoryMainTab={inventoryMainTab}
        kitchenInventoryTab={kitchenInventoryTab}
        onClose={closeInventoryCreateModal}
        onSubmit={addInventoryItem}
      />
    </>
  );
};

interface SystemModalLayerProps {
  isAdmin: boolean;
}

const SystemModalLayer = ({ isAdmin }: SystemModalLayerProps) => (
  <>
    <SharedModalLayer />
    {isAdmin && <AdminModalLayer />}
  </>
);

export default SystemModalLayer;

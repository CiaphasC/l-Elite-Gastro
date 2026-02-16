import { memo } from "react";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import ReservationsView from "@/features/reservations/ReservationsView";
import type { ReservationPayload } from "@/types";

const ReservationsFeatureContent = memo(() => {
  const { reservations, tables } = useRestaurantShallowSelector((state) => ({
    reservations: state.reservations,
    tables: state.tables,
  }));
  const { openReservationModal, assignReservationTable, startOrderTaking } = useRestaurantActions();

  const handleEditReservation = (reservationId: string, payload: ReservationPayload) => {
    openReservationModal(payload, reservationId);
  };

  return (
    <ReservationsView
      reservations={reservations}
      tables={tables}
      onOpenNewReservation={() => openReservationModal()}
      onEditReservation={(reservation) =>
        handleEditReservation(reservation.id, {
          name: reservation.name,
          time: reservation.time,
          guests: reservation.guests,
          type: reservation.type,
          table: reservation.table,
        })
      }
      onAssignTable={assignReservationTable}
      onStartService={startOrderTaking}
    />
  );
});

ReservationsFeatureContent.displayName = "ReservationsFeatureContent";

export default ReservationsFeatureContent;

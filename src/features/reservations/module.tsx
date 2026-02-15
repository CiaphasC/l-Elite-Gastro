import { CalendarDays } from "lucide-react";
import ReservationsView from "@/features/reservations/ReservationsView";
import type { FeatureModule } from "@/features/types";
import type { ReservationPayload } from "@/types";

export const reservationsFeatureModule: FeatureModule = {
  id: "reservations",
  title: "Agenda de Reservas",
  navLabel: "Reservas",
  shortLabel: "Reservas",
  searchEnabled: false,
  Icon: CalendarDays,
  render: ({ state, actions }) => {
    const handleEditReservation = (reservationId: string, payload: ReservationPayload) => {
      actions.openReservationModal(payload, reservationId);
    };

    return (
      <ReservationsView
        reservations={state.reservations}
        tables={state.tables}
        onOpenNewReservation={() => actions.openReservationModal()}
        onEditReservation={(reservation) =>
          handleEditReservation(reservation.id, {
            name: reservation.name,
            time: reservation.time,
            guests: reservation.guests,
            type: reservation.type,
            table: reservation.table,
          })
        }
        onAssignTable={actions.assignReservationTable}
        onStartService={actions.startOrderTaking}
      />
    );
  },
};

import { CalendarDays } from "lucide-react";
import ReservationsView from "@/features/reservations/ReservationsView";
import type { FeatureModule } from "@/features/types";

export const reservationsFeatureModule: FeatureModule = {
  id: "reservations",
  title: "Agenda de Reservas",
  navLabel: "Reservas",
  shortLabel: "Reservas",
  searchEnabled: false,
  Icon: CalendarDays,
  render: ({ state, actions }) => (
    <ReservationsView
      reservations={state.reservations}
      onOpenNewReservation={actions.openReservationModal}
    />
  ),
};

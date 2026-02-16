import { CalendarDays } from "lucide-react";
import ReservationsFeatureContent from "@/features/reservations/ReservationsFeatureContent";
import type { FeatureModule } from "@/features/types";

export const reservationsFeatureModule: FeatureModule = {
  id: "reservations",
  title: "Agenda de Reservas",
  navLabel: "Reservas",
  shortLabel: "Reservas",
  searchEnabled: false,
  Icon: CalendarDays,
  render: () => <ReservationsFeatureContent />,
};

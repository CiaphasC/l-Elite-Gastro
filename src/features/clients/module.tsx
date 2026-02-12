import { UserCheck } from "lucide-react";
import ClientsView from "@/features/clients/ClientsView";
import type { FeatureModule } from "@/features/types";

export const clientsFeatureModule: FeatureModule = {
  id: "clients",
  title: "Cartera de Clientes",
  navLabel: "Clientes",
  shortLabel: "Clientes",
  searchEnabled: true,
  Icon: UserCheck,
  render: ({ state, derived }) => (
    <ClientsView clients={derived.filteredClients} currencyCode={state.currencyCode} />
  ),
};

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
  render: ({ state, actions, derived }) => (
    <ClientsView
      clients={derived.filteredClients}
      currencyCode={state.currencyCode}
      filter={state.clientFilter}
      viewMode={state.clientViewMode}
      onFilterChange={actions.setClientFilter}
      onViewModeChange={actions.setClientViewMode}
      onCreateClient={actions.openClientModal}
      onOpenClientDetail={actions.openClientDetail}
      onEditClient={actions.openClientModal}
    />
  ),
};

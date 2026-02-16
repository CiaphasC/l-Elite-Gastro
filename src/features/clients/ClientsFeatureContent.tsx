import { memo, useMemo } from "react";
import { filterClients } from "@/domain/selectors";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import ClientsView from "@/features/clients/ClientsView";

const ClientsFeatureContent = memo(() => {
  const { clients, filter, viewMode, searchTerm, currencyCode } =
    useRestaurantShallowSelector((state) => ({
      clients: state.clients,
      filter: state.clientFilter,
      viewMode: state.clientViewMode,
      searchTerm: state.searchTerm,
      currencyCode: state.currencyCode,
    }));
  const { setClientFilter, setClientViewMode, openClientModal, openClientDetail } =
    useRestaurantActions();

  const filteredClients = useMemo(
    () => filterClients(clients, filter, searchTerm),
    [clients, filter, searchTerm]
  );

  return (
    <ClientsView
      clients={filteredClients}
      currencyCode={currencyCode}
      filter={filter}
      viewMode={viewMode}
      onFilterChange={setClientFilter}
      onViewModeChange={setClientViewMode}
      onCreateClient={openClientModal}
      onOpenClientDetail={openClientDetail}
      onEditClient={openClientModal}
    />
  );
});

ClientsFeatureContent.displayName = "ClientsFeatureContent";

export default ClientsFeatureContent;

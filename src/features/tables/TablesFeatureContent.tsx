import { memo } from "react";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import TablesView from "@/features/tables/TablesView";

const TablesFeatureContent = memo(() => {
  const { tables, reservations } = useRestaurantShallowSelector((state) => ({
    tables: state.tables,
    reservations: state.reservations,
  }));
  const { openTableConfirmation, openReservationModal } = useRestaurantActions();

  return (
    <TablesView
      tables={tables}
      reservations={reservations}
      onRequestTableAction={openTableConfirmation}
      onOpenReservationFromTable={(tableId) => openReservationModal({ table: tableId })}
    />
  );
});

TablesFeatureContent.displayName = "TablesFeatureContent";

export default TablesFeatureContent;

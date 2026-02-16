import { memo } from "react";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import ManagementView from "@/features/management/ManagementView";

const ManagementFeatureContent = memo(() => {
  const { tables, workers } = useRestaurantShallowSelector((state) => ({
    tables: state.tables,
    workers: state.workers,
  }));
  const {
    addTable,
    updateTable,
    removeTable,
    reorderTables,
    createWorkerAccount,
    updateWorkerAccount,
    validateWorkerAccount,
    removeWorkerAccount,
  } = useRestaurantActions();

  return (
    <ManagementView
      tables={tables}
      workers={workers}
      onAddTable={addTable}
      onUpdateTable={updateTable}
      onRemoveTable={removeTable}
      onReorderTables={reorderTables}
      onCreateWorker={createWorkerAccount}
      onUpdateWorker={updateWorkerAccount}
      onValidateWorker={validateWorkerAccount}
      onRemoveWorker={removeWorkerAccount}
    />
  );
});

ManagementFeatureContent.displayName = "ManagementFeatureContent";

export default ManagementFeatureContent;

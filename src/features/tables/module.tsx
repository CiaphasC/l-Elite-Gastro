import { Grid2X2 } from "lucide-react";
import TablesView from "@/features/tables/TablesView";
import type { FeatureModule } from "@/features/types";

export const tablesFeatureModule: FeatureModule = {
  id: "tables",
  title: "Gestion de Sala",
  navLabel: "Salon",
  shortLabel: "Salon",
  searchEnabled: false,
  Icon: Grid2X2,
  render: ({ state }) => <TablesView tables={state.tables} />,
};

import { Grid2X2 } from "lucide-react";
import TablesFeatureContent from "@/features/tables/TablesFeatureContent";
import type { FeatureModule } from "@/features/types";

export const tablesFeatureModule: FeatureModule = {
  id: "tables",
  title: "Gestion de Sala",
  navLabel: "Salon",
  shortLabel: "Salon",
  searchEnabled: false,
  Icon: Grid2X2,
  render: () => <TablesFeatureContent />,
};

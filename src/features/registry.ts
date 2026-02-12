import { dashboardFeatureModule } from "@/features/dashboard/module";
import { menuFeatureModule } from "@/features/menu/module";
import { tablesFeatureModule } from "@/features/tables/module";
import { reservationsFeatureModule } from "@/features/reservations/module";
import { kitchenFeatureModule } from "@/features/kitchen/module";
import { clientsFeatureModule } from "@/features/clients/module";
import { inventoryFeatureModule } from "@/features/inventory/module";
import { settingsFeatureModule } from "@/features/settings/module";
import type { FeatureModule } from "@/features/types";
import type { ActiveTab } from "@/types";

export const orderedFeatureModules: readonly FeatureModule[] = [
  dashboardFeatureModule,
  menuFeatureModule,
  tablesFeatureModule,
  reservationsFeatureModule,
  kitchenFeatureModule,
  clientsFeatureModule,
  inventoryFeatureModule,
  settingsFeatureModule,
];

export const featureRegistry = Object.fromEntries(
  orderedFeatureModules.map((featureModule) => [featureModule.id, featureModule])
) as Record<ActiveTab, FeatureModule>;

export const primaryNavigationModules = orderedFeatureModules.filter(
  (featureModule) => featureModule.id !== "settings"
);

export const settingsNavigationModule = featureRegistry.settings;

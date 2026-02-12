import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ActiveTab, RestaurantActions, RestaurantDerived, RestaurantState } from "@/types";

export interface FeatureRenderContext {
  state: RestaurantState;
  actions: RestaurantActions;
  derived: RestaurantDerived;
}

export interface FeatureModule {
  id: ActiveTab;
  title: string;
  navLabel: string;
  shortLabel: string;
  searchEnabled: boolean;
  Icon: LucideIcon;
  render: (context: FeatureRenderContext) => ReactNode;
}

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { ActiveTab } from "@/types";

export interface FeatureModule {
  id: ActiveTab;
  title: string;
  navLabel: string;
  shortLabel: string;
  searchEnabled: boolean;
  Icon: LucideIcon;
  render: () => ReactNode;
}

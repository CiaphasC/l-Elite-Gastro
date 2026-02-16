import { UserCheck } from "lucide-react";
import ClientsFeatureContent from "@/features/clients/ClientsFeatureContent";
import type { FeatureModule } from "@/features/types";

export const clientsFeatureModule: FeatureModule = {
  id: "clients",
  title: "Cartera de Clientes",
  navLabel: "Clientes",
  shortLabel: "Clientes",
  searchEnabled: true,
  Icon: UserCheck,
  render: () => <ClientsFeatureContent />,
};

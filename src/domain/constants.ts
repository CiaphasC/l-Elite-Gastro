import {
  MENU_CATEGORY_VALUES,
  RESERVATION_TYPE_VALUES,
  type ActiveTab,
  type MenuCategory,
  type ReservationType,
} from "@/types";

export const INITIAL_ACTIVE_TAB: ActiveTab = "menu";
export const APP_BRAND_NAME = "L'Élite Gastro";

export const MENU_CATEGORIES: readonly MenuCategory[] = MENU_CATEGORY_VALUES;
export const MENU_CATEGORY_PRIORITY: readonly MenuCategory[] = [
  "Entrantes",
  "Principales",
  "Guarniciones",
  "Postres",
  "Vinos",
  "Coctelería",
  "Cervezas",
  "Licores",
  "Refrescos",
  "Carnes",
  "Pescados",
  "Verduras",
  "Frutas",
  "Lácteos",
  "Secos",
  "Aceites",
  "Especias",
];

export const RESERVATION_TYPES: readonly ReservationType[] = RESERVATION_TYPE_VALUES;


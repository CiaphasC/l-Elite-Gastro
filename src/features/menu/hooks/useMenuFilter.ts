import { useMemo } from "react";
import { deriveMenuCategoriesFromInventory, filterMenuItems } from "@/domain/selectors";
import type { MenuCategory, MenuItem } from "@/types";

interface UseMenuFilterParams {
  inventory: MenuItem[];
  selectedCategory: MenuCategory;
  searchTerm: string;
}

interface MenuFilterSnapshot {
  categories: MenuCategory[];
  effectiveSelectedCategory: MenuCategory;
  filteredItems: MenuItem[];
}

const FALLBACK_CATEGORY: MenuCategory = "Entrantes";

export const useMenuFilter = ({
  inventory,
  selectedCategory,
  searchTerm,
}: UseMenuFilterParams): MenuFilterSnapshot => {
  const categories = useMemo(() => deriveMenuCategoriesFromInventory(inventory), [inventory]);

  const effectiveSelectedCategory = useMemo(() => {
    if (categories.includes(selectedCategory)) {
      return selectedCategory;
    }

    return categories[0] ?? FALLBACK_CATEGORY;
  }, [categories, selectedCategory]);

  const filteredItems = useMemo(
    () => filterMenuItems(inventory, effectiveSelectedCategory, searchTerm),
    [inventory, effectiveSelectedCategory, searchTerm]
  );

  return {
    categories,
    effectiveSelectedCategory,
    filteredItems,
  };
};

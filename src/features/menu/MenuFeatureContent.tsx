import { memo } from "react";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import { useMenuFilter } from "@/features/menu/hooks/useMenuFilter";
import MenuView from "@/features/menu/MenuView";

const MenuFeatureContent = memo(() => {
  const { inventory, selectedCategory, searchTerm, currencyCode } =
    useRestaurantShallowSelector((state) => ({
      inventory: state.inventory,
      selectedCategory: state.selectedCategory,
      searchTerm: state.searchTerm,
      currencyCode: state.currencyCode,
    }));
  const { setSelectedCategory, addToCart } = useRestaurantActions();
  const { categories, effectiveSelectedCategory, filteredItems } = useMenuFilter({
    inventory,
    selectedCategory,
    searchTerm,
  });

  return (
    <MenuView
      categories={categories}
      selectedCategory={effectiveSelectedCategory}
      currencyCode={currencyCode}
      onSelectCategory={setSelectedCategory}
      items={filteredItems}
      onAddToCart={addToCart}
    />
  );
});

MenuFeatureContent.displayName = "MenuFeatureContent";

export default MenuFeatureContent;

import { Plus } from "lucide-react";
import { MENU_CATEGORIES } from "@/domain/constants";
import type { MenuCategory, MenuItem, SupportedCurrencyCode } from "@/types";
import { formatCurrency } from "@/shared/formatters/currency";

interface MenuViewProps {
  selectedCategory: MenuCategory;
  currencyCode: SupportedCurrencyCode;
  onSelectCategory: (category: MenuCategory) => void;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuView = ({ selectedCategory, currencyCode, onSelectCategory, items, onAddToCart }: MenuViewProps) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto border-b border-white/5 pb-4 sm:mb-10 sm:gap-4">
      {MENU_CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.12em] transition-all sm:px-6 sm:text-xs sm:tracking-[0.2em] ${
            selectedCategory === category
              ? "border-[#E5C07B] bg-[#E5C07B] font-bold text-black shadow-[0_0_15px_rgba(229,192,123,0.3)]"
              : "border-transparent bg-transparent text-zinc-500 hover:border-white/10 hover:text-zinc-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onAddToCart(item)}
          className="glass-panel hover-glow group relative cursor-pointer overflow-hidden rounded-[1.6rem] p-4 transition-all duration-300 sm:rounded-[2rem] sm:p-5"
        >
          <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-[#111]">
            <img
              src={item.img}
              className="h-full w-full object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
              alt={item.name}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md">
                <Plus size={24} />
              </div>
            </div>
          </div>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg tracking-tight text-white sm:text-xl">{item.name}</h3>
            <span className="font-mono text-base font-bold text-[#E5C07B] sm:text-lg">
              {formatCurrency(item.price, currencyCode)}
            </span>
          </div>
          <p className="text-xs italic text-zinc-500">Ingredientes seleccionados de origen.</p>
        </div>
      ))}

      {items.length === 0 && (
        <div className="glass-panel col-span-full rounded-[2rem] p-8 text-center text-zinc-500 sm:p-12">
          Sin coincidencias para la busqueda actual.
        </div>
      )}
    </div>
  </div>
);

export default MenuView;


import { Plus } from "lucide-react";
import type { MenuCategory, MenuItem, SupportedCurrencyCode } from "@/types";
import { formatCurrency } from "@/shared/formatters/currency";
import { useHorizontalDragScroll } from "@/shared/hooks/useHorizontalDragScroll";

interface MenuViewProps {
  categories: MenuCategory[];
  selectedCategory: MenuCategory;
  currencyCode: SupportedCurrencyCode;
  onSelectCategory: (category: MenuCategory) => void;
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const MenuView = ({
  categories,
  selectedCategory,
  currencyCode,
  onSelectCategory,
  items,
  onAddToCart,
}: MenuViewProps) => {
  const {
    containerRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave,
    onClickCapture,
    onDragStart,
  } = useHorizontalDragScroll();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
        onDragStart={onDragStart}
        className={`scrollbar-hide mb-6 flex gap-2 overflow-x-auto border-b border-white/5 pb-4 select-none touch-pan-y sm:mb-10 sm:gap-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {categories.map((category) => (
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
        {items.map((item) => {
          const isOutOfStock = item.stock <= 0;
          const isLowStock = !isOutOfStock && item.stock < 5;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (!isOutOfStock) {
                  onAddToCart(item);
                }
              }}
              className={`glass-panel group relative overflow-hidden rounded-[1.6rem] p-4 transition-all duration-500 sm:rounded-[2rem] sm:p-5 ${
                isOutOfStock
                  ? "cursor-not-allowed border-white/5"
                  : "hover-glow cursor-pointer hover:-translate-y-1"
              }`}
            >
              {isOutOfStock && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-[#050505]/90 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 shadow-2xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                    Agotado
                  </div>
                </div>
              )}

              {isLowStock && (
                <div className="absolute right-4 top-4 z-20 rounded-lg border border-[#E5C07B]/30 bg-[#E5C07B]/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.15)] backdrop-blur-xl">
                  Ultimas Unidades
                </div>
              )}

              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-[#111]">
                <img
                  src={item.img}
                  className={`h-full w-full object-cover transition-all duration-700 ${
                    isOutOfStock
                      ? "scale-100 grayscale-[80%] opacity-50"
                      : "grayscale-[20%] group-hover:scale-110 group-hover:grayscale-0"
                  }`}
                  alt={item.name}
                />
                {!isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md">
                      <Plus size={24} />
                    </div>
                  </div>
                )}
              </div>
              <div className={`mb-2 flex items-start justify-between gap-3 transition-opacity ${isOutOfStock ? "opacity-40" : "opacity-100"}`}>
                <h3 className="font-serif text-lg tracking-tight text-white sm:text-xl">{item.name}</h3>
                <span className="font-mono text-base font-bold text-[#E5C07B] sm:text-lg">
                  {formatCurrency(item.price, currencyCode)}
                </span>
              </div>
              <p className={`text-xs italic text-zinc-500 transition-opacity ${isOutOfStock ? "opacity-40" : ""}`}>
                {isOutOfStock
                  ? "Temporalmente no disponible en carta."
                  : "Ingredientes seleccionados de origen."}
              </p>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="glass-panel col-span-full rounded-[2rem] p-8 text-center text-zinc-500 sm:p-12">
            Sin coincidencias para la busqueda actual.
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuView;

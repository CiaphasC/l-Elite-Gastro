import { ArrowRightLeft, BoxSelect, Carrot, ChefHat, Minus, Plus, Soup, Wine } from "lucide-react";
import type { InventoryMainTab, KitchenInventoryTab, MenuItem } from "@/types";

interface InventoryViewProps {
  items: MenuItem[];
  inventoryMainTab: InventoryMainTab;
  kitchenInventoryTab: KitchenInventoryTab;
  onSetInventoryMainTab: (tab: InventoryMainTab) => void;
  onSetKitchenInventoryTab: (tab: KitchenInventoryTab) => void;
  onOpenCreateModal: () => void;
  onAdjustStock: (itemId: number, delta: number) => void;
}

const STOCK_LOW_THRESHOLD = 10;

const resolveStockStatus = (stockValue: number): { className: string; label: string } => {
  const stock = Number.isFinite(stockValue) ? stockValue : 0;

  if (stock <= 0) {
    return {
      className: "bg-zinc-600/20 text-zinc-300",
      label: "Sin stock",
    };
  }

  if (stock < STOCK_LOW_THRESHOLD) {
    return {
      className: "bg-red-500/10 text-red-400",
      label: "Bajo",
    };
  }

  return {
    className: "bg-emerald-500/10 text-emerald-400",
    label: "OK",
  };
};

const InventoryView = ({
  items,
  inventoryMainTab,
  kitchenInventoryTab,
  onSetInventoryMainTab,
  onSetKitchenInventoryTab,
  onOpenCreateModal,
  onAdjustStock,
}: InventoryViewProps) => (
  <div className="glass-panel animate-in fade-in rounded-[2.5rem] p-5 duration-500 sm:p-8">
    <div className="mb-6 flex items-center justify-between gap-3">
      <h3 className="font-serif text-xl text-white sm:text-2xl">Bodega y Stock</h3>
      <button className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-colors hover:bg-white/10 hover:text-white sm:flex">
        <ArrowRightLeft size={14} />
        Movimientos
      </button>
    </div>

    <div className="mb-4 flex flex-col items-stretch justify-between gap-5 md:flex-row md:items-center">
      <div className="relative flex w-full max-w-fit gap-0 overflow-hidden rounded-full border border-[#E5C07B]/20 p-1">
        <div className="absolute inset-0 bg-[#E5C07B]/5 backdrop-blur-sm" />
        <button
          onClick={() => onSetInventoryMainTab("kitchen")}
          className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            inventoryMainTab === "kitchen"
              ? "bg-[#E5C07B] text-black shadow-[0_0_20px_rgba(229,192,123,0.3)]"
              : "text-[#E5C07B]/60 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B]"
          }`}
        >
          <ChefHat size={14} />
          Cocina
        </button>
        <div className="my-2 mx-1 w-[1px] bg-[#E5C07B]/20" />
        <button
          onClick={() => onSetInventoryMainTab("bar")}
          className={`relative z-10 flex items-center gap-2 rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            inventoryMainTab === "bar"
              ? "bg-[#E5C07B] text-black shadow-[0_0_20px_rgba(229,192,123,0.3)]"
              : "text-[#E5C07B]/60 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B]"
          }`}
        >
          <Wine size={14} />
          Cantina
        </button>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#E5C07B] to-[#C69C54] px-6 py-2.5 text-black shadow-[0_0_20px_rgba(229,192,123,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(229,192,123,0.5)] active:scale-[0.98] md:w-auto"
      >
        <div className="absolute -left-[100%] top-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />
        <div className="relative flex items-center justify-center gap-3">
          <span className="rounded-lg bg-black/10 p-0.5">
            <BoxSelect size={14} className="stroke-[2.5px]" />
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ingresar Existencias</span>
        </div>
      </button>
    </div>

    <div className="mb-8 min-h-[40px]">
      {inventoryMainTab === "kitchen" && (
        <div className="animate-in fade-in slide-in-from-top-2 relative flex w-full max-w-fit gap-1 overflow-hidden rounded-full border border-[#E5C07B]/20 p-1 duration-500">
          <div className="absolute inset-0 bg-[#E5C07B]/5 backdrop-blur-sm" />
          <button
            onClick={() => onSetKitchenInventoryTab("dishes")}
            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              kitchenInventoryTab === "dishes"
                ? "bg-[#E5C07B] text-black shadow-[0_0_20px_rgba(229,192,123,0.2)]"
                : "text-[#E5C07B]/50 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B]"
            }`}
          >
            <Soup size={12} />
            Platos
          </button>
          <div className="my-2 w-[1px] bg-[#E5C07B]/20" />
          <button
            onClick={() => onSetKitchenInventoryTab("ingredients")}
            className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              kitchenInventoryTab === "ingredients"
                ? "bg-[#E5C07B] text-black shadow-[0_0_20px_rgba(229,192,123,0.2)]"
                : "text-[#E5C07B]/50 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B]"
            }`}
          >
            <Carrot size={12} />
            Insumos
          </button>
        </div>
      )}
    </div>

    <div className="hidden overflow-x-auto md:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            <th className="pb-4 pl-4 font-black">Producto</th>
            <th className="pb-4 font-black">Categoria</th>
            <th className="pb-4 font-black">Stock</th>
            <th className="pb-4 font-black">Estado</th>
            <th className="pb-4 pr-4 text-right font-black">Ajuste</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => {
            const stockStatus = resolveStockStatus(item.stock);

            return (
            <tr key={item.id} className="group transition-colors hover:bg-white/5">
              <td className="py-4 pl-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    className="h-10 w-10 rounded-lg object-cover grayscale transition-all group-hover:grayscale-0"
                    alt={item.name}
                  />
                  <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                </div>
              </td>
              <td className="py-4 text-xs uppercase tracking-wider text-zinc-500">{item.category}</td>
              <td className="py-4 font-mono text-zinc-300">
                {item.stock} <span className="ml-1 text-[10px] text-zinc-600">{item.unit}</span>
              </td>
              <td className="py-4">
                <div
                  className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${stockStatus.className}`}
                >
                  {stockStatus.label}
                </div>
              </td>
              <td className="py-4 pr-4 text-right">
                <div className="flex justify-end gap-2 opacity-40 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onAdjustStock(item.id, -1)}
                    className="rounded bg-white/5 p-1 transition-colors hover:text-red-400"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={() => onAdjustStock(item.id, 1)}
                    className="rounded bg-white/5 p-1 transition-colors hover:text-emerald-400"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </td>
            </tr>
          )})}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center italic text-zinc-500">
                No hay registros en{" "}
                {inventoryMainTab === "kitchen"
                  ? kitchenInventoryTab === "dishes"
                    ? "Platos"
                    : "Insumos"
                  : "Cantina"}
                .
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="space-y-3 md:hidden">
      {items.map((item) => {
        const stockStatus = resolveStockStatus(item.stock);

        return (
        <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-3">
            <img src={item.img} className="h-12 w-12 rounded-lg object-cover" alt={item.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">{item.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">{item.category}</p>
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-zinc-300">
              {item.stock} <span className="ml-1 text-[10px] text-zinc-500">{item.unit}</span>
            </p>
            <span
              className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${stockStatus.className}`}
            >
              {stockStatus.label}
            </span>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onAdjustStock(item.id, -1)}
              className="rounded bg-white/10 p-2 transition-colors hover:text-red-400"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => onAdjustStock(item.id, 1)}
              className="rounded bg-white/10 p-2 transition-colors hover:text-emerald-400"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )})}

      {items.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center italic text-zinc-500">
          No hay registros para esta vista.
        </div>
      )}
    </div>
  </div>
);

export default InventoryView;

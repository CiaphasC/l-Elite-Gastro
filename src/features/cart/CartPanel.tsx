import { CheckCircle2, Trash2, Wine } from "lucide-react";
import type { CartItem, ServiceContext, SupportedCurrencyCode, TableInfo } from "@/types";
import CartItemLine from "@/features/cart/components/CartItemLine";
import CartTotalsSummary from "@/features/cart/components/CartTotalsSummary";
import ReservationTableSelector from "@/features/reservations/components/ReservationTableSelector";

interface CartPanelProps {
  cartItems: CartItem[];
  currencyCode: SupportedCurrencyCode;
  subtotal: number;
  serviceFee: number;
  total: number;
  serviceContext: ServiceContext;
  tables: TableInfo[];
  onClearCart: () => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onOpenCheckout: () => void;
  onSelectTable: (tableId: number) => void;
}

const CartPanel = ({
  cartItems,
  currencyCode,
  subtotal,
  serviceFee,
  total,
  serviceContext,
  tables,
  onClearCart,
  onUpdateQty,
  onOpenCheckout,
  onSelectTable,
}: CartPanelProps) => {
  const selectedTableId = serviceContext.tableId;
  const selectableTableIds = tables.map((table) => table.id);

  return (
    <aside className="relative z-30 hidden w-[450px] flex-col overflow-hidden border-l border-white/5 bg-[#080808] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] xl:flex">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col p-10">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-white">Recibo de Orden</h2>
            <div className="mt-3">
              <ReservationTableSelector
                variant="inline"
                value={selectedTableId}
                options={selectableTableIds}
                placeholder="Seleccionar Mesa"
                onChange={(nextValue) => {
                  if (nextValue === "") {
                    return;
                  }
                  onSelectTable(nextValue);
                }}
              />
            </div>
          </div>
          <button
            onClick={onClearCart}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="custom-scroll flex-1 space-y-6 overflow-y-auto pr-2">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-10 text-center opacity-20">
              <Wine size={64} className="mb-6 stroke-1" />
              <p className="font-serif text-xl italic">"La excelencia esta en los detalles."</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItemLine
                key={item.id}
                item={item}
                currencyCode={currencyCode}
                variant="desktop"
                onUpdateQty={onUpdateQty}
              />
            ))
          )}
        </div>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#0A0A0A]/90 p-10 backdrop-blur-xl">
        <CartTotalsSummary
          subtotal={subtotal}
          serviceFee={serviceFee}
          total={total}
          currencyCode={currencyCode}
          variant="desktop"
        />

        <button
          onClick={onOpenCheckout}
          disabled={cartItems.length === 0}
          className={`group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl py-6 text-xs font-black uppercase tracking-[0.3em] transition-all ${
            cartItems.length > 0
              ? "bg-[#E5C07B] text-black shadow-[0_0_30px_rgba(229,192,123,0.2)] hover:scale-[1.02]"
              : "cursor-not-allowed bg-white/5 text-zinc-600"
          }`}
        >
          <CheckCircle2 size={18} />
          Confirmar Orden
        </button>
      </div>
    </aside>
  );
};

export default CartPanel;


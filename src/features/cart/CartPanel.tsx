import { CheckCircle2, Minus, Plus, Trash2, Wine } from "lucide-react";
import type { CartItem } from "@/types";
import { formatCurrency } from "@/shared/formatters/currency";

interface CartPanelProps {
  cartItems: CartItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  onClearCart: () => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onOpenCheckout: () => void;
}

const CartPanel = ({
  cartItems,
  subtotal,
  serviceFee,
  total,
  onClearCart,
  onUpdateQty,
  onOpenCheckout,
}: CartPanelProps) => (
  <aside className="relative z-30 hidden w-[450px] flex-col overflow-hidden border-l border-white/5 bg-[#080808] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] xl:flex">
    <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />

    <div className="relative z-10 flex min-h-0 flex-1 flex-col p-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-white">Comanda Actual</h2>
          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Mesa 102 <span>•</span> <span className="text-[#E5C07B]">VIP Service</span>
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
            <div
              key={item.id}
              className="flex items-center gap-5 rounded-2xl border border-white/5 bg-white/5 p-3 animate-in slide-in-from-right duration-300"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-black">
                <img src={item.img} className="h-full w-full object-cover opacity-80" alt={item.name} />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-sm font-medium leading-tight text-white">{item.name}</h4>
                <p className="font-mono text-xs font-bold text-[#E5C07B]">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-black/40 p-1.5">
                <button
                  onClick={() => onUpdateQty(item.id, 1)}
                  className="p-1 transition-colors hover:text-[#E5C07B]"
                >
                  <Plus size={12} />
                </button>
                <span className="w-5 text-center font-mono text-xs text-white">{item.qty}</span>
                <button
                  onClick={() => onUpdateQty(item.id, -1)}
                  className="p-1 transition-colors hover:text-[#E5C07B]"
                >
                  <Minus size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    <div className="relative z-20 border-t border-white/10 bg-[#0A0A0A]/90 p-10 backdrop-blur-xl">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>Subtotal</span>
          <span className="font-mono text-zinc-300">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>Servicio (10%)</span>
          <span className="font-mono text-zinc-300">{formatCurrency(serviceFee)}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-6 font-serif text-3xl text-white">
          <span>Total</span>
          <span className="font-mono tracking-tighter text-[#E5C07B]">{formatCurrency(total)}</span>
        </div>
      </div>

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

export default CartPanel;


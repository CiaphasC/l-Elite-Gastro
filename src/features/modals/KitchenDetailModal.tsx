import { ArrowLeft, CheckCircle2, Receipt } from "lucide-react";
import { resolveKitchenOrderSequence, resolveKitchenOrderTableId } from "@/domain/orders";
import { formatCurrency } from "@/shared/formatters/currency";
import type { KitchenOrder, KitchenOrderItem, MenuItem, SupportedCurrencyCode } from "@/types";

interface KitchenDetailModalProps {
  order: KitchenOrder | null;
  inventory: MenuItem[];
  currencyCode: SupportedCurrencyCode;
  onClose: () => void;
  onMarkToServe: () => void;
}

interface DetailLine {
  key: string;
  name: string;
  qty: number;
  price: number;
  img: string;
  lineTotal: number;
}

const fallbackItemImage =
  "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800";

const resolveDetailLine = (line: KitchenOrderItem, inventory: MenuItem[]): DetailLine => {
  const inventoryMatch =
    (typeof line.itemId === "number"
      ? inventory.find((item) => item.id === line.itemId)
      : undefined) ?? inventory.find((item) => item.name === line.name);
  const itemPrice = line.price ?? inventoryMatch?.price ?? 0;
  const itemImg = line.img ?? inventoryMatch?.img ?? fallbackItemImage;

  return {
    key: `${line.itemId ?? line.name}-${line.qty}`,
    name: line.name,
    qty: line.qty,
    price: itemPrice,
    img: itemImg,
    lineTotal: itemPrice * line.qty,
  };
};

const KitchenDetailModal = ({
  order,
  inventory,
  currencyCode,
  onClose,
  onMarkToServe,
}: KitchenDetailModalProps) => {
  if (!order) {
    return null;
  }

  const tableId = resolveKitchenOrderTableId(order);
  const sequence = resolveKitchenOrderSequence(order);
  const tableLabel = tableId ? `Mesa ${tableId}` : order.id;
  const orderLabel =
    typeof sequence === "number" ? `Orden #${String(sequence).padStart(2, "0")}` : "Orden";

  const detailLines = order.items.map((line) => resolveDetailLine(line, inventory));
  const subtotal = detailLines.reduce((acc, line) => acc + line.lineTotal, 0);

  return (
    <div className="fixed inset-0 z-[130] flex flex-col overflow-hidden bg-[#050505] md:flex-row">
      <div className="relative flex flex-1 flex-col p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[45%] w-[45%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="relative z-10 mb-8">
          <button
            onClick={onClose}
            className="group mb-2 flex items-center gap-2 text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Volver a Pase
          </button>

          <h2 className="font-serif text-3xl text-white">Detalle de Orden</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="rounded-lg border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E5C07B]">
              {tableLabel}
            </span>
            <span className="border-l border-white/10 pl-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              {orderLabel}
            </span>
          </div>
        </div>

        <div className="custom-scroll relative z-10 flex-1 overflow-y-auto pr-2">
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="hidden grid-cols-[minmax(0,1fr)_170px_130px] border-b border-white/10 bg-white/[0.04] px-5 py-3 sm:grid">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Plato
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Detalle
              </span>
              <span className="text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Total
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {detailLines.map((line) => (
                <article
                  key={`${order.id}-${line.key}`}
                  className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_170px_130px] sm:items-center sm:gap-4 sm:px-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={line.img}
                      alt={line.name}
                      className="h-14 w-14 rounded-lg object-cover opacity-90"
                    />
                    <div className="min-w-0">
                      <h4 className="truncate text-base font-medium text-zinc-100">{line.name}</h4>
                      <p className="mt-0.5 font-mono text-xs text-zinc-500 sm:hidden">
                        {line.qty} x {formatCurrency(line.price, currencyCode)}
                      </p>
                    </div>
                  </div>

                  <p className="hidden font-mono text-sm text-zinc-400 sm:block">
                    {line.qty} x {formatCurrency(line.price, currencyCode)}
                  </p>

                  <p className="text-right font-mono text-base text-[#E5C07B]">
                    {formatCurrency(line.lineTotal, currencyCode)}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {order.notes && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-400">
                Notas de Cocina
              </p>
              <p className="text-sm italic text-zinc-300">"{order.notes}"</p>
            </div>
          )}
        </div>
      </div>

      <aside className="relative z-20 flex w-full flex-col border-l border-white/5 bg-[#0A0A0A] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] md:w-[390px] xl:w-[430px]">
        <div className="border-b border-white/5 bg-[#080808] p-8">
          <h3 className="mb-1 flex items-center gap-2 font-serif text-xl text-white">
            <Receipt size={20} className="text-[#E5C07B]" />
            Resumen
          </h3>
          <p className="text-xs text-zinc-500">Vista de lectura de la orden enviada a cocina.</p>
        </div>

        <div className="custom-scroll flex-1 space-y-3 overflow-y-auto p-6">
          {detailLines.map((line) => (
            <div
              key={`${order.id}-summary-${line.key}`}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
            >
              <img src={line.img} alt={line.name} className="h-11 w-11 rounded-lg object-cover opacity-90" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-zinc-100">{line.name}</p>
                <p className="font-mono text-[11px] text-zinc-500">
                  {line.qty} x {formatCurrency(line.price, currencyCode)}
                </p>
              </div>
              <p className="font-mono text-sm text-[#E5C07B]">
                {formatCurrency(line.lineTotal, currencyCode)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 bg-[#080808] p-8">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400">
              <span>Total Orden</span>
              <span>{formatCurrency(subtotal, currencyCode)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Volver a Pase
            </button>
            <button
              onClick={onMarkToServe}
              className="w-full rounded-xl bg-[#E5C07B] py-4 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#c4a162]"
            >
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={14} />
                Marcar para Servir
              </span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default KitchenDetailModal;

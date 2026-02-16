import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BoxSelect, Minus, Plus, Receipt } from "lucide-react";
import { resolveKitchenOrderSequence, resolveKitchenOrderTableId } from "@/domain/orders";
import type {
  CartItem,
  KitchenOrder,
  KitchenOrderItem,
  MenuCategory,
  MenuItem,
  OrderTakingConfirmationPayload,
  OrderTakingContext,
  SupportedCurrencyCode,
} from "@/types";
import { formatCurrency } from "@/shared/formatters/currency";

interface OrderTakingInterfaceProps {
  context: OrderTakingContext;
  inventory: MenuItem[];
  kitchenOrders: KitchenOrder[];
  currencyCode: SupportedCurrencyCode;
  onCancel: () => void;
  onConfirmOrder: (payload: OrderTakingConfirmationPayload) => void;
}

interface HistoricalOrderLine {
  key: string;
  name: string;
  qty: number;
  price: number;
  img: string;
  lineTotal: number;
}

interface HistoricalOrderBatch {
  id: string;
  sequence: number;
  waiter: string;
  notes?: string;
  items: HistoricalOrderLine[];
  subtotal: number;
}

const serviceFeeRate = 0.1;
const fallbackItemImage =
  "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800";

const resolveOrderLineDisplay = (
  line: KitchenOrderItem,
  inventory: MenuItem[]
): HistoricalOrderLine => {
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

const buildHistoricalBatches = (
  tableId: number,
  kitchenOrders: KitchenOrder[],
  inventory: MenuItem[]
): HistoricalOrderBatch[] => {
  const ordersByTable = kitchenOrders
    .filter((order) => resolveKitchenOrderTableId(order) === tableId)
    .map((order, index) => ({
      order,
      originalIndex: index,
      sequence: resolveKitchenOrderSequence(order),
    }))
    .sort((left, right) => {
      const leftSequence = left.sequence ?? Number.MAX_SAFE_INTEGER;
      const rightSequence = right.sequence ?? Number.MAX_SAFE_INTEGER;
      if (leftSequence === rightSequence) {
        return left.originalIndex - right.originalIndex;
      }
      return leftSequence - rightSequence;
    });

  return ordersByTable.map(({ order, sequence }, index) => {
    const resolvedSequence = typeof sequence === "number" && sequence > 0 ? sequence : index + 1;
    const lines = order.items.map((line) => resolveOrderLineDisplay(line, inventory));
    const subtotal = lines.reduce((acc, line) => acc + line.lineTotal, 0);

    return {
      id: order.id,
      sequence: resolvedSequence,
      waiter: order.waiter,
      notes: order.notes,
      items: lines,
      subtotal,
    };
  });
};

const OrderTakingInterface = ({
  context,
  inventory,
  kitchenOrders,
  currencyCode,
  onCancel,
  onConfirmOrder,
}: OrderTakingInterfaceProps) => {
  const dishes = useMemo(() => inventory.filter((item) => item.type === "dish"), [inventory]);
  const categories = useMemo(
    () => [...new Set(dishes.map((item) => item.category))] as MenuCategory[],
    [dishes]
  );
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(
    categories[0] ?? "Entrantes"
  );
  const [localCart, setLocalCart] = useState<CartItem[]>([]);

  const historicalBatches = useMemo(
    () => buildHistoricalBatches(context.tableId, kitchenOrders, inventory),
    [context.tableId, kitchenOrders, inventory]
  );

  const effectiveSelectedCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : (categories[0] ?? "Entrantes");

  const filteredItems = useMemo(
    () => dishes.filter((item) => item.category === effectiveSelectedCategory),
    [dishes, effectiveSelectedCategory]
  );

  const addToLocalCart = (item: MenuItem) => {
    const existingQty = localCart.find((line) => line.id === item.id)?.qty ?? 0;
    if (existingQty >= item.stock || item.stock <= 0) {
      return;
    }

    setLocalCart((previousCart) => {
      const existingLine = previousCart.find((line) => line.id === item.id);
      if (existingLine) {
        return previousCart.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line
        );
      }

      return [...previousCart, { ...item, qty: 1 }];
    });
  };

  const updateQty = (itemId: number, delta: number) => {
    setLocalCart((previousCart) =>
      previousCart
        .map((line) => {
          if (line.id !== itemId) {
            return line;
          }

          const stock = inventory.find((item) => item.id === itemId)?.stock ?? line.qty;
          const nextQty = Math.min(Math.max(line.qty + delta, 0), stock);
          return { ...line, qty: nextQty };
        })
        .filter((line) => line.qty > 0)
    );
  };

  const subtotal = localCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal + subtotal * serviceFeeRate;
  const historicalSubtotal = historicalBatches.reduce((acc, batch) => acc + batch.subtotal, 0);
  const confirmButtonLabel =
    historicalBatches.length > 0 ? "Agregar Orden Separada" : "Iniciar Servicio y Orden";
  const newOrderTitle = historicalBatches.length > 0 ? "Nueva Orden" : "Orden Actual";

  return (
    <div className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[#050505] md:flex-row">
      <div className="relative flex flex-1 flex-col p-6 md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[45%] w-[45%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
          <div className="absolute right-[-10%] top-[15%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
        </div>

        <div className="relative z-10 mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={onCancel}
              className="group mb-2 flex items-center gap-2 text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Volver a Sala
            </button>
            <h2 className="font-serif text-3xl text-white">Servicio a la Carta</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-lg border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#E5C07B]">
                Mesa {context.tableId}
              </span>
              <span className="border-l border-white/10 pl-3 text-sm font-medium text-zinc-400">
                Cliente: <span className="text-white">{context.clientName}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="scrollbar-hide relative z-10 mb-6 flex gap-3 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                effectiveSelectedCategory === category
                  ? "border-[#E5C07B] bg-[#E5C07B] text-black shadow-[0_0_15px_rgba(229,192,123,0.3)]"
                  : "border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="custom-scroll relative z-10 flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const qtyInCart = localCart.find((line) => line.id === item.id)?.qty ?? 0;
              const isOutOfStock = item.stock <= 0;
              const isMaxedOut = qtyInCart >= item.stock;

              return (
                <div
                  key={item.id}
                  onClick={() => addToLocalCart(item)}
                  className={`glass-panel group relative cursor-pointer overflow-hidden rounded-2xl transition-all hover:border-[#E5C07B]/40 ${
                    isOutOfStock || isMaxedOut ? "pointer-events-none opacity-55 grayscale" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                    {isMaxedOut && !isOutOfStock && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="rounded-full border border-red-500/50 bg-black/50 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-400">
                          Max. Stock
                        </span>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="rounded-full border border-red-500/50 bg-black/50 px-3 py-1 text-xs font-black uppercase tracking-widest text-red-400">
                          Agotado
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                      <span className="rounded-lg bg-black/60 px-2 py-1 font-mono text-xs font-bold text-[#E5C07B] backdrop-blur-md">
                        {formatCurrency(item.price, currencyCode)}
                      </span>
                      {item.stock > 0 && item.stock < 5 && (
                        <span className="rounded bg-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-400">
                          {item.stock} left
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="mb-1 text-sm font-medium leading-tight text-white">{item.name}</h4>
                    <p className="line-clamp-2 text-[10px] text-zinc-500">
                      Ingredientes premium seleccionados.
                    </p>
                  </div>

                  {!isOutOfStock && !isMaxedOut && (
                    <div className="absolute right-2 top-2 flex h-8 w-8 scale-50 items-center justify-center rounded-full bg-[#E5C07B] text-black opacity-0 shadow-[0_0_10px_#E5C07B] transition-all group-hover:scale-100 group-hover:opacity-100">
                      <Plus size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-20 flex w-full flex-col border-l border-white/5 bg-[#0A0A0A] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] md:w-[400px] xl:w-[450px]">
        <div className="border-b border-white/5 bg-[#080808] p-8">
          <h3 className="mb-1 flex items-center gap-2 font-serif text-xl text-white">
            <Receipt size={20} className="text-[#E5C07B]" />
            Resumen de Orden
          </h3>
          <p className="text-xs text-zinc-500">Confirma los detalles antes de enviar a cocina.</p>
        </div>

        <div className="custom-scroll flex-1 overflow-y-auto p-6">
          {historicalBatches.length > 0 && (
            <div className="mb-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                  Historial de Ordenes
                </p>
                <p className="text-[10px] font-mono text-zinc-500">
                  {formatCurrency(historicalSubtotal, currencyCode)}
                </p>
              </div>

              {historicalBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E5C07B]">
                        Orden #{String(batch.sequence).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                        {batch.waiter}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-zinc-300">
                      {formatCurrency(batch.subtotal, currencyCode)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {batch.items.map((line) => (
                      <div
                        key={`${batch.id}-${line.key}`}
                        className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/30 p-2.5"
                      >
                        <img
                          src={line.img}
                          alt={line.name}
                          className="h-10 w-10 rounded-lg object-cover opacity-90"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs text-zinc-100">{line.name}</p>
                          <p className="font-mono text-[11px] text-zinc-500">
                            {line.qty} x {formatCurrency(line.price, currencyCode)}
                          </p>
                        </div>
                        <p className="font-mono text-xs text-[#E5C07B]">
                          {formatCurrency(line.lineTotal, currencyCode)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {batch.notes && (
                    <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-[10px] italic text-red-300">
                      "{batch.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
              {newOrderTitle}
            </p>

            {localCart.length === 0 ? (
              <div className="flex h-[180px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-600 opacity-60">
                <BoxSelect size={40} className="mb-3 stroke-1" />
                <p className="text-xs font-medium">Selecciona productos del menu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {localCart.map((item) => (
                  <div
                    key={item.id}
                    className="animate-in slide-in-from-right-4 flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-3 duration-300"
                  >
                    <img
                      src={item.img}
                      className="h-12 w-12 rounded-lg object-cover opacity-80"
                      alt={item.name}
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-sm text-white">{item.name}</h5>
                      <p className="font-mono text-xs text-[#E5C07B]">
                        {formatCurrency(item.price, currencyCode)}
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg border border-white/5 bg-black/40">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1.5 transition-colors hover:text-[#E5C07B]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-mono">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className={`p-1.5 transition-colors ${
                          item.qty >= item.stock
                            ? "cursor-not-allowed text-zinc-600"
                            : "hover:text-[#E5C07B]"
                        }`}
                        disabled={item.qty >= item.stock}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#080808] p-8">
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, currencyCode)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-4 font-serif text-lg text-white">
              <span>Total</span>
              <span className="text-[#E5C07B]">{formatCurrency(total, currencyCode)}</span>
            </div>
          </div>

          <button
            onClick={() => onConfirmOrder({ items: localCart, total })}
            disabled={localCart.length === 0}
            className={`group relative w-full overflow-hidden rounded-xl py-4 text-xs font-bold uppercase tracking-widest transition-all ${
              localCart.length > 0
                ? "bg-[#E5C07B] text-black shadow-[0_0_30px_rgba(229,192,123,0.2)] hover:scale-[1.02]"
                : "cursor-not-allowed bg-white/5 text-zinc-600"
            }`}
          >
            <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0" />
            <span className="relative flex items-center justify-center gap-2">
              {confirmButtonLabel}
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTakingInterface;

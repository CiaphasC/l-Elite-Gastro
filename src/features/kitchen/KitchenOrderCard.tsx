import { AlertTriangle } from "lucide-react";
import { resolveKitchenOrderLabels } from "@/domain/orders";
import { useRestaurantActions, useRestaurantSelector } from "@/store/hooks";

interface KitchenOrderCardProps {
  orderId: string;
}

const KitchenOrderCard = ({ orderId }: KitchenOrderCardProps) => {
  const order = useRestaurantSelector(
    (state) => state.kitchenOrders.find((kitchenOrder) => kitchenOrder.id === orderId) ?? null
  );
  const { openKitchenModal } = useRestaurantActions();

  if (!order) {
    return null;
  }

  const { tableLabel, orderLabel } = resolveKitchenOrderLabels(order);

  return (
    <div className="glass-panel hover-glow flex h-full flex-col overflow-hidden rounded-[2rem] p-0 transition-all">
      <div
        className={`flex items-center justify-between p-6 ${
          order.status === "ready"
            ? "border-b border-emerald-500/20 bg-emerald-500/10"
            : order.status === "cooking"
              ? "border-b border-[#E5C07B]/20 bg-[#E5C07B]/10"
              : "border-b border-white/5 bg-white/5"
        }`}
      >
        <div>
          <span className="font-serif text-2xl text-white">{tableLabel}</span>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">
            {orderLabel} • {order.waiter}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-b from-transparent to-black/20 p-5 sm:p-6">
        <ul className="space-y-4">
          {order.items.map((item, itemIndex) => (
            <li key={`${order.id}-${itemIndex}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    order.status === "ready" ? "bg-emerald-500" : "bg-[#E5C07B]"
                  }`}
                />
                <span className="text-zinc-200">{item.name}</span>
              </div>
              <span className="font-mono text-zinc-400">x{item.qty}</span>
            </li>
          ))}
        </ul>

        {order.notes && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-400" />
            <p className="text-xs italic leading-relaxed text-zinc-400">"{order.notes}"</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/5 bg-black/40 p-4 sm:flex-row">
        <button
          onClick={() => openKitchenModal("kitchen-serve", order.id)}
          className="flex-1 rounded-xl border border-[#E5C07B]/20 bg-[#E5C07B]/10 py-3 text-[10px] font-black uppercase tracking-widest text-[#E5C07B] transition-all hover:bg-[#E5C07B] hover:text-black"
        >
          Servir
        </button>
        <button
          onClick={() => openKitchenModal("kitchen-detail", order.id)}
          className="flex-1 rounded-xl border border-white/5 bg-white/5 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
        >
          Detalle
        </button>
      </div>
    </div>
  );
};

export default KitchenOrderCard;

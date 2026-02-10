import { AlertTriangle, ChefHat } from "lucide-react";

const KitchenView = ({ orders, onOpenKitchenModal }) => (
  <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 md:grid-cols-2 lg:grid-cols-3">
    {orders.map((order) => (
      <div
        key={order.id}
        className="glass-panel hover-glow flex h-full flex-col overflow-hidden rounded-[2rem] p-0 transition-all"
      >
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
            <span className="font-serif text-2xl text-white">{order.id}</span>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">
              {order.waiter}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase opacity-60">Tiempo</span>
            <span
              className={`font-mono text-xl font-bold ${
                order.status === "cooking" ? "text-[#E5C07B]" : "text-white"
              }`}
            >
              {order.time}
            </span>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-b from-transparent to-black/20 p-6">
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

        <div className="flex gap-3 border-t border-white/5 bg-black/40 p-4">
          <button
            onClick={() => onOpenKitchenModal("kitchen-serve", order.id)}
            className="flex-1 rounded-xl border border-[#E5C07B]/20 bg-[#E5C07B]/10 py-3 text-[10px] font-black uppercase tracking-widest text-[#E5C07B] transition-all hover:bg-[#E5C07B] hover:text-black"
          >
            Servir
          </button>
          <button
            onClick={() => onOpenKitchenModal("kitchen-detail", order.id)}
            className="flex-1 rounded-xl border border-white/5 bg-white/5 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Detalle
          </button>
        </div>
      </div>
    ))}

    {orders.length === 0 && (
      <div className="glass-panel col-span-full flex h-64 flex-col items-center justify-center rounded-[2rem] opacity-50">
        <ChefHat size={48} className="mb-4 text-zinc-500" />
        <p className="font-serif text-xl text-zinc-400">Todo el servicio completado</p>
      </div>
    )}
  </div>
);

export default KitchenView;

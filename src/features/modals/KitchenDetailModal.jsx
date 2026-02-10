import { X } from "lucide-react";
import ModalBackdrop from "../../shared/components/ModalBackdrop";

const KitchenDetailModal = ({ order, onClose, onMarkToServe }) => {
  if (!order) {
    return null;
  }

  return (
    <ModalBackdrop>
      <div className="glass-panel custom-scroll relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-5 sm:rounded-[2.5rem] sm:p-10">
        <button onClick={onClose} className="absolute right-5 top-5 text-zinc-500 hover:text-white sm:right-6 sm:top-6">
          <X size={24} />
        </button>

        <div className="mb-6 flex flex-col gap-4 pr-10 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:pr-0">
          <div>
            <h3 className="font-serif text-2xl text-white sm:text-3xl">Mesa {order.id}</h3>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B]">
              Camarero: {order.waiter}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tiempo</p>
            <p className="font-mono text-2xl text-white">{order.time}</p>
          </div>
        </div>

        <div className="mb-6 space-y-4 sm:mb-8 sm:space-y-6">
          {order.items.map((item, index) => (
            <div
              key={`${order.id}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
            >
              <span className="text-base text-zinc-200 sm:text-lg">{item.name}</span>
              <span className="rounded-lg bg-[#E5C07B]/10 px-3 py-1 font-mono font-bold text-[#E5C07B]">
                x{item.qty}
              </span>
            </div>
          ))}

          {order.notes && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-400">
                Notas de Cocina
              </p>
              <p className="italic text-zinc-300">"{order.notes}"</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onMarkToServe}
            className="flex-1 rounded-xl bg-[#E5C07B] py-4 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#c4a162]"
          >
            Marcar para Servir
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default KitchenDetailModal;

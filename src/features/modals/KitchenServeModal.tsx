import { ChefHat } from "lucide-react";
import { resolveKitchenOrderTableId } from "@/domain/orders";
import type { KitchenOrder } from "@/types";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import ModalPanel from "@/shared/components/ModalPanel";

interface KitchenServeModalProps {
  order: KitchenOrder | null;
  onClose: () => void;
  onConfirm: () => void;
}

const KitchenServeModal = ({ order, onClose, onConfirm }: KitchenServeModalProps) => {
  if (!order) {
    return null;
  }
  const tableId = resolveKitchenOrderTableId(order);
  const orderLabel = tableId ? `Mesa ${tableId}` : order.id;

  return (
    <ModalBackdrop onRequestClose={onClose}>
      <ModalPanel className="glass-panel w-full max-w-md rounded-[2rem] border border-emerald-500/20 p-6 text-center sm:rounded-[2.5rem] sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 sm:mb-6 sm:h-20 sm:w-20">
          <ChefHat size={32} />
        </div>
        <h3 className="mb-3 font-serif text-2xl text-white sm:mb-4 sm:text-3xl">Platos Listos?</h3>
        <p className="mb-8 text-sm italic text-zinc-400">
          Confirma que la orden para <strong>{orderLabel}</strong> esta completa y lista para ser
          servida.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/20 py-4 text-xs font-black uppercase tracking-widest text-emerald-400 transition-all hover:bg-emerald-500/30"
          >
            Confirmar Servicio
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 transition-colors hover:bg-white/10"
          >
            Cancelar
          </button>
        </div>
      </ModalPanel>
    </ModalBackdrop>
  );
};

export default KitchenServeModal;


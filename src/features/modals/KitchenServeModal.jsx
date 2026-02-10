import { ChefHat } from "lucide-react";
import ModalBackdrop from "../../shared/components/ModalBackdrop";

const KitchenServeModal = ({ order, onClose, onConfirm }) => {
  if (!order) {
    return null;
  }

  return (
    <ModalBackdrop>
      <div className="glass-panel w-full max-w-md rounded-[2.5rem] border border-emerald-500/20 p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
          <ChefHat size={32} />
        </div>
        <h3 className="mb-4 font-serif text-3xl text-white">Platos Listos?</h3>
        <p className="mb-8 text-sm italic text-zinc-400">
          Confirma que la orden para <strong>{order.id}</strong> esta completa y lista para
          ser servida.
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
      </div>
    </ModalBackdrop>
  );
};

export default KitchenServeModal;

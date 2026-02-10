import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../shared/formatters/currency";
import ModalBackdrop from "../../shared/components/ModalBackdrop";

const CheckoutModal = ({ isOpen, total, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop>
      <div className="glass-panel animate-in zoom-in relative w-full max-w-lg overflow-hidden rounded-[3rem] p-16 text-center duration-500">
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent" />

        <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_50px_rgba(229,192,123,0.15)]">
          <CheckCircle2 size={40} />
        </div>

        <h2 className="mb-4 font-serif text-4xl text-white">Comanda Exitosa</h2>
        <p className="mb-2 text-zinc-400">Total confirmado: {formatCurrency(total)}</p>
        <p className="mb-12 px-8 font-light italic text-zinc-400">
          La orden ha sido enviada a cocina con prioridad VIP. El tiempo estimado de
          preparacion es de 18 minutos.
        </p>

        <button
          onClick={onConfirm}
          className="w-full rounded-2xl border border-white/10 py-5 text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:border-[#E5C07B] hover:text-[#E5C07B]"
        >
          Cerrar y Continuar
        </button>
      </div>
    </ModalBackdrop>
  );
};

export default CheckoutModal;

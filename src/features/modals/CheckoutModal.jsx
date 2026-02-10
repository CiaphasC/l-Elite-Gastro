import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../shared/formatters/currency";
import ModalBackdrop from "../../shared/components/ModalBackdrop";

const CheckoutModal = ({ isOpen, total, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop>
      <div className="glass-panel custom-scroll animate-in zoom-in relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] p-6 text-center duration-500 sm:rounded-[3rem] sm:p-16">
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent" />

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_50px_rgba(229,192,123,0.15)] sm:mb-10 sm:h-24 sm:w-24">
          <CheckCircle2 size={36} />
        </div>

        <h2 className="mb-4 font-serif text-3xl text-white sm:text-4xl">Comanda Exitosa</h2>
        <p className="mb-2 text-zinc-400">Total confirmado: {formatCurrency(total)}</p>
        <p className="mb-8 px-2 font-light italic text-zinc-400 sm:mb-12 sm:px-8">
          La orden ha sido enviada a cocina con prioridad VIP. El tiempo estimado de
          preparacion es de 18 minutos.
        </p>

        <button
          onClick={onConfirm}
          className="w-full rounded-2xl border border-white/10 py-4 text-xs font-black uppercase tracking-[0.16em] text-white transition-all hover:border-[#E5C07B] hover:text-[#E5C07B] sm:py-5 sm:tracking-[0.3em]"
        >
          Cerrar y Continuar
        </button>
      </div>
    </ModalBackdrop>
  );
};

export default CheckoutModal;

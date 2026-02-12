import { CheckCircle2, X } from "lucide-react";
import { formatCurrency } from "@/shared/formatters/currency";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { SupportedCurrencyCode } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  currencyCode: SupportedCurrencyCode;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal = ({ isOpen, currencyCode, total, onClose, onConfirm }: CheckoutModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onRequestClose={onClose}>
      <div className="glass-panel custom-scroll animate-in zoom-in relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] p-6 text-center duration-500 sm:rounded-[3rem] sm:p-16">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 p-2 text-zinc-500 transition-colors hover:text-white sm:right-8 sm:top-8"
          aria-label="Cerrar modal de checkout"
        >
          <X size={16} />
        </button>
        <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent" />

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_50px_rgba(229,192,123,0.15)] sm:mb-10 sm:h-24 sm:w-24">
          <CheckCircle2 size={36} />
        </div>

        <h2 className="mb-4 font-serif text-3xl text-white sm:text-4xl">Confirmar Comanda</h2>
        <p className="mb-2 text-zinc-400">Total a confirmar: {formatCurrency(total, currencyCode)}</p>
        <p className="mb-8 px-2 font-light italic text-zinc-400 sm:mb-12 sm:px-8">
          Al confirmar, la orden se enviara a cocina con prioridad de servicio y se cerrara la
          comanda actual.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-white/10 py-4 text-xs font-black uppercase tracking-[0.16em] text-zinc-300 transition-all hover:border-white/30 hover:text-white sm:py-5"
          >
            Seguir Editando
          </button>
          <button
            onClick={onConfirm}
            className="w-full rounded-2xl border border-[#E5C07B]/30 bg-[#E5C07B]/10 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#E5C07B] transition-all hover:border-[#E5C07B] hover:bg-[#E5C07B] hover:text-black sm:py-5"
          >
            Confirmar y Cerrar
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default CheckoutModal;


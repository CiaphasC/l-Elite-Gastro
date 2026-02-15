import { CheckCircle2, Droplets, Fingerprint, Users } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { ConfirmationModalState } from "@/types";

interface TableConfirmationModalProps {
  modalState: ConfirmationModalState;
  onClose: () => void;
  onConfirm: () => void;
}

const confirmationContentByType = {
  cleaning: {
    title: "Habilitar Mesa",
    subtitle: "Confirma que la mesa esta limpia y lista para nuevos comensales.",
    action: "Confirmar Disponibilidad",
    icon: <CheckCircle2 size={20} />,
  },
  reservation: {
    title: "Ocupar Mesa",
    subtitle: "Confirma llegada de la reserva para abrir toma de comanda.",
    action: "Iniciar Servicio y Orden",
    icon: <Users size={20} />,
  },
  finish_service: {
    title: "Fin de Servicio",
    subtitle: "Mover la mesa a limpieza y mantenimiento.",
    action: "Iniciar Limpieza",
    icon: <Droplets size={20} />,
  },
} as const;

const TableConfirmationModal = ({
  modalState,
  onClose,
  onConfirm,
}: TableConfirmationModalProps) => {
  if (!modalState.isOpen || !modalState.type) {
    return null;
  }

  const content = confirmationContentByType[modalState.type];

  return (
    <ModalBackdrop onRequestClose={onClose}>
      <div className="glass-panel relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 text-center shadow-[0_0_50px_rgba(229,192,123,0.15)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5C07B]/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full">
          <div className="animate-pulse-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.2)]">
            {content.icon}
          </div>
          <h3 className="mb-2 font-serif text-2xl text-white">{content.title}</h3>
          <p className="mb-8 text-sm text-zinc-400">
            Mesa {modalState.tableId}: {content.subtitle}
          </p>

          <button
            onClick={onConfirm}
            className="group relative mb-3 w-full overflow-hidden rounded-xl bg-transparent px-8 py-4 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-xl border border-[#E5C07B]/40 transition-colors duration-300 group-hover:border-[#E5C07B]" />
            <div className="absolute inset-0 rounded-xl bg-[#E5C07B]/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-[#E5C07B]">
              <Fingerprint size={20} />
              <span>{content.action}</span>
            </div>
          </button>

          <button onClick={onClose} className="mt-2 text-xs text-zinc-500 transition-colors hover:text-white">
            Cancelar
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default TableConfirmationModal;

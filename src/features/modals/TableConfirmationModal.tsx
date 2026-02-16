import { useEffect, useRef } from "react";
import { CheckCircle2, Droplets, Fingerprint, Users } from "lucide-react";
import { gsap } from "gsap";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import type { ConfirmationModalState } from "@/types";

interface TableConfirmationModalProps {
  modalState: ConfirmationModalState;
  onClose: () => void;
  onConfirm: () => void;
}

const confirmationContentByType = {
  cleaning: {
    title: "Habilitar Mesa",
    subtitle: (tableId: number) => `¿Confirma que la Mesa ${tableId} está limpia y lista?`,
    action: "Confirmar Disponibilidad",
    icon: <CheckCircle2 size={20} />,
  },
  reservation: {
    title: "Ocupar Mesa",
    subtitle: (tableId: number) =>
      `¿Confirma que los clientes de la Mesa ${tableId} han llegado? Se abrirá la toma de orden.`,
    action: "Iniciar Servicio & Orden",
    icon: <Users size={20} />,
  },
  finish_service: {
    title: "Fin de Servicio",
    subtitle: () => "¿Dar limpieza y mantenimiento a la mesa?",
    action: "Iniciar Limpieza",
    icon: <Droplets size={20} />,
  },
} as const;

const TableConfirmationModal = ({
  modalState,
  onClose,
  onConfirm,
}: TableConfirmationModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!modalState.isOpen || !modalRef.current) {
      return;
    }

    const tween = gsap.fromTo(
      modalRef.current,
      { scale: 0.9, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
    );

    return () => {
      tween.kill();
    };
  }, [modalState.isOpen]);

  if (!modalState.isOpen || !modalState.type) {
    return null;
  }

  const content = confirmationContentByType[modalState.type];
  if (!content) {
    return null;
  }

  const tableId = modalState.tableId ?? 0;
  const subtitleText = content.subtitle(tableId);

  return (
    <ModalBackdrop
      onRequestClose={onClose}
      backdropClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="glass-panel relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 text-center shadow-[0_0_50px_rgba(229,192,123,0.15)]"
      >
        <PremiumParticleBackground intensity={0.5} />

        <div className="relative z-10 w-full">
          <div className="animate-pulse-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.2)]">
            {content.icon}
          </div>
          <h3 className="mb-2 font-serif text-2xl text-white">{content.title}</h3>
          <p className="mb-8 px-4 text-sm text-zinc-400">{subtitleText}</p>

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

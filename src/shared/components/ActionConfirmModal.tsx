import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { Fingerprint } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";

interface ActionConfirmModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  actionLabel: string;
  icon: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  backdropClassName?: string;
}

const ActionConfirmModal = ({
  isOpen,
  title,
  subtitle,
  actionLabel,
  icon,
  onClose,
  onConfirm,
  backdropClassName = "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
}: ActionConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) {
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
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onRequestClose={onClose} backdropClassName={backdropClassName}>
      <div
        ref={modalRef}
        className="glass-panel relative flex w-full max-w-sm flex-col items-center overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 text-center shadow-[0_0_50px_rgba(229,192,123,0.15)]"
      >
        <PremiumParticleBackground intensity={0.5} />

        <div className="relative z-10 w-full">
          <div className="animate-pulse-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.2)]">
            {icon}
          </div>
          <h3 className="mb-2 font-serif text-2xl text-white">{title}</h3>
          <p className="mb-8 px-4 text-sm text-zinc-400">{subtitle}</p>

          <button
            onClick={onConfirm}
            className="group relative mb-3 w-full overflow-hidden rounded-xl bg-transparent px-8 py-4 transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-xl border border-[#E5C07B]/40 transition-colors duration-300 group-hover:border-[#E5C07B]" />
            <div className="absolute inset-0 rounded-xl bg-[#E5C07B]/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-[#E5C07B]">
              <Fingerprint size={20} />
              <span>{actionLabel}</span>
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

export default ActionConfirmModal;

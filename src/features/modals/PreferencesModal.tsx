import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { gsap } from "gsap";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";

interface PreferencesModalProps {
  isOpen: boolean;
  preferences: string;
  onClose: () => void;
}

const PreferencesModal = ({ isOpen, preferences, onClose }: PreferencesModalProps) => {
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
    <ModalBackdrop
      onRequestClose={onClose}
      backdropClassName="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="glass-panel relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 text-center shadow-[0_0_50px_rgba(229,192,123,0.15)]"
      >
        <PremiumParticleBackground intensity={0.5} />

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="animate-pulse-glow mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.2)]">
            <Star size={24} />
          </div>

          <h3 className="mb-4 font-serif text-2xl text-white">Preferencias & Alergias</h3>

          <div className="custom-scroll mb-6 max-h-[40vh] w-full overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4 text-left">
            <p className="text-sm italic leading-relaxed text-zinc-300">"{preferences}"</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#E5C07B] px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#c4a162]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default PreferencesModal;

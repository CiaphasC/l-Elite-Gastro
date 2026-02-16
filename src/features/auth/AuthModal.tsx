import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Crown, KeyRound, Lock, Mail, User, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import type { UserRole } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeline = gsap.timeline();

    if (overlayRef.current) {
      timeline.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }

    if (modalRef.current) {
      timeline.fromTo(
        modalRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
        "-=0.2"
      );
    }

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  const resetState = () => {
    setIsRegister(false);
    setSelectedRole("admin");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextRole = selectedRole;
    resetState();
    onLogin(nextRole);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop
      onRequestClose={handleClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      dialogClassName="w-full max-w-md"
    >
      <div
        ref={modalRef}
        className="glass-panel relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 shadow-[0_0_50px_rgba(229,192,123,0.15)]"
      >
        <PremiumParticleBackground intensity={0.4} />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl tracking-tight text-white">
              {isRegister ? "Crear Cuenta" : "Bienvenido"}
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Cerrar acceso"
            >
              <X size={20} />
            </button>
          </div>

          {!isRegister && (
            <div className="relative mb-8 flex rounded-xl border border-white/10 bg-black/40 p-1.5">
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedRole === "admin" ? "text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Lock size={14} />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("waiter")}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedRole === "waiter" ? "text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                <User size={14} />
                Mesero
              </button>
              <div
                className={`absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-lg bg-[#E5C07B] shadow-lg transition-transform duration-300 ${
                  selectedRole === "waiter" ? "translate-x-[calc(100%+6px)]" : "translate-x-0"
                }`}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Email Corporativo
              </label>
              <div className="group relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="usuario@lelite.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B] focus:bg-black/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Contraseña
              </label>
              <div className="group relative">
                <KeyRound
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B] focus:bg-black/40"
                />
              </div>
            </div>

            {isRegister && (
              <div className="animate-in slide-in-from-bottom-2 space-y-2 fade-in">
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Código de Invitación
                </label>
                <div className="group relative">
                  <Crown
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Código de acceso"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B] focus:bg-black/40"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isRegister ? "Registrar Cuenta" : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsRegister((previous) => !previous)}
              className="text-xs text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-[#E5C07B] hover:decoration-[#E5C07B]"
            >
              {isRegister ? "¿Ya tienes cuenta? Iniciar Sesión" : "¿Nuevo empleado? Registrar Cuenta"}
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default AuthModal;

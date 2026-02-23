import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CalendarDays, Crown, KeyRound, Lock, Mail, User, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import { useRestaurantActions, useRestaurantShallowSelector } from "@/store/hooks";
import type { UserRole } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const SYSTEM_LOGIN_EMAIL = "admin@taxystem.com";
const SYSTEM_LOGIN_PASSWORD = "123administracion";

const getSafeFormValue = (formData: FormData, key: string): string => {
  const rawValue = formData.get(key);
  return typeof rawValue === "string" ? rawValue : "";
};

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [startedAt, setStartedAt] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const workers = useRestaurantShallowSelector((state) => state.workers);
  const { registerWorkerAccount } = useRestaurantActions();

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
    setFullName("");
    setEmail("");
    setPassword("");
    setInviteCode("");
    setStartedAt(new Date().toISOString().slice(0, 10));
    setFormError(null);
    setFormNotice(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const toggleRegisterMode = () => {
    setIsRegister((previous) => {
      const next = !previous;
      setFormError(null);
      setFormNotice(null);
      if (next) {
        setSelectedRole("waiter");
      }
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const stateEmail = email.trim();
    const formEmail = getSafeFormValue(formData, "email").trim();
    const normalizedEmail = (stateEmail || formEmail).toLowerCase();
    const statePassword = password.trim();
    const formPassword = getSafeFormValue(formData, "password").trim();
    const safePassword = statePassword || formPassword;

    if (isRegister) {
      if (!fullName.trim() || !normalizedEmail || !safePassword || !startedAt) {
        setFormError("Completa todos los campos para registrar la cuenta.");
        return;
      }

      if (!normalizedEmail.includes("@")) {
        setFormError("Ingresa un correo corporativo valido.");
        return;
      }

      const hasDuplicatedEmail = workers.some(
        (worker) => worker.email.trim().toLowerCase() === normalizedEmail
      );
      if (hasDuplicatedEmail) {
        setFormError("Ese correo ya esta registrado en el sistema.");
        return;
      }

      registerWorkerAccount({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: safePassword,
        startedAt,
        role: "waiter",
      });

      setFormError(null);
      setFormNotice("Cuenta registrada. Debe ser validada desde Administracion.");
      setIsRegister(false);
      setSelectedRole("waiter");
      setPassword("");
      return;
    }

    if (!normalizedEmail || !safePassword) {
      setFormError("Ingresa correo y contraseña para continuar.");
      return;
    }

    const isValidSystemCredential =
      normalizedEmail === SYSTEM_LOGIN_EMAIL && safePassword === SYSTEM_LOGIN_PASSWORD;
    if (!isValidSystemCredential) {
      setFormError("Credenciales invalidas. Usa admin@taxystem.com / 123administracion.");
      return;
    }

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
            {isRegister && (
              <div className="space-y-2">
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Nombre Completo
                </label>
                <div className="group relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                    size={18}
                  />
                  <input
                    name="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    type="text"
                    placeholder="Nombre y apellido"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B] focus:bg-black/40"
                  />
                </div>
              </div>
            )}

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
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                    name="inviteCode"
                    value={inviteCode}
                    onChange={(event) => setInviteCode(event.target.value)}
                    type="text"
                    placeholder="Código de acceso"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B] focus:bg-black/40"
                  />
                </div>
              </div>
            )}

            {isRegister && (
              <div className="animate-in slide-in-from-bottom-2 space-y-2 fade-in">
                <label className="pl-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Inicio Laboral
                </label>
                <div className="group relative">
                  <CalendarDays
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                    size={18}
                  />
                  <input
                    name="startedAt"
                    value={startedAt}
                    onChange={(event) => setStartedAt(event.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-white outline-none transition-all focus:border-[#E5C07B] focus:bg-black/40"
                  />
                </div>
              </div>
            )}

            {formError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {formError}
              </div>
            )}

            {formNotice && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
                {formNotice}
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
              onClick={toggleRegisterMode}
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

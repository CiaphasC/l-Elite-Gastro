import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Briefcase, CalendarDays, Crown, User, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import type { UserRole, WorkerAccount, WorkerAccountPayload } from "@/types";

interface WorkerFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialWorker?: WorkerAccount | null;
  existingEmails: string[];
  onClose: () => void;
  onSubmit: (payload: WorkerAccountPayload) => void;
}

const toDateInputValue = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  const trimmedValue = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  const parsedDate = new Date(trimmedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

const WorkerFormModal = ({
  isOpen,
  mode,
  initialWorker,
  existingEmails,
  onClose,
  onSubmit,
}: WorkerFormModalProps) => {
  const today = new Date().toISOString().slice(0, 10);

  const resolveInitialFormState = () => {
    if (mode === "edit" && initialWorker) {
      return {
        fullName: initialWorker.fullName,
        email: initialWorker.email,
        password: initialWorker.password,
        role: initialWorker.role as UserRole,
        startedAt: toDateInputValue(initialWorker.startedAt) || today,
        createdAt: toDateInputValue(initialWorker.createdAt) || today,
        validatedAt: toDateInputValue(initialWorker.validatedAt) || "",
      };
    }

    return {
      fullName: "",
      email: "",
      password: "",
      role: "waiter" as UserRole,
      startedAt: today,
      createdAt: today,
      validatedAt: today,
    };
  };

  const initialFormState = resolveInitialFormState();
  const [fullName, setFullName] = useState(initialFormState.fullName);
  const [email, setEmail] = useState(initialFormState.email);
  const [password, setPassword] = useState(initialFormState.password);
  const [role, setRole] = useState<UserRole>(initialFormState.role);
  const [startedAt, setStartedAt] = useState(initialFormState.startedAt);
  const [createdAt, setCreatedAt] = useState(initialFormState.createdAt);
  const [validatedAt, setValidatedAt] = useState(initialFormState.validatedAt);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (overlayRef.current) {
      timeline.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    }

    if (panelRef.current) {
      timeline.fromTo(
        panelRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35 },
        "-=0.15"
      );
    }

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const resetFormState = () => {
    const nextFormState = resolveInitialFormState();
    setFullName(nextFormState.fullName);
    setEmail(nextFormState.email);
    setPassword(nextFormState.password);
    setRole(nextFormState.role);
    setStartedAt(nextFormState.startedAt);
    setCreatedAt(nextFormState.createdAt);
    setValidatedAt(nextFormState.validatedAt);
    setError(null);
  };

  const handleClose = () => {
    resetFormState();
    onClose();
  };

  const normalizedEmail = email.trim().toLowerCase();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !normalizedEmail ||
      !password.trim() ||
      !startedAt ||
      !createdAt
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setError("Ingresa un correo corporativo valido.");
      return;
    }

    const hasDuplicatedEmail = existingEmails.some(
      (existingEmail) => existingEmail.trim().toLowerCase() === normalizedEmail
    );
    if (hasDuplicatedEmail) {
      setError("Ese correo ya esta registrado para otro trabajador.");
      return;
    }

    setError(null);
    onSubmit({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password.trim(),
      role,
      startedAt,
      createdAt,
      validatedAt: validatedAt || null,
    });
    handleClose();
  };

  return (
    <ModalBackdrop
      onRequestClose={handleClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      dialogClassName="w-full max-w-lg"
    >
      <div
        ref={panelRef}
        className="glass-panel relative overflow-hidden rounded-[2.3rem] border border-[#E5C07B]/25 p-7 shadow-[0_0_50px_rgba(229,192,123,0.15)] sm:p-9"
      >
        <PremiumParticleBackground intensity={0.3} />
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 z-20 text-zinc-500 transition-colors hover:text-white"
          aria-label="Cerrar formulario de trabajador"
        >
          <X size={22} />
        </button>

        <div className="relative z-10">
          <div className="mb-6">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B]">
              <Briefcase size={11} /> Trabajadores
            </p>
            <h3 className="font-serif text-3xl text-white">
              {mode === "edit" ? "Editar Trabajador" : "Nuevo Trabajador"}
            </h3>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
              Gestion de cuentas internas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Nombre Completo
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ej. Maria Castillo"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Rol
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/40 p-1.5">
                  <button
                    type="button"
                    onClick={() => setRole("waiter")}
                    className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      role === "waiter"
                        ? "bg-[#E5C07B] text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <User size={12} /> Mesero
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                      role === "admin"
                        ? "bg-[#E5C07B] text-black"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Crown size={12} /> Admin
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Inicio Laboral
                </label>
                <input
                  value={startedAt}
                  onChange={(event) => setStartedAt(event.target.value)}
                  type="date"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all focus:border-[#E5C07B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Creación Cuenta
                </label>
                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    value={createdAt}
                    onChange={(event) => setCreatedAt(event.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-9 pr-4 text-white outline-none transition-all focus:border-[#E5C07B]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Validación Cuenta
                </label>
                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    value={validatedAt}
                    onChange={(event) => setValidatedAt(event.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-9 pr-4 text-white outline-none transition-all focus:border-[#E5C07B]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Email Corporativo
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="colaborador@lelite.com"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]"
              />
            </div>

            <div>
              <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Clave de Acceso
              </label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="text"
                placeholder="******"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] py-3.5 text-xs font-black uppercase tracking-[0.24em] text-black transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              {mode === "edit" ? "Guardar Cambios" : "Crear Cuenta"}
            </button>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default WorkerFormModal;

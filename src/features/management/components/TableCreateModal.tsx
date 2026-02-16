import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Pencil, Plus, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import type { TableInfo, TableManagementPayload } from "@/types";

interface TableCreateModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialTable?: TableInfo | null;
  onClose: () => void;
  onSubmit: (payload: TableManagementPayload) => void;
}

const resolveInitialState = (
  mode: "create" | "edit",
  initialTable?: TableInfo | null
) => {
  if (mode === "edit" && initialTable) {
    return {
      name: initialTable.name,
      code: initialTable.code,
      capacity: initialTable.capacity.toString(),
    };
  }

  return {
    name: "",
    code: "",
    capacity: "4",
  };
};

const TableCreateModal = ({
  isOpen,
  mode,
  initialTable,
  onClose,
  onSubmit,
}: TableCreateModalProps) => {
  const initialState = resolveInitialState(mode, initialTable);
  const [name, setName] = useState(initialState.name);
  const [code, setCode] = useState(initialState.code);
  const [capacity, setCapacity] = useState(initialState.capacity);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const normalizedCode = useMemo(() => code.trim().toUpperCase(), [code]);

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

  const handleClose = () => {
    const nextState = resolveInitialState(mode, initialTable);
    setName(nextState.name);
    setCode(nextState.code);
    setCapacity(nextState.capacity);
    setError(null);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedCapacity = Number.parseInt(capacity, 10);

    if (!name.trim()) {
      setError("Completa el nombre de la mesa.");
      return;
    }

    if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
      setError("La capacidad debe ser un numero mayor a 0.");
      return;
    }

    setError(null);
    onSubmit({
      name: name.trim(),
      code: normalizedCode || initialTable?.code || "AUTO",
      capacity: parsedCapacity,
    });
    handleClose();
  };

  return (
    <ModalBackdrop
      onRequestClose={handleClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      dialogClassName="w-full max-w-md"
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
          aria-label="Cerrar creacion de mesa"
        >
          <X size={22} />
        </button>

        <div className="relative z-10">
          <div className="mb-6">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B]">
              {mode === "edit" ? <Pencil size={11} /> : <Plus size={11} />} Gestion Mesas
            </p>
            <h3 className="font-serif text-3xl text-white">
              {mode === "edit" ? "Editar Mesa" : "Nueva Mesa"}
            </h3>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
              {mode === "edit" ? "Actualizar punto de servicio" : "Registrar punto de servicio"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Nombre de Mesa
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej. Terraza Norte"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Código
                </label>
                <input
                  value={mode === "edit" ? code : "Automático por posición"}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-zinc-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Capacidad
                </label>
                <input
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  type="number"
                  min={1}
                  max={50}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]"
                />
              </div>
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
              {mode === "edit" ? "Guardar Cambios" : "Registrar Mesa"}
            </button>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default TableCreateModal;

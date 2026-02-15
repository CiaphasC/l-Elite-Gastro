import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, MouseEvent as ReactMouseEvent } from "react";
import { gsap } from "gsap";
import { CheckCircle2, Clock, Grid2X2, Star, UserCheck, Users, X } from "lucide-react";
import { RESERVATION_TYPES } from "@/domain/constants";
import ReservationTableSelector from "@/features/reservations/components/ReservationTableSelector";
import type { ReservationPayload, TableInfo } from "@/types";
import ModalBackdrop from "@/shared/components/ModalBackdrop";

const defaultFormState: Required<ReservationPayload> = {
  name: "",
  time: "21:00",
  guests: 2,
  type: RESERVATION_TYPES[0],
  table: "---",
};

const buildInitialFormState = (
  prefill: Partial<ReservationPayload> | null | undefined
): Required<ReservationPayload> => ({
  ...defaultFormState,
  ...prefill,
  table:
    typeof prefill?.table === "number" || prefill?.table === "---"
      ? prefill.table
      : defaultFormState.table,
});

interface ReservationModalProps {
  isOpen: boolean;
  tables: TableInfo[];
  prefill?: Partial<ReservationPayload> | null;
  mode?: "create" | "edit";
  onClose: () => void;
  onSubmitReservation: (payload: ReservationPayload) => void;
}

const ReservationModal = ({
  isOpen,
  tables,
  prefill = null,
  mode = "create",
  onClose,
  onSubmitReservation,
}: ReservationModalProps) => {
  const [formState, setFormState] = useState<Required<ReservationPayload>>(() =>
    buildInitialFormState(prefill)
  );
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const availableTableIds = useMemo(
    () => {
      const selectableTableIds = tables
        .filter((table) => table.status === "disponible")
        .map((table) => table.id);

      if (typeof formState.table === "number" && !selectableTableIds.includes(formState.table)) {
        selectableTableIds.push(formState.table);
      }

      return selectableTableIds.sort((tableA, tableB) => tableA - tableB);
    },
    [tables, formState.table]
  );

  const resetForm = () => {
    setFormState(buildInitialFormState(prefill));
  };

  const updateField = <K extends keyof typeof defaultFormState>(
    field: K,
    value: (typeof defaultFormState)[K]
  ) => {
    setFormState((previousState) => ({ ...previousState, [field]: value }));
  };

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !panelRef.current) {
      return;
    }

    isClosingRef.current = false;
    const revealItems = formRef.current?.querySelectorAll(".animate-item") ?? [];

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.fromTo(
      overlayRef.current,
      { opacity: 0, backdropFilter: "blur(0px)" },
      { opacity: 1, backdropFilter: "blur(8px)", duration: 0.8 }
    );
    timeline.fromTo(
      panelRef.current,
      { y: 50, opacity: 0, scale: 0.95, rotationX: 5 },
      { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.8, ease: "expo.out" },
      "-=0.6"
    );
    timeline.fromTo(
      revealItems,
      { y: 20, opacity: 0, filter: "blur(5px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.08 },
      "-=0.5"
    );

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosingRef.current) {
      return;
    }

    if (!overlayRef.current || !panelRef.current) {
      resetForm();
      onClose();
      return;
    }

    isClosingRef.current = true;

    const revealItems = formRef.current?.querySelectorAll(".animate-item") ?? [];
    const timeline = gsap.timeline({
          onComplete: () => {
            resetForm();
            onClose();
        isClosingRef.current = false;
      },
    });

    timeline.to(revealItems, {
      y: 10,
      opacity: 0,
      filter: "blur(4px)",
      duration: 0.2,
      stagger: 0.03,
      ease: "power2.in",
    });
    timeline.to(
      panelRef.current,
      { y: 20, opacity: 0, scale: 0.95, filter: "blur(10px)", duration: 0.4, ease: "power2.in" },
      "-=0.15"
    );
    timeline.to(
      overlayRef.current,
      { opacity: 0, backdropFilter: "blur(0px)", duration: 0.4, ease: "power2.in" },
      "-=0.3"
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isClosingRef.current || !overlayRef.current || !panelRef.current) {
      onSubmitReservation(formState);
      resetForm();
      return;
    }

    isClosingRef.current = true;

    const timeline = gsap.timeline({
      onComplete: () => {
        onSubmitReservation(formState);
        resetForm();
        isClosingRef.current = false;
      },
    });

    timeline.to(panelRef.current, { scale: 1.05, duration: 0.1, ease: "power2.out" });
    timeline.to(panelRef.current, {
      scale: 0,
      opacity: 0,
      y: 30,
      filter: "blur(10px)",
      duration: 0.3,
      ease: "back.in(1.7)",
    });
    timeline.to(
      overlayRef.current,
      { opacity: 0, backdropFilter: "blur(0px)", duration: 0.3, ease: "power2.in" },
      "-=0.2"
    );
  };

  const handlePanelMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop
      onRequestClose={handleClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/40 p-4"
      dialogClassName="w-full max-w-lg"
    >
      <div
        ref={panelRef}
        onMouseDown={handlePanelMouseDown}
        className="glass-panel relative w-full rounded-[2.5rem] border border-white/10 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5C07B]/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />
        </div>

        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/5 hover:text-white sm:right-8 sm:top-8"
          aria-label="Cerrar modal de reservas"
        >
          <X size={24} />
        </button>

        <div ref={formRef} className="relative z-10 p-6 sm:p-10">
          <div className="animate-item mb-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.1)]">
              <Star size={10} fill="currentColor" /> Concierge
            </div>
            <h3 className="mb-2 font-serif text-4xl tracking-tight text-white">
              {mode === "edit" ? "Editar Reserva" : "Nueva Reserva"}
            </h3>
            <p className="mb-8 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
              <span className="h-[1px] w-8 bg-gradient-to-r from-zinc-700 to-transparent" />
              {mode === "edit" ? "Actualizar en Agenda" : "Registrar en Agenda"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-item">
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <UserCheck size={12} className="text-[#E5C07B]" /> Nombre Cliente
              </label>
              <input
                name="name"
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a] focus:shadow-[0_0_20px_rgba(229,192,123,0.1)]"
                placeholder="Ej. Familia Grimaldi"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="animate-item">
                <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Clock size={12} className="text-[#E5C07B]" /> Hora
                </label>
                <input
                  name="time"
                  type="time"
                  value={formState.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                  required
                />
              </div>
              <div className="animate-item">
                <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Users size={12} className="text-[#E5C07B]" /> Pax
                </label>
                <input
                  name="guests"
                  type="number"
                  min={1}
                  value={formState.guests}
                  onChange={(event) => updateField("guests", Number(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                  required
                />
              </div>
            </div>

            <div className="animate-item relative z-30">
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Grid2X2 size={12} className="text-[#E5C07B]" /> Mesa (Opcional)
              </label>
              <ReservationTableSelector
                name="table"
                value={typeof formState.table === "number" ? formState.table : ""}
                options={availableTableIds}
                placeholder="Asignacion Automatica"
                onChange={(nextTableId) =>
                  updateField("table", typeof nextTableId === "number" ? nextTableId : "---")
                }
              />
            </div>

            <div className="animate-item relative z-10">
              <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Tipo de Evento
              </label>
              <div className="grid grid-cols-4 gap-2">
              {RESERVATION_TYPES.map((type) => (
                  <div key={type} className="relative">
                    <input
                      type="radio"
                      name="eventType"
                      id={`type-${type}`}
                      className="peer absolute h-full w-full cursor-pointer opacity-0"
                      checked={formState.type === type}
                      onChange={() => updateField("type", type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#1a1a1a]/50 py-3 text-[9px] font-bold uppercase text-zinc-500 transition-all hover:bg-white/5 peer-checked:border-[#E5C07B] peer-checked:bg-[#E5C07B] peer-checked:text-black peer-checked:shadow-[0_0_15px_rgba(229,192,123,0.3)]"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-item relative z-10 pt-2">
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0" />
                <span className="relative flex items-center justify-center gap-2">
                  {mode === "edit" ? "Guardar Cambios" : "Confirmar Reserva"}{" "}
                  <CheckCircle2 size={16} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default ReservationModal;

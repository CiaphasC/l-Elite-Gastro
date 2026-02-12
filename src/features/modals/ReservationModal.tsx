import { useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { RESERVATION_TYPES } from "@/domain/constants";
import type { ReservationPayload } from "@/types";
import ModalBackdrop from "@/shared/components/ModalBackdrop";

const defaultFormState: Required<ReservationPayload> = {
  name: "",
  time: "21:00",
  guests: 2,
  type: RESERVATION_TYPES[0],
};

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReservation: (payload: ReservationPayload) => void;
}

const ReservationModal = ({ isOpen, onClose, onSubmitReservation }: ReservationModalProps) => {
  const [formState, setFormState] = useState(defaultFormState);

  const resetForm = () => {
    setFormState(defaultFormState);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const updateField = <K extends keyof typeof defaultFormState>(
    field: K,
    value: (typeof defaultFormState)[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitReservation(formState);
    resetForm();
  };

  return (
    <ModalBackdrop onRequestClose={handleClose}>
      <div className="glass-panel custom-scroll relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] p-5 sm:rounded-[3rem] sm:p-10">
        <button onClick={handleClose} className="absolute right-5 top-5 text-zinc-500 hover:text-white sm:right-8 sm:top-8">
          <X size={24} />
        </button>

        <h3 className="mb-2 pr-8 font-serif text-2xl text-white sm:text-3xl">Nueva Reserva</h3>
        <p className="mb-6 text-xs uppercase tracking-[0.2em] text-zinc-500 sm:mb-8 sm:tracking-widest">
          Registrar cliente en agenda
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="ml-2 mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Nombre Cliente
            </label>
            <input
              name="name"
              type="text"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
              placeholder="Ej. Familia Grimaldi"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="ml-2 mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Hora
              </label>
              <input
                name="time"
                type="time"
                value={formState.time}
                onChange={(event) => updateField("time", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                required
              />
            </div>
            <div>
              <label className="ml-2 mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Pax
              </label>
              <input
                name="guests"
                type="number"
                min={1}
                value={formState.guests}
                onChange={(event) => updateField("guests", Number(event.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="ml-2 mb-1 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Tipo de Evento
            </label>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              {RESERVATION_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => updateField("type", type)}
                  className={`rounded-lg border py-2 text-[10px] font-bold uppercase transition-all sm:flex-1 ${
                    formState.type === type
                      ? "border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:border-[#E5C07B]/30 hover:bg-[#E5C07B]/10 hover:text-[#E5C07B]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-[#E5C07B] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-[#E5C07B]/20 transition-colors hover:bg-[#c4a162]"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </ModalBackdrop>
  );
};

export default ReservationModal;


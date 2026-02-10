import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { RESERVATION_TYPES } from "../../domain/constants";
import ModalBackdrop from "../../shared/components/ModalBackdrop";

const defaultFormState = {
  name: "",
  time: "21:00",
  guests: 2,
  type: RESERVATION_TYPES[0],
};

const ReservationModal = ({ isOpen, onClose, onSubmitReservation }) => {
  const [formState, setFormState] = useState(defaultFormState);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormState(defaultFormState);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitReservation(formState);
  };

  return (
    <ModalBackdrop>
      <div className="glass-panel relative w-full max-w-lg rounded-[3rem] p-10">
        <button onClick={onClose} className="absolute right-8 top-8 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>

        <h3 className="mb-2 font-serif text-3xl text-white">Nueva Reserva</h3>
        <p className="mb-8 text-xs uppercase tracking-widest text-zinc-500">
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

          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex gap-2">
              {RESERVATION_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => updateField("type", type)}
                  className={`flex-1 rounded-lg border py-2 text-[10px] font-bold uppercase transition-all ${
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

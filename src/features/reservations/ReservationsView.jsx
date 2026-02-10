import { Clock, Grid2X2, MoreHorizontal, Plus, Users } from "lucide-react";

const ReservationsView = ({ reservations, onOpenNewReservation }) => (
  <div className="glass-panel animate-in fade-in rounded-[2.5rem] p-5 duration-500 sm:p-8">
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="font-serif text-xl text-white sm:text-2xl">Agenda de Hoy</h3>
      <button
        onClick={onOpenNewReservation}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#E5C07B] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.12em] text-black shadow-lg shadow-[#E5C07B]/20 transition-colors hover:bg-[#c4a162] sm:px-5 sm:text-xs sm:tracking-widest"
      >
        <Plus size={16} />
        Nueva Reserva
      </button>
    </div>

    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:border-[#E5C07B]/30 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#1a1a1a]">
              <Clock size={18} className="mb-1 text-[#E5C07B]" />
              <span className="text-xs font-bold text-white">{reservation.time}</span>
            </div>

            <div className="min-w-0">
              <h4 className="truncate font-serif text-lg text-white">{reservation.name}</h4>
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Users size={12} /> {reservation.guests} Pax
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Grid2X2 size={12} /> Mesa {reservation.table}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                reservation.status === "vip"
                  ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                  : reservation.status === "confirmado"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
              }`}
            >
              {reservation.status}
            </span>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/10">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReservationsView;

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Star,
  Users,
  Wine,
} from "lucide-react";
import type { Reservation, TableInfo } from "@/types";

interface TablesViewProps {
  tables: TableInfo[];
  reservations: Reservation[];
}

interface ReservationLikeDetails {
  name: string;
  time: string;
  guests: number;
  type: string;
}

interface AvailableDetails {
  lastFree: string;
  duration: string;
}

interface CleaningDetails {
  startTime: string;
  staff: string;
}

type TableDetails = ReservationLikeDetails | AvailableDetails | CleaningDetails;

interface TableStatusStyle {
  ambientGradientClass: string;
  numberClass: string;
  badgeClass: string;
  modalBorderClass: string;
  modalGlowClass: string;
  modalLineClass: string;
}

const TABLE_STATUS_STYLE: Record<TableInfo["status"], TableStatusStyle> = {
  disponible: {
    ambientGradientClass: "from-emerald-500 to-transparent",
    numberClass: "text-white",
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    modalBorderClass: "border-emerald-500/20",
    modalGlowClass: "from-emerald-500/20",
    modalLineClass: "via-emerald-500",
  },
  ocupada: {
    ambientGradientClass: "from-[#E5C07B] to-transparent",
    numberClass: "text-[#E5C07B]",
    badgeClass: "border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B]",
    modalBorderClass: "border-[#E5C07B]/20",
    modalGlowClass: "from-[#E5C07B]/20",
    modalLineClass: "via-[#E5C07B]",
  },
  reservada: {
    ambientGradientClass: "from-zinc-500 to-transparent",
    numberClass: "text-white",
    badgeClass: "border-zinc-700 bg-zinc-800/50 text-zinc-400",
    modalBorderClass: "border-zinc-500/20",
    modalGlowClass: "from-zinc-500/20",
    modalLineClass: "via-zinc-500",
  },
  limpieza: {
    ambientGradientClass: "from-zinc-500 to-transparent",
    numberClass: "text-white",
    badgeClass: "border-zinc-700 bg-zinc-800/50 text-zinc-400",
    modalBorderClass: "border-blue-500/20",
    modalGlowClass: "from-blue-500/20",
    modalLineClass: "via-blue-500",
  },
};

interface ModalSelectors {
  modal: string;
  content: string;
}

const getModalSelectors = (tableId: number): ModalSelectors => ({
  modal: `.table-modal-${tableId}`,
  content: `.table-modal-${tableId} .modal-reveal`,
});

const killModalTweens = (tableId: number): void => {
  const selectors = getModalSelectors(tableId);
  gsap.killTweensOf(selectors.modal);
  gsap.killTweensOf(selectors.content);
};

const isReservationLike = (details: TableDetails): details is ReservationLikeDetails =>
  "name" in details && "time" in details;

const isAvailableDetails = (details: TableDetails): details is AvailableDetails =>
  "lastFree" in details;

const isCleaningDetails = (details: TableDetails): details is CleaningDetails =>
  "startTime" in details;

const getTableDetails = (
  table: TableInfo,
  reservations: Reservation[]
): TableDetails | null => {
  switch (table.status) {
    case "reservada": {
      const reservation = reservations.find((reservationItem) => reservationItem.table === table.id);
      if (reservation) {
        return {
          name: reservation.name,
          time: reservation.time,
          guests: reservation.guests || table.guests || 2,
          type: reservation.type,
        };
      }

      return {
        name: "Cliente VIP",
        time: "21:00",
        guests: table.guests || 2,
        type: "Reserva General",
      };
    }
    case "ocupada":
      return {
        name: "Familia Rossini",
        time: "20:15",
        guests: table.guests,
        type: "Cena Casual",
      };
    case "disponible":
      return {
        lastFree: "19:45",
        duration: "45 min",
      };
    case "limpieza":
      return {
        startTime: "22:15",
        staff: "Roberto S.",
      };
    default:
      return null;
  }
};

interface ReservationInfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}

const ReservationInfoRow = ({
  icon,
  label,
  value,
  valueClassName = "font-mono text-sm text-white",
}: ReservationInfoRowProps) => (
  <div className="group/row modal-reveal flex items-center justify-between">
    <div className="flex items-center gap-3 text-zinc-400">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={valueClassName}>{value}</span>
  </div>
);

interface TableOverlayContentProps {
  table: TableInfo;
  details: TableDetails;
}

const TableOverlayContent = ({ table, details }: TableOverlayContentProps) => {
  if (table.status === "limpieza" && isCleaningDetails(details)) {
    return (
      <div className="modal-reveal relative z-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Droplets size={18} />
        </div>
        <h4 className="mb-1 font-serif text-xl tracking-wide text-white">Mantenimiento</h4>
        <div className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <span>Mesa {table.id}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-600" />
          <span>Limpieza</span>
        </div>

        <div className="modal-reveal grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/5 bg-white/5 p-2">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Inicio</p>
            <p className="font-mono text-sm font-bold text-blue-400">{details.startTime}</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-2">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Staff</p>
            <p className="font-mono text-sm text-white">{details.staff}</p>
          </div>
        </div>
      </div>
    );
  }

  if (table.status === "disponible" && isAvailableDetails(details)) {
    return (
      <div className="modal-reveal relative z-10 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={18} />
        </div>
        <h4 className="mb-1 font-serif text-xl tracking-wide text-white">Mesa Libre</h4>
        <div className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          <span>Mesa {table.id}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-600" />
          <span>{table.guests || 0} Pax</span>
        </div>

        <div className="modal-reveal grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/5 bg-white/5 p-2">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              Libre Desde
            </p>
            <p className="font-mono text-sm font-bold text-emerald-400">{details.lastFree}</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-2">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500">Tiempo</p>
            <p className="font-mono text-sm text-white">{details.duration}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isReservationLike(details)) {
    return (
      <div className="relative z-10">
        <div className="modal-reveal mb-4 flex items-start justify-between border-b border-white/5 pb-4">
          <div>
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#E5C07B]">
              Reserva Actual
            </p>
            <h4 className="font-serif text-xl leading-tight text-white">{details.name}</h4>
          </div>
          {table.status === "ocupada" && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B]">
              <Star size={14} fill="currentColor" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <ReservationInfoRow
            icon={<Clock size={14} className="text-[#E5C07B]/70" />}
            label="Hora"
            value={details.time}
            valueClassName="rounded border border-white/5 bg-white/5 px-2 py-0.5 font-mono text-sm text-white transition-colors group-hover/row:border-[#E5C07B]/20"
          />

          <ReservationInfoRow
            icon={<Users size={14} className="text-[#E5C07B]/70" />}
            label="Pax"
            value={`${details.guests} Personas`}
          />

          <ReservationInfoRow
            icon={<Wine size={14} className="text-[#E5C07B]/70" />}
            label="Evento"
            value={`"${details.type}"`}
            valueClassName="text-xs font-medium italic text-[#E5C07B]"
          />
        </div>

        <div className="modal-reveal mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <span
            className={`text-[9px] font-black uppercase tracking-widest ${
              table.status === "ocupada" ? "text-red-400" : "text-zinc-400"
            }`}
          >
            {table.status === "ocupada" ? "● En Servicio" : "○ Pendiente"}
          </span>
          <button className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-zinc-500 transition-colors hover:text-white">
            Ver Detalle <ChevronRight size={10} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const TablesView = ({ tables, reservations }: TablesViewProps) => {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  const tableDetailsById = useMemo(
    () =>
      new Map<number, TableDetails | null>(
        tables.map((table) => [table.id, getTableDetails(table, reservations)])
      ),
    [tables, reservations]
  );

  useEffect(() => {
    if (!hoveredTable) {
      return;
    }

    const selectors = getModalSelectors(hoveredTable);
    killModalTweens(hoveredTable);

    const revealTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    revealTimeline.fromTo(selectors.modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    revealTimeline.fromTo(
      selectors.content,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.05 },
      "-=0.1"
    );

    return () => {
      revealTimeline.kill();
    };
  }, [hoveredTable]);

  const handleTableHover = (tableId: number, isHovering: boolean): void => {
    const selectors = getModalSelectors(tableId);

    if (isHovering) {
      if (hoveredTable === tableId) {
        killModalTweens(tableId);
        gsap.to(selectors.modal, { opacity: 1, duration: 0.2 });
        gsap.to(selectors.content, { opacity: 1, y: 0, duration: 0.2 });
        return;
      }

      setHoveredTable(tableId);
      return;
    }

    killModalTweens(tableId);

    const hideTimeline = gsap.timeline({
      onComplete: () => {
        setHoveredTable((previousTableId) =>
          previousTableId === tableId ? null : previousTableId
        );
      },
    });

    hideTimeline.to(selectors.content, {
      opacity: 0,
      y: -5,
      duration: 0.2,
      stagger: 0.02,
      ease: "power2.in",
    });

    hideTimeline.to(
      selectors.modal,
      { opacity: 0, duration: 0.3, ease: "power2.in" },
      "-=0.15"
    );
  };

  return (
    <div className="grid max-w-5xl grid-cols-2 gap-4 py-2 animate-in fade-in duration-500 sm:gap-6 sm:py-4 md:grid-cols-3 md:gap-8">
      {tables.map((table) => {
        const details = tableDetailsById.get(table.id) ?? null;
        const statusStyle = TABLE_STATUS_STYLE[table.status];

        return (
          <div
            key={table.id}
            onMouseEnter={() => handleTableHover(table.id, true)}
            onMouseLeave={() => handleTableHover(table.id, false)}
            className="glass-panel group relative aspect-square cursor-pointer overflow-hidden rounded-[1.6rem] transition-all hover:border-[#E5C07B]/40 sm:rounded-[2.5rem]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${statusStyle.ambientGradientClass}`}
            />

            {hoveredTable === table.id && details && (
              <div
                className={`table-modal-${table.id} absolute inset-0 z-20 flex flex-col justify-center overflow-hidden rounded-[inherit] border bg-black/80 p-4 shadow-2xl backdrop-blur-md sm:p-6 ${statusStyle.modalBorderClass}`}
              >
                <div
                  className={`h-1 w-full bg-gradient-to-r from-transparent to-transparent opacity-50 ${statusStyle.modalLineClass}`}
                />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent ${statusStyle.modalGlowClass}`}
                />

                <div className="relative z-10 flex h-full w-full flex-col justify-center">
                  <TableOverlayContent table={table} details={details} />
                </div>
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 sm:gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500 sm:tracking-[0.4em]">
                Mesa
              </span>
              <span className={`font-serif text-4xl transition-colors sm:text-6xl ${statusStyle.numberClass}`}>
                {table.id % 100}
              </span>
              <div
                className={`mt-2 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md sm:px-4 sm:py-1.5 ${statusStyle.badgeClass}`}
              >
                {table.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TablesView;

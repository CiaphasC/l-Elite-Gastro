import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { TableInfo } from "@/types";

interface SortableTableCardProps {
  table: TableInfo;
  displayOrder: number;
  statusBadgeClassName: string;
  onEditTable: (table: TableInfo) => void;
  onRequestRemoveTable: (table: TableInfo) => void;
}

const SortableTableCard = ({
  table,
  displayOrder,
  statusBadgeClassName,
  onEditTable,
  onRequestRemoveTable,
}: SortableTableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: table.id.toString(),
    transition: {
      duration: 140,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 0,
  };

  const cannotDelete = table.status === "ocupada" || table.status === "reservada";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass-panel group relative overflow-hidden rounded-[2rem] border border-white/10 p-6 transition-colors duration-300 will-change-transform hover:border-[#E5C07B]/30 ${
        isDragging ? "opacity-90 shadow-[0_18px_40px_rgba(0,0,0,0.45)]" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#E5C07B]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500">
            {table.code}
          </p>
          <h4 className="mt-2 font-serif text-2xl text-white">Mesa {displayOrder}</h4>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">{table.name}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="touch-none cursor-grab rounded-lg border border-white/10 bg-black/20 p-2.5 text-zinc-500 transition-colors duration-200 hover:border-[#E5C07B]/30 hover:text-[#E5C07B] active:cursor-grabbing"
            aria-label={`Reordenar Mesa ${displayOrder}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEditTable(table)}
            className="rounded-lg border border-white/10 bg-black/20 p-2 text-zinc-500 transition-all hover:border-[#E5C07B]/30 hover:text-[#E5C07B]"
            aria-label={`Editar Mesa ${displayOrder}`}
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onRequestRemoveTable(table)}
            disabled={cannotDelete}
            className={`rounded-lg border p-2 transition-all ${
              cannotDelete
                ? "cursor-not-allowed border-white/10 bg-black/20 text-zinc-700"
                : "border-white/10 bg-black/20 text-zinc-500 hover:border-red-500/30 hover:text-red-400"
            }`}
            aria-label={`Eliminar Mesa ${displayOrder}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
          Capacidad {table.capacity} pax
        </div>
        <div
          className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-wider ${statusBadgeClassName}`}
        >
          {table.status}
        </div>
      </div>
    </div>
  );
};

export default SortableTableCard;

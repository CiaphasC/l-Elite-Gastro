import { ShieldCheck, Users } from "lucide-react";
import type { WorkerAccount } from "@/types";
import type { WorkerListMode } from "@/features/management/hooks/useFilteredWorkers";

interface WorkerAccountsTableProps {
  workers: WorkerAccount[];
  mode: WorkerListMode;
  emptyMessage: string;
  onValidateWorker: (workerId: string) => void;
  onEditWorker: (worker: WorkerAccount) => void;
  onRemoveWorker: (workerId: string) => void;
}

const roleLabelMap: Record<WorkerAccount["role"], string> = {
  admin: "Admin",
  waiter: "Mesero",
};

const formatWorkerDate = (dateValue: string | null): string => {
  if (!dateValue) {
    return "No definida";
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return parsedDate.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const WorkerAccountsTable = ({
  workers,
  mode,
  emptyMessage,
  onValidateWorker,
  onEditWorker,
  onRemoveWorker,
}: WorkerAccountsTableProps) => {
  if (workers.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-center text-zinc-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workers.map((worker) => (
        <div
          key={worker.id}
          className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-white/5 xl:flex-row xl:items-center xl:justify-between"
        >
          <div className="min-w-0">
            <h4 className="truncate text-base font-medium text-white">{worker.fullName}</h4>
            <p className="truncate text-xs text-zinc-500">{worker.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              <Users size={11} /> {roleLabelMap[worker.role]}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                worker.status === "active"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              {worker.status === "active" ? "Activo" : "Pendiente"}
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Inicio {formatWorkerDate(worker.startedAt)}
            </span>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Creación {formatWorkerDate(worker.createdAt)}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                worker.validatedAt
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-600/60 bg-zinc-800/40 text-zinc-400"
              }`}
            >
              Validación {formatWorkerDate(worker.validatedAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {mode === "validation" && worker.status === "pending" && (
              <button
                type="button"
                onClick={() => onValidateWorker(worker.id)}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-300 transition-all hover:bg-emerald-500/20"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Validar
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onEditWorker(worker)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-all hover:border-[#E5C07B]/30 hover:text-[#E5C07B]"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onRemoveWorker(worker.id)}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-300 transition-all hover:bg-red-500/20"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkerAccountsTable;

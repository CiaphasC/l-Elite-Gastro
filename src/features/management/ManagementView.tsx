import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import type { DragEndEvent } from "@dnd-kit/core";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import {
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import TableCreateModal from "@/features/management/components/TableCreateModal";
import WorkerFormModal from "@/features/management/components/WorkerFormModal";
import WorkerAccountsTable from "@/features/management/components/WorkerAccountsTable";
import SortableTableCard from "@/features/management/components/SortableTableCard";
import ActionConfirmModal from "@/shared/components/ActionConfirmModal";
import {
  useFilteredWorkers,
  type WorkerListMode,
  type WorkerRoleFilter,
} from "@/features/management/hooks/useFilteredWorkers";
import type { TableInfo, TableManagementPayload, WorkerAccount, WorkerAccountPayload } from "@/types";

interface ManagementViewProps {
  tables: TableInfo[];
  workers: WorkerAccount[];
  onAddTable: (payload: TableManagementPayload) => void;
  onUpdateTable: (tableId: number, payload: TableManagementPayload) => void;
  onRemoveTable: (tableId: number) => void;
  onReorderTables: (activeTableId: number, overTableId: number) => void;
  onCreateWorker: (payload: WorkerAccountPayload) => void;
  onUpdateWorker: (workerId: string, payload: WorkerAccountPayload) => void;
  onValidateWorker: (workerId: string) => void;
  onRemoveWorker: (workerId: string) => void;
}

type ManagementTab = "tables" | "workers";

const tableStatusBadgeMap: Record<TableInfo["status"], string> = {
  disponible: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  ocupada: "border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B]",
  reservada: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  limpieza: "border-blue-500/20 bg-blue-500/10 text-blue-300",
};

const ManagementView = ({
  tables,
  workers,
  onAddTable,
  onUpdateTable,
  onRemoveTable,
  onReorderTables,
  onCreateWorker,
  onUpdateWorker,
  onValidateWorker,
  onRemoveWorker,
}: ManagementViewProps) => {
  const [activeTab, setActiveTab] = useState<ManagementTab>("tables");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableInfo | null>(null);
  const [tablePendingDeletion, setTablePendingDeletion] = useState<TableInfo | null>(null);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<WorkerAccount | null>(null);
  const [workerSearchTerm, setWorkerSearchTerm] = useState("");
  const [workerListMode, setWorkerListMode] = useState<WorkerListMode>("listing");
  const [workerRoleFilter, setWorkerRoleFilter] = useState<WorkerRoleFilter>("all");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableSortSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.fromTo(
      node.querySelectorAll(".management-animate"),
      { opacity: 0, y: 14, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.07 }
    );

    return () => {
      timeline.kill();
    };
  }, [activeTab]);

  const { filteredWorkers, scopedWorkers, roleScopedCounts } = useFilteredWorkers({
    workers,
    searchTerm: workerSearchTerm,
    mode: workerListMode,
    roleFilter: workerRoleFilter,
  });

  const existingWorkerEmailsForModal = useMemo(() => {
    if (!editingWorker) {
      return workers.map((worker) => worker.email);
    }

    return workers
      .filter((worker) => worker.id !== editingWorker.id)
      .map((worker) => worker.email);
  }, [workers, editingWorker]);

  const openCreateWorkerModal = () => {
    setEditingWorker(null);
    setIsWorkerModalOpen(true);
  };

  const openEditWorkerModal = (worker: WorkerAccount) => {
    setEditingWorker(worker);
    setIsWorkerModalOpen(true);
  };

  const openCreateTableModal = () => {
    setEditingTable(null);
    setIsTableModalOpen(true);
  };

  const openEditTableModal = (table: TableInfo) => {
    setEditingTable(table);
    setIsTableModalOpen(true);
  };

  const openDeleteTableModal = (table: TableInfo) => {
    setTablePendingDeletion(table);
  };

  const handleCloseDeleteTableModal = () => {
    setTablePendingDeletion(null);
  };

  const handleConfirmTableDeletion = () => {
    if (!tablePendingDeletion) {
      return;
    }

    onRemoveTable(tablePendingDeletion.id);
    setTablePendingDeletion(null);
  };

  const tableSortableItems = useMemo(
    () => tables.map((table) => table.id.toString()),
    [tables]
  );

  const handleTableDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeTableId = Number(active.id);
    const overTableId = Number(over.id);
    if (!Number.isFinite(activeTableId) || !Number.isFinite(overTableId)) {
      return;
    }

    onReorderTables(activeTableId, overTableId);
  };

  return (
    <div ref={containerRef} className="space-y-7">
      <div className="management-animate flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/5 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("tables")}
            className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
              activeTab === "tables"
                ? "bg-[#E5C07B] text-black shadow-[0_0_18px_rgba(229,192,123,0.3)]"
                : "text-[#E5C07B]/60 hover:text-[#E5C07B]"
            }`}
          >
            Gestion de Mesas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("workers")}
            className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
              activeTab === "workers"
                ? "bg-[#E5C07B] text-black shadow-[0_0_18px_rgba(229,192,123,0.3)]"
                : "text-[#E5C07B]/60 hover:text-[#E5C07B]"
            }`}
          >
            Trabajadores
          </button>
        </div>

        {activeTab === "tables" ? (
          <button
            type="button"
            onClick={openCreateTableModal}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02]"
          >
            <span className="relative inline-flex items-center gap-2">
              <Plus size={14} /> Nueva Mesa
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={openCreateWorkerModal}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-[1.02]"
          >
            <span className="relative inline-flex items-center gap-2">
              <Plus size={14} /> Nuevo Trabajador
            </span>
          </button>
        )}
      </div>

      {activeTab === "tables" ? (
        <DndContext
          sensors={tableSortSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleTableDragEnd}
        >
          <SortableContext items={tableSortableItems} strategy={rectSortingStrategy}>
            <div className="management-animate grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {tables.map((table, index) => (
                <SortableTableCard
                  key={table.id}
                  table={table}
                  displayOrder={index + 1}
                  statusBadgeClassName={tableStatusBadgeMap[table.status]}
                  onEditTable={openEditTableModal}
                  onRequestRemoveTable={openDeleteTableModal}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="management-animate glass-panel rounded-[2rem] border border-white/10 p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/5 p-1">
                <button
                  type="button"
                  onClick={() => setWorkerListMode("validation")}
                  className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                    workerListMode === "validation"
                      ? "bg-[#E5C07B] text-black shadow-[0_0_18px_rgba(229,192,123,0.3)]"
                      : "text-[#E5C07B]/60 hover:text-[#E5C07B]"
                  }`}
                >
                  Validación
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerListMode("listing")}
                  className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-all ${
                    workerListMode === "listing"
                      ? "bg-[#E5C07B] text-black shadow-[0_0_18px_rgba(229,192,123,0.3)]"
                      : "text-[#E5C07B]/60 hover:text-[#E5C07B]"
                  }`}
                >
                  Listado
                </button>
              </div>

              <div className="flex rounded-full border border-white/10 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setWorkerRoleFilter("all")}
                  className={`rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    workerRoleFilter === "all"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Todos ({scopedWorkers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerRoleFilter("admin")}
                  className={`rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    workerRoleFilter === "admin"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Admin ({roleScopedCounts.admin})
                </button>
                <button
                  type="button"
                  onClick={() => setWorkerRoleFilter("waiter")}
                  className={`rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    workerRoleFilter === "waiter"
                      ? "bg-white/15 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Mesero ({roleScopedCounts.waiter})
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="group relative w-full max-w-sm">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
                />
                <input
                  value={workerSearchTerm}
                  onChange={(event) => setWorkerSearchTerm(event.target.value)}
                  placeholder="Filtrar por nombre o correo..."
                  className="w-full rounded-full border border-white/10 bg-black/30 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-[#E5C07B]/40 focus:bg-black/50"
                />
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {filteredWorkers.length} de {scopedWorkers.length} cuentas
              </span>
            </div>
          </div>

          <WorkerAccountsTable
            workers={filteredWorkers}
            mode={workerListMode}
            emptyMessage={
              workerListMode === "validation"
                ? "No hay cuentas pendientes de validación para este filtro."
                : "No hay cuentas activas para este filtro."
            }
            onValidateWorker={onValidateWorker}
            onEditWorker={openEditWorkerModal}
            onRemoveWorker={onRemoveWorker}
          />
        </div>
      )}

      <TableCreateModal
        key={`table-modal-${isTableModalOpen ? editingTable?.id ?? "create" : "closed"}`}
        isOpen={isTableModalOpen}
        mode={editingTable ? "edit" : "create"}
        initialTable={editingTable}
        onClose={() => {
          setIsTableModalOpen(false);
          setEditingTable(null);
        }}
        onSubmit={(payload) => {
          if (editingTable) {
            onUpdateTable(editingTable.id, payload);
            setEditingTable(null);
            return;
          }
          onAddTable(payload);
        }}
      />

      <WorkerFormModal
        key={`worker-modal-${isWorkerModalOpen ? editingWorker?.id ?? "create" : "closed"}`}
        isOpen={isWorkerModalOpen}
        mode={editingWorker ? "edit" : "create"}
        initialWorker={editingWorker}
        existingEmails={existingWorkerEmailsForModal}
        onClose={() => {
          setIsWorkerModalOpen(false);
          setEditingWorker(null);
        }}
        onSubmit={(payload) => {
          if (editingWorker) {
            onUpdateWorker(editingWorker.id, payload);
            return;
          }
          onCreateWorker(payload);
        }}
      />

      {tablePendingDeletion && (
        <ActionConfirmModal
          isOpen
          title="Eliminar Mesa"
          subtitle={`¿Confirma que desea eliminar el registro de la mesa ${tablePendingDeletion.code}? Esta acción retirará la mesa del plano de servicio.`}
          actionLabel="Iniciar Eliminación de Mesa"
          icon={<Trash2 size={20} />}
          onClose={handleCloseDeleteTableModal}
          onConfirm={handleConfirmTableDeletion}
          backdropClassName="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        />
      )}
    </div>
  );
};

export default ManagementView;

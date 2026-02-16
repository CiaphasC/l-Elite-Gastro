import { useMemo } from "react";
import type { WorkerAccount } from "@/types";

export type WorkerListMode = "validation" | "listing";
export type WorkerRoleFilter = "all" | WorkerAccount["role"];

interface UseFilteredWorkersOptions {
  workers: WorkerAccount[];
  searchTerm: string;
  mode: WorkerListMode;
  roleFilter: WorkerRoleFilter;
}

interface UseFilteredWorkersResult {
  filteredWorkers: WorkerAccount[];
  scopedWorkers: WorkerAccount[];
  roleScopedCounts: {
    admin: number;
    waiter: number;
  };
}

export const useFilteredWorkers = ({
  workers,
  searchTerm,
  mode,
  roleFilter,
}: UseFilteredWorkersOptions): UseFilteredWorkersResult =>
  useMemo(() => {
    const scopedWorkers = workers.filter((worker) =>
      mode === "validation" ? worker.status === "pending" : worker.status === "active"
    );

    const roleScopedCounts = {
      admin: scopedWorkers.filter((worker) => worker.role === "admin").length,
      waiter: scopedWorkers.filter((worker) => worker.role === "waiter").length,
    };

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const filteredWorkers = scopedWorkers.filter((worker) => {
      if (roleFilter !== "all" && worker.role !== roleFilter) {
        return false;
      }

      if (!normalizedTerm) {
        return true;
      }

      return (
        worker.fullName.toLowerCase().includes(normalizedTerm) ||
        worker.email.toLowerCase().includes(normalizedTerm)
      );
    });

    return {
      filteredWorkers,
      scopedWorkers,
      roleScopedCounts,
    };
  }, [workers, searchTerm, mode, roleFilter]);

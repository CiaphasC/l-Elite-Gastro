import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRestaurantBootstrap,
  RESTAURANT_BOOTSTRAP_QUERY_KEY,
} from "@/domain/services/bootstrapService";
import RestaurantSystem from "@/app/RestaurantSystem";
import LandingPage from "@/features/landing/LandingPage";
import LoadingScreen from "@/shared/components/LoadingScreen";
import { useRestaurantActions } from "@/store/hooks";
import type { UserRole } from "@/types";

type AppView = "landing" | "system";

const App = () => {
  const { hydrateState, setActiveTab } = useRestaurantActions();
  const [view, setView] = useState<AppView>("landing");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const bootstrapQuery = useQuery({
    queryKey: RESTAURANT_BOOTSTRAP_QUERY_KEY,
    queryFn: fetchRestaurantBootstrap,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (!bootstrapQuery.data) {
      return;
    }

    hydrateState(bootstrapQuery.data);
  }, [bootstrapQuery.data, hydrateState]);

  if (bootstrapQuery.isPending) {
    return <LoadingScreen />;
  }

  if (bootstrapQuery.isError) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-[#050505] p-6 text-zinc-300">
        <div className="glass-panel w-full max-w-md rounded-3xl border border-red-500/20 p-8 text-center">
          <h1 className="mb-3 font-serif text-3xl text-white">No se pudo iniciar el sistema</h1>
          <p className="mb-8 text-sm text-zinc-400">
            Ocurrio un error cargando los datos iniciales. Intenta nuevamente.
          </p>
          <button
            type="button"
            onClick={() => bootstrapQuery.refetch()}
            className="rounded-xl bg-[#E5C07B] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#c4a162]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#050505] text-zinc-300">
      {view === "landing" ? (
        <LandingPage
          onEnter={(role) => {
            if (bootstrapQuery.data) {
              hydrateState(bootstrapQuery.data);
            }

            setUserRole(role);
            setActiveTab(role === "waiter" ? "menu" : "dash");
            setView("system");
          }}
        />
      ) : (
        <RestaurantSystem role={userRole} onLogout={() => setView("landing")} />
      )}
    </div>
  );
};

export default App;

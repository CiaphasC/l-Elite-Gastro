import { useEffect, useState } from "react";
import RestaurantSystem from "@/app/RestaurantSystem";
import LandingPage from "@/features/landing/LandingPage";
import LoadingScreen from "@/shared/components/LoadingScreen";

type AppView = "landing" | "system";
const INITIAL_BOOT_DELAY_MS = 900;

const App = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState<AppView>("landing");

  // We keep a lightweight boot loader before showing the landing to avoid startup flashes.
  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setIsBooting(false);
    }, INITIAL_BOOT_DELAY_MS);

    return () => window.clearTimeout(bootTimer);
  }, []);

  if (isBooting) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#050505] text-zinc-300">
      {view === "landing" ? (
        <LandingPage onEnter={() => setView("system")} />
      ) : (
        <RestaurantSystem onLogout={() => setView("landing")} />
      )}
    </div>
  );
};

export default App;

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { deriveSelectedClient } from "@/domain/selectors";
import { featureRegistry, orderedFeatureModules } from "@/features/registry";
import MobileTabNav from "@/features/layout/MobileTabNav";
import Sidebar from "@/features/layout/Sidebar";
import WaiterDock from "@/features/layout/WaiterDock";
import ClientDetailView from "@/features/clients/ClientDetailView";
import SystemHeader from "@/app/components/SystemHeader";
import SystemCartLayer from "@/app/components/SystemCartLayer";
import SystemModalLayer from "@/app/components/SystemModalLayer";
import { useRestaurantAction, useRestaurantSelector } from "@/store/hooks";
import type { ActiveTab, UserRole } from "@/types";

interface RestaurantSystemProps {
  role: UserRole;
  onLogout: () => void;
}

const WAITER_ALLOWED_TABS: readonly ActiveTab[] = ["menu", "tables", "reservations"];

const RestaurantSystem = ({ role, onLogout }: RestaurantSystemProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const isLogoutTransitionRunningRef = useRef(false);

  const activeTab = useRestaurantSelector((state) => state.activeTab);
  const currencyCode = useRestaurantSelector((state) => state.currencyCode);
  const selectedClient = useRestaurantSelector((state) =>
    deriveSelectedClient(state.clients, state.ui.selectedClientId)
  );

  const setActiveTab = useRestaurantAction("setActiveTab");
  const closeClientDetail = useRestaurantAction("closeClientDetail");

  useEffect(() => {
    if (!rootRef.current || !mainContentRef.current) {
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .to(rootRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.95,
        ease: "power2.out",
      })
      .fromTo(
        mainContentRef.current,
        { opacity: 0, y: 20, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
        "-=0.65"
      );

    return () => {
      timeline.kill();
    };
  }, []);

  const handleLogout = () => {
    if (isLogoutTransitionRunningRef.current) {
      return;
    }

    if (!rootRef.current) {
      onLogout();
      return;
    }

    isLogoutTransitionRunningRef.current = true;
    gsap.killTweensOf(rootRef.current);

    gsap.to(rootRef.current, {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.985,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: () => {
        isLogoutTransitionRunningRef.current = false;
        onLogout();
      },
    });
  };

  const allowedTabs = useMemo<readonly ActiveTab[]>(
    () =>
      role === "waiter"
        ? WAITER_ALLOWED_TABS
        : orderedFeatureModules.map((featureModule) => featureModule.id),
    [role]
  );
  const allowedTabSet = useMemo(() => new Set<ActiveTab>(allowedTabs), [allowedTabs]);
  const effectiveActiveTab = allowedTabSet.has(activeTab) ? activeTab : allowedTabs[0];
  const activeFeature = featureRegistry[effectiveActiveTab];
  const isAdmin = role === "admin";

  const handleTabChange = (tabId: ActiveTab) => {
    if (!allowedTabSet.has(tabId)) {
      return;
    }

    setActiveTab(tabId);
  };

  useEffect(() => {
    if (allowedTabSet.has(activeTab)) {
      return;
    }

    setActiveTab(allowedTabs[0]);
  }, [activeTab, allowedTabSet, allowedTabs, setActiveTab]);

  useEffect(() => {
    if (role !== "waiter" || !selectedClient) {
      return;
    }

    closeClientDetail();
  }, [closeClientDetail, role, selectedClient]);

  if (selectedClient && isAdmin) {
    return (
      <div className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300">
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        </div>

        <main className="relative z-10 h-full flex-1">
          <ClientDetailView
            client={selectedClient}
            currencyCode={currencyCode}
            onBack={closeClientDetail}
          />
        </main>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative flex h-dvh min-h-dvh select-none overflow-hidden bg-[#050505] text-zinc-300 opacity-0 [filter:blur(14px)] [transform:scale(1.01)]"
    >
      <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-[#E5C07B]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-[#E5C07B]/5 blur-[120px]" />
      </div>

      {isAdmin && (
        <Sidebar
          activeTab={effectiveActiveTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />
      )}

      <main
        ref={mainContentRef}
        className="custom-scroll relative z-10 flex-1 overflow-y-auto px-4 pb-28 pt-5 sm:px-6 sm:pt-6 lg:p-10 lg:pb-10"
      >
        <SystemHeader
          role={role}
          title={activeFeature.title}
          showSearch={activeFeature.searchEnabled}
        />
        {isAdmin && (
          <MobileTabNav activeTab={effectiveActiveTab} onTabChange={handleTabChange} />
        )}
        {activeFeature.render()}
      </main>

      <SystemCartLayer enabled={isAdmin} />
      <SystemModalLayer isAdmin={isAdmin} />

      {!isAdmin && (
        <WaiterDock
          activeTab={effectiveActiveTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default RestaurantSystem;

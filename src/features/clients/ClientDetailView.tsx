import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  Crown,
  Phone,
  Receipt,
  Star,
  UserCheck,
  Utensils,
} from "lucide-react";
import { gsap } from "gsap";
import {
  buildGroupedClientHistory,
  calculateClientHistoryTotals,
  resolveClientHistory,
} from "@/domain/clientHistory";
import PreferencesModal from "@/features/modals/PreferencesModal";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
import { formatCurrency } from "@/shared/formatters/currency";
import type { Client, SupportedCurrencyCode } from "@/types";

interface ClientDetailViewProps {
  client: Client;
  currencyCode: SupportedCurrencyCode;
  onBack: () => void;
}

const ClientDetailView = ({ client, currencyCode, onBack }: ClientDetailViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const animatedElements = containerRef.current.querySelectorAll<HTMLElement>(".animate-enter");
    const timeline = gsap.timeline();

    timeline.fromTo(
      animatedElements,
      { y: 30, opacity: 0, filter: "blur(10px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );

    return () => {
      timeline.kill();
    };
  }, []);

  const history = useMemo(() => resolveClientHistory(client), [client]);
  const groupedHistory = useMemo(() => buildGroupedClientHistory(history), [history]);
  const totals = useMemo(() => calculateClientHistoryTotals(history), [history]);
  const preferencesLabel = client.preferences.trim()
    ? client.preferences
    : "Sin preferencias registradas.";

  return (
    <div ref={containerRef} className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative z-20 flex-none border-b border-white/5 bg-[#0A0A0A]/50 p-8 backdrop-blur-xl md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[3rem]">
          <PremiumParticleBackground
            intensity={0.5}
            className="absolute inset-0 z-0 rounded-b-[3rem] opacity-60"
          />
          <div className="absolute left-[-8%] top-[-10%] h-[55%] w-[40%] rounded-full bg-[#E5C07B]/10 blur-[120px]" />
          <div className="absolute right-[-10%] top-[-5%] h-[55%] w-[35%] rounded-full bg-[#E5C07B]/5 blur-[130px]" />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="animate-enter flex items-center gap-6">
            <button
              onClick={onBack}
              className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            </button>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h2 className="font-serif text-4xl tracking-tight text-white">{client.name}</h2>
                {client.tier === "Gold" && (
                  <Crown size={20} className="text-[#E5C07B]" fill="currentColor" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-6 font-mono text-sm text-zinc-400">
                <span className="flex items-center gap-2">
                  <UserCheck size={14} /> {client.docType}: {client.docNumber || "---"}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} /> {client.phone || "---"}
                </span>
              </div>
            </div>
          </div>

          <div className="animate-enter flex gap-4">
            <div className="glass-panel min-w-[140px] rounded-2xl p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Gasto Total
              </p>
              <p className="font-mono text-2xl text-[#E5C07B]">
                {formatCurrency(totals.totalSpend, currencyCode)}
              </p>
            </div>
            <div className="glass-panel min-w-[140px] rounded-2xl p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Visitas
              </p>
              <p className="font-mono text-2xl text-white">{totals.totalVisits}</p>
            </div>
          </div>
        </div>

        <div className="animate-enter relative z-10 mt-8">
          <button
            onClick={() => setIsPreferencesModalOpen(true)}
            className="group inline-flex max-w-full cursor-pointer items-center gap-2 rounded-xl border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-4 py-2 text-left text-xs font-bold text-[#E5C07B] transition-all hover:bg-[#E5C07B]/20"
          >
            <Star size={14} className="shrink-0" />
            <span className="shrink-0">Preferencias:</span>
            <span className="block max-w-[200px] truncate font-normal italic text-zinc-300 md:max-w-[400px]">
              "{preferencesLabel}"
            </span>
            <span className="ml-2 shrink-0 rounded bg-[#E5C07B] px-1.5 py-0.5 text-[10px] text-black opacity-0 transition-opacity group-hover:opacity-100">
              Ver
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden p-6 md:p-10">
        <div className="animate-enter glass-panel relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/5 p-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="flex items-center gap-3 font-serif text-2xl text-white">
              <Receipt className="text-[#E5C07B]" /> Historial de Experiencias
            </h3>
            <div className="font-mono text-xs text-zinc-500">
              Última visita: <span className="text-white">{client.lastVisit}</span>
            </div>
          </div>

          <div className="custom-scroll flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-[#0A0A0A]">
                <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="pb-4 pl-4 font-black">Fecha</th>
                  <th className="pb-4 font-black">Evento</th>
                  <th className="pb-4 text-center font-black">Mesa</th>
                  <th className="w-2/5 pb-4 font-black">Consumo (Platillos/Bebidas)</th>
                  <th className="pb-4 pr-4 text-right font-black">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groupedHistory.map((group) => (
                  <Fragment key={group.key}>
                    <tr key={`${group.key}-separator`} className="border-y border-white/5 bg-[#E5C07B]/5">
                      <td colSpan={5} className="py-2 pl-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-[#E5C07B]" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5C07B]">
                            {group.key}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {group.items.map((historyItem) => (
                      <tr key={historyItem.id} className="transition-colors hover:bg-white/5">
                        <td className="py-5 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-zinc-400">
                              <CalendarDays size={14} />
                            </div>
                            <span className="font-mono text-sm text-white">{historyItem.date}</span>
                          </div>
                        </td>

                        <td className="py-5">
                          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                            {historyItem.type}
                          </span>
                        </td>

                        <td className="py-5 text-center">
                          <span className="font-mono text-sm text-[#E5C07B]">{historyItem.table}</span>
                        </td>

                        <td className="py-5">
                          <div className="flex flex-col gap-1">
                            {historyItem.items.map((item, index) => (
                              <div
                                key={`${historyItem.id}-${index}`}
                                className="flex items-center gap-2 text-xs text-zinc-400"
                              >
                                <Utensils size={10} className="text-zinc-600" /> {item}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-5 pr-4 text-right">
                          <span className="font-mono text-lg font-bold text-white">
                            {formatCurrency(historyItem.total, currencyCode)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PreferencesModal
        isOpen={isPreferencesModalOpen}
        preferences={preferencesLabel}
        onClose={() => setIsPreferencesModalOpen(false)}
      />
    </div>
  );
};

export default ClientDetailView;

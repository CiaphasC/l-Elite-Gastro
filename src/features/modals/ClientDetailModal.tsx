import { CalendarDays, Crown, Phone, Receipt, Star, UserCheck, X } from "lucide-react";
import { formatCurrency } from "@/shared/formatters/currency";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { Client, SupportedCurrencyCode } from "@/types";

interface ClientDetailModalProps {
  client: Client | null;
  currencyCode: SupportedCurrencyCode;
  onClose: () => void;
}

const ClientDetailModal = ({ client, currencyCode, onClose }: ClientDetailModalProps) => {
  if (!client) {
    return null;
  }

  return (
    <ModalBackdrop onRequestClose={onClose}>
      <div className="glass-panel custom-scroll relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2.5rem] border border-white/10 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#E5C07B]/10 blur-[100px]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 rounded-full border border-white/10 p-2 text-zinc-500 transition-colors hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="relative z-10">
          <div className="mb-8 flex flex-col gap-5 border-b border-white/5 pb-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h3 className="font-serif text-3xl text-white">{client.name}</h3>
                {client.tier === "Gold" && <Crown size={18} className="text-[#E5C07B]" fill="currentColor" />}
              </div>
              <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400">
                <span className="flex items-center gap-2">
                  <UserCheck size={14} />
                  {client.docType}: {client.docNumber}
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} />
                  {client.phone || "---"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel rounded-2xl p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Gasto Total</p>
                <p className="font-mono text-2xl text-[#E5C07B]">{formatCurrency(client.spend, currencyCode)}</p>
              </div>
              <div className="glass-panel rounded-2xl p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Visitas</p>
                <p className="font-mono text-2xl text-white">{client.visits}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-[#E5C07B]/20 bg-[#E5C07B]/10 p-4">
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B]">
              <Star size={12} />
              Preferencias y Alergias
            </p>
            <p className="text-sm italic text-zinc-300">"{client.preferences || "Sin preferencias registradas."}"</p>
          </div>

          <div className="glass-panel rounded-[2rem] p-5 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-serif text-2xl text-white">
                <Receipt className="text-[#E5C07B]" size={20} />
                Historial de Experiencias
              </h4>
              <span className="text-xs text-zinc-500">Ultima visita: {client.lastVisit}</span>
            </div>

            {client.history.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-zinc-500">
                <CalendarDays size={32} className="mb-3 opacity-40" />
                <p className="text-sm">Sin historial registrado todavia.</p>
              </div>
            ) : (
              <div className="custom-scroll overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      <th className="pb-4 pl-2 font-black">Fecha</th>
                      <th className="pb-4 font-black">Evento</th>
                      <th className="pb-4 font-black">Mesa</th>
                      <th className="pb-4 font-black">Consumo</th>
                      <th className="pb-4 pr-2 text-right font-black">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {client.history.map((historyItem) => (
                      <tr key={historyItem.id} className="transition-colors hover:bg-white/5">
                        <td className="py-4 pl-2 font-mono text-sm text-white">{historyItem.date}</td>
                        <td className="py-4">
                          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
                            {historyItem.type}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-sm text-[#E5C07B]">{historyItem.table}</td>
                        <td className="py-4 text-sm text-zinc-400">{historyItem.items.join(", ")}</td>
                        <td className="py-4 pr-2 text-right font-mono text-base text-white">
                          {formatCurrency(historyItem.total, currencyCode)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default ClientDetailModal;

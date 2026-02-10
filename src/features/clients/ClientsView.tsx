import { Eye, Star } from "lucide-react";
import type { Client } from "@/types";

interface ClientsViewProps {
  clients: Client[];
}

const ClientsView = ({ clients }: ClientsViewProps) => (
  <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 md:grid-cols-2">
    {clients.map((client) => (
      <div
        key={client.id}
        className="glass-panel group rounded-[2rem] p-5 transition-all hover:border-[#E5C07B]/30 sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 font-serif text-2xl text-[#E5C07B]">
              {client.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="truncate font-serif text-lg text-white sm:text-xl">{client.name}</h4>
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                  client.tier === "Platinum"
                    ? "border-zinc-500 text-zinc-300"
                    : "border-[#E5C07B]/30 text-[#E5C07B]"
                }`}
              >
                {client.tier} Member
              </span>
            </div>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all hover:border-white hover:text-white">
            <Eye size={18} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 border-b border-white/5 pb-6 sm:grid-cols-3">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Visitas</p>
            <p className="font-mono text-white">{client.visits}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
              Gasto Total
            </p>
            <p className="font-mono text-[#E5C07B]">{client.spend}</p>
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">
              Ultima Vez
            </p>
            <p className="font-mono text-white">{client.lastVisit}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
            <Star size={12} className="text-[#E5C07B]" /> Preferencias
          </p>
          <p className="text-sm italic text-zinc-300">"{client.preferences}"</p>
        </div>
      </div>
    ))}

    {clients.length === 0 && (
      <div className="glass-panel col-span-full rounded-[2rem] p-12 text-center text-zinc-500">
        No hay clientes que coincidan con la busqueda.
      </div>
    )}
  </div>
);

export default ClientsView;


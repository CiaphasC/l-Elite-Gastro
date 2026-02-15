import { Crown, Edit, Eye, Grid2X2, List, Plus, Star } from "lucide-react";
import { formatCurrency } from "@/shared/formatters/currency";
import type { Client, ClientFilter, ClientViewMode, SupportedCurrencyCode } from "@/types";

interface ClientsViewProps {
  clients: Client[];
  currencyCode: SupportedCurrencyCode;
  filter: ClientFilter;
  viewMode: ClientViewMode;
  onFilterChange: (filter: ClientFilter) => void;
  onViewModeChange: (viewMode: ClientViewMode) => void;
  onCreateClient: (segment: ClientFilter) => void;
  onOpenClientDetail: (clientId: number) => void;
  onEditClient: (segment: ClientFilter, clientId: number) => void;
}

const formatClientName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return fullName;
  }

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  return `${firstName} ${lastName.charAt(0)}.`;
};

const ClientsView = ({
  clients,
  currencyCode,
  filter,
  viewMode,
  onFilterChange,
  onViewModeChange,
  onCreateClient,
  onOpenClientDetail,
  onEditClient,
}: ClientsViewProps) => {
  const showTableView = filter === "clients" && viewMode === "table";

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col justify-between gap-6 px-2 md:flex-row md:items-center">
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-2xl text-white">Gestion de Clientes</h3>
          <div className="flex items-center gap-4">
            <div className="flex w-fit gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => onFilterChange("clients")}
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === "clients"
                    ? "bg-[#E5C07B] text-black shadow-lg shadow-[#E5C07B]/20"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Clientes
              </button>
              <button
                onClick={() => onFilterChange("vip")}
                className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === "vip"
                    ? "bg-[#E5C07B] text-black shadow-lg shadow-[#E5C07B]/20"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Cartera VIP
              </button>
            </div>

            {filter === "clients" && (
              <div className="hidden gap-1 rounded-xl border border-white/10 bg-[#0A0A0A]/60 p-1.5 shadow-lg md:flex">
                <button
                  onClick={() => onViewModeChange("cards")}
                  className={`rounded-lg p-2.5 transition-all duration-300 ${
                    viewMode === "cards"
                      ? "bg-[#E5C07B] text-black shadow-[0_0_15px_rgba(229,192,123,0.3)]"
                      : "text-zinc-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  onClick={() => onViewModeChange("table")}
                  className={`rounded-lg p-2.5 transition-all duration-300 ${
                    viewMode === "table"
                      ? "bg-[#E5C07B] text-black shadow-[0_0_15px_rgba(229,192,123,0.3)]"
                      : "text-zinc-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onCreateClient(filter)}
          className="mt-2 flex items-center gap-2 self-start rounded-xl bg-[#E5C07B] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black shadow-lg shadow-[#E5C07B]/20 transition-colors hover:bg-[#c4a162]"
        >
          <Plus size={16} />
          Nuevo Cliente
        </button>
      </div>

      {showTableView ? (
        <div className="glass-panel animate-in fade-in overflow-x-auto rounded-[2rem] p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <th className="pb-3 pl-4 font-black">Cliente</th>
                <th className="pb-3 font-black">Estatus</th>
                <th className="pb-3 font-black">Visitas</th>
                <th className="pb-3 font-black">Gasto Total</th>
                <th className="pb-3 font-black">Ultima Vez</th>
                <th className="pb-3 pr-4 text-right font-black">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr key={client.id} className="group transition-colors hover:bg-white/5">
                  <td className="py-3 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 font-serif text-sm text-[#E5C07B]">
                        {formatClientName(client.name).charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {formatClientName(client.name)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Cliente
                    </span>
                  </td>
                  <td className="py-3 font-mono text-sm text-zinc-300">{client.visits}</td>
                  <td className="py-3 font-mono text-sm text-[#E5C07B]">
                    {formatCurrency(client.spend, currencyCode)}
                  </td>
                  <td className="py-3 font-mono text-sm text-zinc-400">{client.lastVisit}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenClientDetail(client.id)}
                        className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEditClient("clients", client.id)}
                        className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-white/10 hover:text-[#E5C07B]"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="glass-panel group animate-in slide-in-from-bottom-2 rounded-[2rem] p-8 transition-all duration-500 hover:border-[#E5C07B]/30"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 font-serif text-2xl text-[#E5C07B]">
                    {formatClientName(client.name).charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-white">{formatClientName(client.name)}</h4>
                    {client.tier === "Gold" ? (
                      <span className="rounded border border-[#E5C07B]/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#E5C07B]">
                        Gold Member
                      </span>
                    ) : (
                      <span className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Cliente
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenClientDetail(client.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all hover:border-white hover:text-white"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEditClient(filter, client.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all hover:border-[#E5C07B] hover:text-[#E5C07B]"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4 border-b border-white/5 pb-6">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Visitas</p>
                  <p className="font-mono text-white">{client.visits}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Gasto Total</p>
                  <p className="font-mono text-[#E5C07B]">{formatCurrency(client.spend, currencyCode)}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-zinc-500">Ultima Vez</p>
                  <p className="font-mono text-white">{client.lastVisit}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
                  {client.tier === "Gold" ? <Crown size={12} className="text-[#E5C07B]" /> : <Star size={12} className="text-[#E5C07B]" />}
                  Preferencias
                </p>
                <p className="line-clamp-2 overflow-hidden text-ellipsis text-sm italic text-zinc-300" title={client.preferences}>
                  "{client.preferences || "Sin preferencias registradas."}"
                </p>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="col-span-full flex h-64 flex-col items-center justify-center text-zinc-500 opacity-50">
              <Star size={48} className="mb-4" />
              <p className="font-serif">No hay clientes en esta categoria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsView;

import { Clock, CreditCard, Star, TrendingUp, Users } from "lucide-react";
import StatsCard from "../../shared/components/StatsCard";

const weeklyPerformance = [45, 72, 48, 95, 68, 88, 100];

const DashboardView = ({ stockAlerts, onOpenInventoryTab }) => (
  <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 md:grid-cols-2 lg:grid-cols-4">
    <StatsCard title="Ventas Netas" value="$4,820" trend="+12%" icon={<TrendingUp size={20} />} />
    <StatsCard title="Comensales" value="84" trend="+5%" icon={<Users size={20} />} />
    <StatsCard title="Ticket Medio" value="$157" trend="-2%" icon={<CreditCard size={20} />} />
    <StatsCard title="T. Servicio" value="14 min" trend="Optimo" icon={<Clock size={20} />} />

    <div className="glass-panel col-span-1 mt-4 rounded-[2rem] p-8 lg:col-span-3">
      <h3 className="mb-8 flex items-center gap-4 font-serif text-2xl text-white">
        <Star className="fill-[#E5C07B]/20 text-[#E5C07B]" size={20} />
        Rendimiento Semanal
      </h3>
      <div className="flex h-64 w-full items-end gap-4 px-4">
        {weeklyPerformance.map((height, index) => (
          <div
            key={`${index}-${height}`}
            className="group flex flex-1 cursor-pointer flex-col items-center gap-3"
          >
            <div
              className="relative w-full overflow-hidden rounded-t-lg bg-white/5 transition-all duration-500 group-hover:bg-[#E5C07B]/20"
              style={{ height: `${height}%` }}
            >
              <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-[#E5C07B]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute left-0 top-0 h-[2px] w-full bg-[#E5C07B] shadow-[0_0_10px_#E5C07B]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-[#E5C07B]">
              Dia {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="glass-panel mt-4 flex flex-col rounded-[2rem] p-8">
      <h3 className="mb-6 font-serif text-xl text-white">Alertas Stock</h3>
      <div className="flex-1 space-y-4">
        {stockAlerts.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm text-zinc-200 transition-colors group-hover:text-white">
                {item.name}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 group-hover:text-red-400">
                {item.stock} {item.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onOpenInventoryTab}
        className="mt-6 w-full rounded-xl border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-[#E5C07B] hover:text-[#E5C07B]"
      >
        Gestionar Bodega
      </button>
    </div>
  </div>
);

export default DashboardView;

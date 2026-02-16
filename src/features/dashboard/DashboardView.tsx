import { BarChart3, Calendar, CreditCard, PieChart, Star, TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "@/shared/formatters/currency";
import type { DashboardSnapshot, MenuItem, SupportedCurrencyCode } from "@/types";
import StatsCard from "@/shared/components/StatsCard";
import { useDashboardChartData } from "@/features/dashboard/hooks/useDashboardChartData";

interface DashboardViewProps {
  snapshot: DashboardSnapshot;
  currencyCode: SupportedCurrencyCode;
  stockAlerts: MenuItem[];
  onOpenInventoryTab: () => void;
}

const DashboardView = ({ snapshot, currencyCode, stockAlerts, onOpenInventoryTab }: DashboardViewProps) => {
  const { lineChart, barChart, donutChart, peakDay } = useDashboardChartData(snapshot);

  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Ventas Netas (Mes)"
        value={formatCurrency(snapshot.salesByPeriod.month, currencyCode)}
        trend="MES"
        icon={<TrendingUp size={20} />}
      />
      <StatsCard
        title="Comensales"
        value={String(snapshot.diners)}
        trend="TOTAL"
        icon={<Users size={20} />}
      />
      <StatsCard
        title="Ticket Medio"
        value={formatCurrency(snapshot.averageTicket, currencyCode)}
        trend="PROMEDIO"
        icon={<CreditCard size={20} />}
      />
      <StatsCard
        title="Ventas Hoy"
        value={formatCurrency(snapshot.salesByPeriod.day, currencyCode)}
        trend="DIA"
        icon={<Calendar size={20} />}
      />

      <div className="glass-panel col-span-1 mt-2 rounded-[2rem] p-5 sm:mt-4 sm:p-8 lg:col-span-3">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
          <h3 className="flex items-center gap-3 font-serif text-xl text-white sm:gap-4 sm:text-2xl">
            <Star className="fill-cyan-400/15 text-cyan-300" size={20} />
            Rendimiento Semanal
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Hoy</p>
              <p className="font-mono text-sm text-white sm:text-base">
                {formatCurrency(snapshot.salesByPeriod.day, currencyCode)}
              </p>
            </div>
            <div className="rounded-xl border border-blue-400/25 bg-blue-400/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Semana</p>
              <p className="font-mono text-sm text-white sm:text-base">
                {formatCurrency(snapshot.salesByPeriod.week, currencyCode)}
              </p>
            </div>
            <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Mes</p>
              <p className="font-mono text-sm text-white sm:text-base">
                {formatCurrency(snapshot.salesByPeriod.month, currencyCode)}
              </p>
            </div>
          </div>
        </div>

        <div className="custom-scroll overflow-x-auto">
          <div className="relative h-[320px] min-w-[680px] px-2 sm:px-4">
            <svg
              width={lineChart.width}
              height={lineChart.height}
              viewBox={`0 0 ${lineChart.width} ${lineChart.height}`}
              className="h-full w-full"
              role="img"
              aria-label="Grafico de lineas de rendimiento semanal"
            >
              <defs>
                <linearGradient id="premiumLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="52%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#0EA5A4" />
                </linearGradient>
                <linearGradient id="premiumAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {lineChart.horizontalGuides.map((guide) => (
                <line
                  key={guide.key}
                  x1={lineChart.paddingX}
                  y1={guide.y}
                  x2={lineChart.width - lineChart.paddingX}
                  y2={guide.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 6"
                />
              ))}

              {lineChart.points.map((point) => (
                <line
                  key={`vertical-${point.label}`}
                  x1={point.x}
                  y1={lineChart.paddingTop}
                  x2={point.x}
                  y2={lineChart.paddingTop + lineChart.usableHeight}
                  stroke="rgba(148,163,184,0.2)"
                />
              ))}

              {lineChart.areaPath ? (
                <path d={lineChart.areaPath} fill="url(#premiumAreaGradient)" />
              ) : null}

              {lineChart.linePath ? (
                <path
                  d={lineChart.linePath}
                  fill="none"
                  stroke="url(#premiumLineGradient)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {lineChart.points.map((point) => (
                <g key={`point-${point.label}`}>
                  <circle cx={point.x} cy={point.y} r={8} fill="rgba(34,211,238,0.22)" />
                  <circle cx={point.x} cy={point.y} r={3.8} fill="#22D3EE">
                    <title>{`${point.label}: ${formatCurrency(point.amount, currencyCode)}`}</title>
                  </circle>
                  <text
                    x={point.x}
                    y={lineChart.height - 10}
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px] font-bold tracking-[0.22em]"
                  >
                    {point.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="glass-panel mt-2 flex flex-col rounded-[2rem] p-5 sm:mt-4 sm:p-8">
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
          className="mt-6 w-full rounded-xl border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:border-cyan-300 hover:text-cyan-300"
        >
          Gestionar Bodega
        </button>
      </div>

      <div className="glass-panel col-span-1 rounded-[2rem] p-5 sm:p-8 lg:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-3 font-serif text-xl text-white sm:text-2xl">
            <BarChart3 className="text-blue-300" size={20} />
            Comparativo Diario
          </h3>
          <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200">
            7 Dias
          </span>
        </div>

        <div className="custom-scroll overflow-x-auto">
          <div className="relative h-[250px] min-w-[480px]">
            <svg
              width={barChart.width}
              height={barChart.height}
              viewBox={`0 0 ${barChart.width} ${barChart.height}`}
              className="h-full w-full"
              role="img"
              aria-label="Grafico de barras comparativo por dia"
            >
              <defs>
                <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>

              {barChart.guides.map((guide) => (
                <line
                  key={guide.key}
                  x1={barChart.paddingX}
                  y1={guide.y}
                  x2={barChart.width - barChart.paddingX}
                  y2={guide.y}
                  stroke="rgba(148,163,184,0.25)"
                  strokeDasharray="4 6"
                />
              ))}

              {barChart.bars.map((bar) => (
                <g key={`bar-${bar.label}`}>
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={barChart.barWidth}
                    height={bar.barHeight}
                    rx={6}
                    fill="url(#barGradient)"
                  >
                    <title>{`${bar.label}: ${formatCurrency(bar.amount, currencyCode)}`}</title>
                  </rect>
                  <text
                    x={bar.x + barChart.barWidth / 2}
                    y={barChart.height - 10}
                    textAnchor="middle"
                    className="fill-zinc-500 text-[10px] font-bold tracking-[0.18em]"
                  >
                    {bar.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-400">
          Pico semanal:{" "}
          <span className="font-mono text-blue-200">{peakDay.label.toUpperCase()}</span>{" "}
          con{" "}
          <span className="font-mono text-white">{formatCurrency(peakDay.amount, currencyCode)}</span>.
        </p>
      </div>

      <div className="glass-panel col-span-1 rounded-[2rem] p-5 sm:p-8 lg:col-span-2">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-3 font-serif text-xl text-white sm:text-2xl">
            <PieChart className="text-amber-300" size={20} />
            Distribucion de Ventas
          </h3>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200">
            Periodos
          </span>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
          <div className="mx-auto">
            <svg
              width={donutChart.size}
              height={donutChart.size}
              viewBox={`0 0 ${donutChart.size} ${donutChart.size}`}
              role="img"
              aria-label="Grafico donut de distribucion de ventas"
            >
              <circle
                cx={donutChart.center}
                cy={donutChart.center}
                r={donutChart.radius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={donutChart.stroke}
                fill="none"
              />

              {donutChart.segments.map((segment) => (
                <circle
                  key={segment.label}
                  cx={donutChart.center}
                  cy={donutChart.center}
                  r={donutChart.radius}
                  stroke={segment.color}
                  strokeWidth={donutChart.stroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${segment.strokeLength} ${donutChart.circumference - segment.strokeLength}`}
                  strokeDashoffset={-segment.strokeOffset}
                  transform={`rotate(-90 ${donutChart.center} ${donutChart.center})`}
                >
                  <title>{`${segment.label}: ${formatCurrency(segment.amount, currencyCode)} (${segment.percent.toFixed(1)}%)`}</title>
                </circle>
              ))}

              <text
                x={donutChart.center}
                y={donutChart.center - 10}
                textAnchor="middle"
                className="fill-zinc-500 text-[10px] font-bold uppercase tracking-[0.18em]"
              >
                Mes
              </text>
              <text
                x={donutChart.center}
                y={donutChart.center + 16}
                textAnchor="middle"
                className="fill-white text-[18px] font-mono font-bold"
              >
                {formatCurrency(snapshot.salesByPeriod.month, currencyCode)}
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            {donutChart.segments.map((segment) => (
              <div
                key={`legend-${segment.label}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-300">
                      {segment.label}
                    </p>
                  </div>
                  <p className="text-xs font-mono text-zinc-400">{segment.percent.toFixed(1)}%</p>
                </div>
                <p className="font-mono text-sm text-white">
                  {formatCurrency(segment.amount, currencyCode)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;


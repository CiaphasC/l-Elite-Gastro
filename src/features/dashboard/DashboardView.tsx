import { BarChart3, Calendar, CreditCard, PieChart, Star, TrendingUp, Users } from "lucide-react";
import { formatCurrency } from "@/shared/formatters/currency";
import type { DashboardSnapshot, MenuItem, SupportedCurrencyCode } from "@/types";
import StatsCard from "@/shared/components/StatsCard";

interface DashboardViewProps {
  snapshot: DashboardSnapshot;
  currencyCode: SupportedCurrencyCode;
  stockAlerts: MenuItem[];
  onOpenInventoryTab: () => void;
}

const DashboardView = ({ snapshot, currencyCode, stockAlerts, onOpenInventoryTab }: DashboardViewProps) => {
  const chartWidth = 760;
  const chartHeight = 300;
  const chartPaddingX = 28;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 48;
  const chartUsableHeight = chartHeight - chartPaddingTop - chartPaddingBottom;
  const chartUsableWidth = chartWidth - chartPaddingX * 2;
  const weeklyAmounts = snapshot.weeklyPerformance.map((point) => point.amount);
  const maxWeeklyAmount = Math.max(...weeklyAmounts, 1);
  const minWeeklyAmount = Math.min(...weeklyAmounts, 0);
  const amountRange = Math.max(maxWeeklyAmount - minWeeklyAmount, maxWeeklyAmount * 0.35, 1);
  const pointsCount = Math.max(snapshot.weeklyPerformance.length - 1, 1);

  const chartPoints = snapshot.weeklyPerformance.map((point, index) => {
    const x = chartPaddingX + (chartUsableWidth / pointsCount) * index;
    const relativeValue = (point.amount - minWeeklyAmount) / amountRange;
    const y = chartPaddingTop + chartUsableHeight - relativeValue * chartUsableHeight;

    return { ...point, x, y };
  });

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartPaddingTop + chartUsableHeight} L ${chartPoints[0].x} ${chartPaddingTop + chartUsableHeight} Z`
      : "";

  const horizontalGuides = Array.from({ length: 4 }, (_, index) => {
    const y = chartPaddingTop + (chartUsableHeight / 3) * index;
    return { key: `guide-${index}`, y };
  });

  const barChartWidth = 520;
  const barChartHeight = 240;
  const barPaddingX = 26;
  const barPaddingTop = 18;
  const barPaddingBottom = 44;
  const barUsableHeight = barChartHeight - barPaddingTop - barPaddingBottom;
  const barUsableWidth = barChartWidth - barPaddingX * 2;
  const barCount = Math.max(snapshot.weeklyPerformance.length, 1);
  const barSlot = barUsableWidth / barCount;
  const barWidth = Math.max(Math.min(barSlot * 0.56, 42), 18);
  const maxBarAmount = Math.max(...weeklyAmounts, 1);
  const barGuides = Array.from({ length: 4 }, (_, index) => {
    const y = barPaddingTop + (barUsableHeight / 3) * index;
    return { key: `bar-guide-${index}`, y };
  });
  const bars = snapshot.weeklyPerformance.map((point, index) => {
    const cleanAmount = Math.max(point.amount, 0);
    const barHeight = (cleanAmount / maxBarAmount) * barUsableHeight;
    const xCenter = barPaddingX + barSlot * index + barSlot / 2;
    return {
      ...point,
      x: xCenter - barWidth / 2,
      y: barPaddingTop + barUsableHeight - barHeight,
      barHeight,
    };
  });

  const peakDay =
    snapshot.weeklyPerformance.reduce(
      (best, point) => (point.amount > best.amount ? point : best),
      snapshot.weeklyPerformance[0] ?? { label: "-", amount: 0 }
    ) ?? { label: "-", amount: 0 };

  const daySales = Math.max(snapshot.salesByPeriod.day, 0);
  const weekRemainder = Math.max(snapshot.salesByPeriod.week - snapshot.salesByPeriod.day, 0);
  const monthRemainder = Math.max(snapshot.salesByPeriod.month - snapshot.salesByPeriod.week, 0);
  const periodDistribution = [
    { label: "Hoy", amount: daySales, color: "#22D3EE" },
    { label: "Resto Semana", amount: weekRemainder, color: "#3B82F6" },
    { label: "Resto Mes", amount: monthRemainder, color: "#F59E0B" },
  ];
  const distributionTotal = periodDistribution.reduce((sum, segment) => sum + segment.amount, 0);
  const donutRadius = 76;
  const donutStroke = 14;
  const donutSize = 220;
  const donutCenter = donutSize / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let currentOffset = 0;
  const donutSegments = periodDistribution.map((segment) => {
    const ratio = distributionTotal > 0 ? segment.amount / distributionTotal : 0;
    const strokeLength = ratio * donutCircumference;
    const computedSegment = {
      ...segment,
      percent: ratio * 100,
      strokeLength,
      strokeOffset: currentOffset,
    };
    currentOffset += strokeLength;
    return computedSegment;
  });

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
              width={chartWidth}
              height={chartHeight}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
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

              {horizontalGuides.map((guide) => (
                <line
                  key={guide.key}
                  x1={chartPaddingX}
                  y1={guide.y}
                  x2={chartWidth - chartPaddingX}
                  y2={guide.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="4 6"
                />
              ))}

              {chartPoints.map((point) => (
                <line
                  key={`vertical-${point.label}`}
                  x1={point.x}
                  y1={chartPaddingTop}
                  x2={point.x}
                  y2={chartPaddingTop + chartUsableHeight}
                  stroke="rgba(148,163,184,0.2)"
                />
              ))}

              {areaPath ? <path d={areaPath} fill="url(#premiumAreaGradient)" /> : null}

              {linePath ? (
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#premiumLineGradient)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}

              {chartPoints.map((point) => (
                <g key={`point-${point.label}`}>
                  <circle cx={point.x} cy={point.y} r={8} fill="rgba(34,211,238,0.22)" />
                  <circle cx={point.x} cy={point.y} r={3.8} fill="#22D3EE">
                    <title>{`${point.label}: ${formatCurrency(point.amount, currencyCode)}`}</title>
                  </circle>
                  <text
                    x={point.x}
                    y={chartHeight - 10}
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
              width={barChartWidth}
              height={barChartHeight}
              viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
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

              {barGuides.map((guide) => (
                <line
                  key={guide.key}
                  x1={barPaddingX}
                  y1={guide.y}
                  x2={barChartWidth - barPaddingX}
                  y2={guide.y}
                  stroke="rgba(148,163,184,0.25)"
                  strokeDasharray="4 6"
                />
              ))}

              {bars.map((bar) => (
                <g key={`bar-${bar.label}`}>
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width={barWidth}
                    height={bar.barHeight}
                    rx={6}
                    fill="url(#barGradient)"
                  >
                    <title>{`${bar.label}: ${formatCurrency(bar.amount, currencyCode)}`}</title>
                  </rect>
                  <text
                    x={bar.x + barWidth / 2}
                    y={barChartHeight - 10}
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
              width={donutSize}
              height={donutSize}
              viewBox={`0 0 ${donutSize} ${donutSize}`}
              role="img"
              aria-label="Grafico donut de distribucion de ventas"
            >
              <circle
                cx={donutCenter}
                cy={donutCenter}
                r={donutRadius}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={donutStroke}
                fill="none"
              />

              {donutSegments.map((segment) => (
                <circle
                  key={segment.label}
                  cx={donutCenter}
                  cy={donutCenter}
                  r={donutRadius}
                  stroke={segment.color}
                  strokeWidth={donutStroke}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${segment.strokeLength} ${donutCircumference - segment.strokeLength}`}
                  strokeDashoffset={-segment.strokeOffset}
                  transform={`rotate(-90 ${donutCenter} ${donutCenter})`}
                >
                  <title>{`${segment.label}: ${formatCurrency(segment.amount, currencyCode)} (${segment.percent.toFixed(1)}%)`}</title>
                </circle>
              ))}

              <text
                x={donutCenter}
                y={donutCenter - 10}
                textAnchor="middle"
                className="fill-zinc-500 text-[10px] font-bold uppercase tracking-[0.18em]"
              >
                Mes
              </text>
              <text
                x={donutCenter}
                y={donutCenter + 16}
                textAnchor="middle"
                className="fill-white text-[18px] font-mono font-bold"
              >
                {formatCurrency(snapshot.salesByPeriod.month, currencyCode)}
              </text>
            </svg>
          </div>

          <div className="space-y-3">
            {donutSegments.map((segment) => (
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


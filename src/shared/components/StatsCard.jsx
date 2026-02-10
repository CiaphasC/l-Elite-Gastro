const StatsCard = ({ title, value, trend, icon }) => (
  <div className="glass-panel hover-glow group cursor-default rounded-[2rem] p-6 transition-all">
    <div className="mb-6 flex items-start justify-between">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-[#E5C07B] transition-all duration-500 group-hover:bg-[#E5C07B] group-hover:text-black">
        {icon}
      </div>
      <span
        className={`rounded border px-2 py-1 text-[9px] font-black tracking-widest ${
          trend.includes("+")
            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
            : trend.includes("-")
              ? "border-red-500/20 bg-red-500/5 text-red-400"
              : "border-white/10 text-zinc-400"
        }`}
      >
        {trend}
      </span>
    </div>
    <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
      {title}
    </p>
    <h4 className="font-mono text-3xl tracking-tighter text-white">{value}</h4>
  </div>
);

export default StatsCard;

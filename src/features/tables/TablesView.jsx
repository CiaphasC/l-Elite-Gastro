const TablesView = ({ tables }) => (
  <div className="grid max-w-5xl grid-cols-2 gap-8 py-4 animate-in fade-in duration-500 md:grid-cols-3">
    {tables.map((table) => (
      <div
        key={table.id}
        className="glass-panel group relative aspect-square cursor-pointer overflow-hidden rounded-[2.5rem] transition-all hover:border-[#E5C07B]/40"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${
            table.status === "disponible"
              ? "from-emerald-500 to-transparent"
              : table.status === "ocupada"
                ? "from-[#E5C07B] to-transparent"
                : "from-zinc-500 to-transparent"
          }`}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
            Mesa
          </span>
          <span
            className={`font-serif text-6xl transition-colors ${
              table.status === "ocupada" ? "text-[#E5C07B]" : "text-white"
            }`}
          >
            {table.id % 100}
          </span>
          <div
            className={`mt-2 rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${
              table.status === "disponible"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : table.status === "ocupada"
                  ? "border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B]"
                  : "border-zinc-700 bg-zinc-800/50 text-zinc-400"
            }`}
          >
            {table.status}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TablesView;

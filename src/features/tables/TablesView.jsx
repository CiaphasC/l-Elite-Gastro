const TablesView = ({ tables }) => (
  <div className="grid max-w-5xl grid-cols-2 gap-4 py-2 animate-in fade-in duration-500 sm:gap-6 sm:py-4 md:grid-cols-3 md:gap-8">
    {tables.map((table) => (
      <div
        key={table.id}
        className="glass-panel group relative aspect-square cursor-pointer overflow-hidden rounded-[1.6rem] transition-all hover:border-[#E5C07B]/40 sm:rounded-[2.5rem]"
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

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-3 sm:gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500 sm:tracking-[0.4em]">
            Mesa
          </span>
          <span
            className={`font-serif text-4xl transition-colors sm:text-6xl ${
              table.status === "ocupada" ? "text-[#E5C07B]" : "text-white"
            }`}
          >
            {table.id % 100}
          </span>
          <div
            className={`mt-2 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest backdrop-blur-md sm:px-4 sm:py-1.5 ${
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

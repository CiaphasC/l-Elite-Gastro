const NavItem = ({ icon, isActive, onClick, tooltip }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`group relative flex aspect-square w-full items-center justify-center rounded-2xl transition-all duration-300 ${
      isActive
        ? "border border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B]"
        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
    }`}
  >
    {icon}
    {isActive && (
      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#E5C07B] shadow-[0_0_10px_#E5C07B]" />
    )}
    <div className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-2 whitespace-nowrap rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 shadow-xl transition-all group-hover:translate-x-0 group-hover:opacity-100">
      {tooltip}
    </div>
  </button>
);

export default NavItem;

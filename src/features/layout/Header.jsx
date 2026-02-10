import { Bell, Search } from "lucide-react";
import { TAB_TITLES, TABS_WITH_SEARCH } from "../../domain/constants";

const Header = ({ activeTab, notifications, searchTerm, onSearchTermChange }) => (
  <header className="-mt-4 sticky top-0 z-30 mb-12 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 py-4 backdrop-blur-md">
    <div>
      <div className="mb-1 flex items-center gap-3">
        <div className="h-[1px] w-8 bg-[#E5C07B]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#E5C07B]">
          Bienvenido, Maitre
        </span>
      </div>
      <h1 className="font-serif text-4xl tracking-tight text-white">
        {TAB_TITLES[activeTab]}
      </h1>
    </div>

    <div className="flex items-center gap-6">
      <div className="group relative cursor-pointer">
        <Bell
          size={20}
          className="text-zinc-400 transition-colors group-hover:text-white"
        />
        {notifications > 0 && (
          <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#E5C07B]" />
        )}
      </div>

      {TABS_WITH_SEARCH.has(activeTab) && (
        <div className="group relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="w-64 rounded-full border border-white/10 bg-white/5 py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-[#E5C07B]/40 focus:bg-white/10 focus:outline-none"
          />
        </div>
      )}

      <div className="flex items-center gap-4 border-l border-white/10 pl-6">
        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-white">Jean-Luc Picard</p>
          <p className="text-[10px] uppercase tracking-widest text-[#E5C07B]">
            Gerente
          </p>
        </div>
        <div className="w-10 rounded-full border border-[#E5C07B]/30 p-0.5">
          <img
            src="https://i.pravatar.cc/100?u=1"
            className="h-full w-full rounded-full object-cover grayscale"
            alt="Perfil"
          />
        </div>
      </div>
    </div>
  </header>
);

export default Header;

import { Bell, Search } from "lucide-react";
import { TAB_TITLES, TABS_WITH_SEARCH } from "../../domain/constants";

const Header = ({ activeTab, notifications, searchTerm, onSearchTermChange }) => (
  <header className="sticky top-0 z-30 mb-6 border-b border-white/5 bg-[#050505]/90 py-4 backdrop-blur-md lg:-mt-4 lg:mb-12">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-1 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-[#E5C07B]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E5C07B] sm:tracking-[0.4em]">
            Bienvenido, Maitre
          </span>
        </div>
        <h1 className="font-serif text-2xl tracking-tight text-white sm:text-3xl lg:text-4xl">
          {TAB_TITLES[activeTab]}
        </h1>
      </div>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:gap-6">
        {TABS_WITH_SEARCH.has(activeTab) && (
          <div className="group relative w-full lg:w-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-[#E5C07B]"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-zinc-600 transition-all focus:border-[#E5C07B]/40 focus:bg-white/10 focus:outline-none lg:w-64"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 lg:justify-start">
          <div className="group relative cursor-pointer">
            <Bell
              size={20}
              className="text-zinc-400 transition-colors group-hover:text-white"
            />
            {notifications > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#E5C07B]" />
            )}
          </div>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4 lg:gap-4 lg:pl-6">
            <div className="hidden text-right sm:block">
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
      </div>
    </div>
  </header>
);

export default Header;

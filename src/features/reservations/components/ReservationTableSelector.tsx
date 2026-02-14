import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Grid2X2 } from "lucide-react";

type ReservationTableSelectorVariant = "form" | "inline";

interface ReservationTableSelectorProps {
  value: number | "";
  options: number[];
  placeholder: string;
  onChange: (nextValue: number | "") => void;
  variant?: ReservationTableSelectorVariant;
  isVip?: boolean;
  name?: string;
}

const wrapperClassByVariant: Record<ReservationTableSelectorVariant, string> = {
  form: "relative w-full",
  inline: "relative min-w-[130px]",
};

const triggerClassByVariant: Record<ReservationTableSelectorVariant, string> = {
  form:
    "flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#1a1a1a]/60 px-5 py-4 text-sm text-white transition-all duration-300 hover:border-[#E5C07B]/30 hover:bg-[#1a1a1a]/80",
  inline:
    "relative flex min-w-[120px] items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 pr-8 text-xs font-bold transition-all duration-300 hover:border-[#E5C07B]/50 hover:bg-white/10",
};

const menuClassByVariant: Record<ReservationTableSelectorVariant, string> = {
  form:
    "absolute left-0 top-full z-50 mt-2 w-full origin-top rounded-xl border border-[#E5C07B]/20 bg-[#0A0A0A]/95 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl",
  inline:
    "absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-xl border border-[#E5C07B]/20 bg-[#0A0A0A]/95 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl",
};

const ReservationTableSelector = ({
  value,
  options,
  placeholder,
  onChange,
  variant = "form",
  isVip = false,
  name,
}: ReservationTableSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hasSelectableTables = options.length > 0;
  const inlineTextClassName = isVip ? "text-[#E5C07B] text-shadow-gold-glow" : "text-[#E5C07B]";
  const selectedOption = useMemo(
    () => (typeof value === "number" ? options.find((tableId) => tableId === value) : undefined),
    [options, value]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (nextValue: number | "") => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={wrapperClassByVariant[variant]}>
      <input type="hidden" name={name} value={value === "" ? "" : value} />

      <button
        type="button"
        onClick={() => setIsOpen((previousState) => !previousState)}
        className={`${triggerClassByVariant[variant]} ${
          isOpen ? "border-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.15)]" : ""
        }`}
      >
        <span
          className={`truncate text-left ${
            variant === "inline"
              ? inlineTextClassName
              : selectedOption
                ? "text-white"
                : "text-zinc-400"
          }`}
        >
          {selectedOption
            ? `Mesa ${selectedOption} ${variant === "form" ? "(Disponible)" : ""}`
            : placeholder}
        </span>
        <span className="ml-3 inline-flex shrink-0 items-center">
          <ChevronDown
            size={variant === "inline" ? 14 : 18}
            className={`text-[#E5C07B] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      <div
        className={`${menuClassByVariant[variant]} transition-all duration-300 ${
          isOpen
            ? "translate-y-0 scale-y-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-y-95 opacity-0"
        }`}
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B]/50 to-transparent opacity-50" />
        <div className="custom-scroll max-h-56 overflow-y-auto">
          <button
            type="button"
            onClick={() => handleChange("")}
            className={`mb-1 w-full rounded-lg px-4 py-3 text-left text-xs transition-colors ${
              value === ""
                ? "border border-[#E5C07B]/20 bg-[#E5C07B]/10 text-[#E5C07B]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {placeholder}
          </button>
          {options.map((tableId) => (
            <button
              key={tableId}
              type="button"
              onClick={() => handleChange(tableId)}
              className={`group/item flex w-full items-center justify-between rounded-lg px-4 py-3 text-xs transition-all ${
                value === tableId
                  ? "bg-[#E5C07B] font-bold text-black shadow-[0_0_15px_rgba(229,192,123,0.3)]"
                  : "text-zinc-300 hover:bg-white/5 hover:pl-5 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Grid2X2
                  size={14}
                  className={
                    value === tableId
                      ? "text-black"
                      : "text-zinc-600 group-hover/item:text-[#E5C07B]"
                  }
                />
                Mesa {tableId}
              </span>
              <span
                className={`text-[9px] uppercase tracking-wider ${
                  value === tableId
                    ? "text-black/60"
                    : "text-zinc-600 group-hover/item:text-[#E5C07B]"
                }`}
              >
                Libre
              </span>
            </button>
          ))}
        </div>
      </div>

      {!hasSelectableTables && variant === "form" && (
        <p className="mt-2 text-[11px] text-zinc-500">
          No hay mesas disponibles en este momento.
        </p>
      )}
    </div>
  );
};

export default ReservationTableSelector;

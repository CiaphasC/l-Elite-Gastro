import type { SupportedCurrencyCode } from "@/types";
import { formatCurrency } from "@/shared/formatters/currency";

type CartTotalsVariant = "desktop" | "mobile";

interface CartTotalsSummaryProps {
  subtotal: number;
  serviceFee: number;
  total: number;
  currencyCode: SupportedCurrencyCode;
  variant: CartTotalsVariant;
}

const wrapperClassByVariant: Record<CartTotalsVariant, string> = {
  desktop: "mb-8 space-y-4",
  mobile: "space-y-3",
};

const rowClassByVariant: Record<CartTotalsVariant, string> = {
  desktop: "flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500",
  mobile: "flex justify-between text-sm text-zinc-400",
};

const valueClassByVariant: Record<CartTotalsVariant, string> = {
  desktop: "font-mono text-zinc-300",
  mobile: "",
};

const totalRowClassByVariant: Record<CartTotalsVariant, string> = {
  desktop: "flex justify-between border-t border-white/10 pt-6 font-serif text-3xl text-white",
  mobile: "flex justify-between text-lg font-bold text-white",
};

const totalValueClassByVariant: Record<CartTotalsVariant, string> = {
  desktop: "font-mono tracking-tighter text-[#E5C07B]",
  mobile: "text-[#E5C07B]",
};

const serviceLabelByVariant: Record<CartTotalsVariant, string> = {
  desktop: "Servicio (10%)",
  mobile: "Servicio",
};

const CartTotalsSummary = ({
  subtotal,
  serviceFee,
  total,
  currencyCode,
  variant,
}: CartTotalsSummaryProps) => (
  <div className={wrapperClassByVariant[variant]}>
    <div className={rowClassByVariant[variant]}>
      <span>Subtotal</span>
      <span className={valueClassByVariant[variant]}>{formatCurrency(subtotal, currencyCode)}</span>
    </div>
    <div className={rowClassByVariant[variant]}>
      <span>{serviceLabelByVariant[variant]}</span>
      <span className={valueClassByVariant[variant]}>{formatCurrency(serviceFee, currencyCode)}</span>
    </div>
    <div className={totalRowClassByVariant[variant]}>
      <span>Total</span>
      <span className={totalValueClassByVariant[variant]}>{formatCurrency(total, currencyCode)}</span>
    </div>
  </div>
);

export default CartTotalsSummary;

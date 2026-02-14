import type { CartItem, SupportedCurrencyCode } from "@/types";
import CartQuantityControl from "@/features/cart/components/CartQuantityControl";
import { formatCurrency } from "@/shared/formatters/currency";

type CartItemLineVariant = "desktop" | "mobile";

interface CartItemLineProps {
  item: CartItem;
  currencyCode: SupportedCurrencyCode;
  variant: CartItemLineVariant;
  onUpdateQty: (itemId: number, delta: number) => void;
}

const containerClassByVariant: Record<CartItemLineVariant, string> = {
  desktop:
    "flex items-center gap-5 rounded-2xl border border-white/5 bg-white/5 p-3 animate-in slide-in-from-right duration-300",
  mobile: "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3",
};

const imageWrapperClassByVariant: Record<CartItemLineVariant, string> = {
  desktop: "relative h-16 w-16 overflow-hidden rounded-xl bg-black",
  mobile: "h-14 w-14 shrink-0 overflow-hidden rounded-xl",
};

const imageClassByVariant: Record<CartItemLineVariant, string> = {
  desktop: "h-full w-full object-cover opacity-80",
  mobile: "h-full w-full object-cover",
};

const nameClassByVariant: Record<CartItemLineVariant, string> = {
  desktop: "mb-1 text-sm font-medium leading-tight text-white",
  mobile: "truncate text-sm font-medium text-white",
};

const priceClassByVariant: Record<CartItemLineVariant, string> = {
  desktop: "font-mono text-xs font-bold text-[#E5C07B]",
  mobile: "text-xs text-[#E5C07B]",
};

const CartItemLine = ({ item, currencyCode, variant, onUpdateQty }: CartItemLineProps) => (
  <div className={containerClassByVariant[variant]}>
    <div className={imageWrapperClassByVariant[variant]}>
      <img src={item.img} className={imageClassByVariant[variant]} alt={item.name} />
    </div>

    <div className="min-w-0 flex-1">
      <p className={nameClassByVariant[variant]}>{item.name}</p>
      <p className={priceClassByVariant[variant]}>{formatCurrency(item.price, currencyCode)}</p>
    </div>

    <CartQuantityControl
      variant={variant === "desktop" ? "vertical" : "horizontal"}
      quantity={item.qty}
      onIncrease={() => onUpdateQty(item.id, 1)}
      onDecrease={() => onUpdateQty(item.id, -1)}
    />
  </div>
);

export default CartItemLine;

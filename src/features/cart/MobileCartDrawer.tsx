import { useState } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import type { CartItem, SupportedCurrencyCode } from "@/types";
import CartItemLine from "@/features/cart/components/CartItemLine";
import CartTotalsSummary from "@/features/cart/components/CartTotalsSummary";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import { formatCurrency } from "@/shared/formatters/currency";

interface MobileCartDrawerProps {
  cartItems: CartItem[];
  currencyCode: SupportedCurrencyCode;
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  onClearCart: () => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onOpenCheckout: () => void;
}

const MobileCartDrawer = ({
  cartItems,
  currencyCode,
  itemCount,
  subtotal,
  serviceFee,
  total,
  onClearCart,
  onUpdateQty,
  onOpenCheckout,
}: MobileCartDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCheckoutAndCloseDrawer = () => {
    onOpenCheckout();
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#090909]/95 p-3 backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-200"
          >
            <ShoppingBag size={16} />
            Comanda ({itemCount})
          </button>
          <button
            onClick={openCheckoutAndCloseDrawer}
            disabled={cartItems.length === 0}
            className={`rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide ${
              cartItems.length > 0
                ? "bg-[#E5C07B] text-black"
                : "cursor-not-allowed bg-white/10 text-zinc-500"
            }`}
          >
            {formatCurrency(total, currencyCode)}
          </button>
        </div>
      </div>

      {isOpen && (
        <ModalBackdrop onRequestClose={() => setIsOpen(false)}>
          <div className="glass-panel flex max-h-[85vh] w-full max-w-xl flex-col rounded-[2rem] p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl text-white">Comanda</h3>
                <p className="text-xs uppercase tracking-widest text-zinc-500">{itemCount} items</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 p-2 text-zinc-400 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="custom-scroll flex-1 space-y-4 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="py-10 text-center text-zinc-500">No hay platos en la comanda.</p>
              ) : (
                cartItems.map((item) => (
                  <CartItemLine
                    key={item.id}
                    item={item}
                    currencyCode={currencyCode}
                    variant="mobile"
                    onUpdateQty={onUpdateQty}
                  />
                ))
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
              <CartTotalsSummary
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
                currencyCode={currencyCode}
                variant="mobile"
              />
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={onClearCart}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3 text-xs font-bold uppercase tracking-widest text-red-300"
                >
                  <Trash2 size={14} />
                  Limpiar
                </button>
                <button
                  onClick={openCheckoutAndCloseDrawer}
                  disabled={cartItems.length === 0}
                  className={`rounded-xl py-3 text-xs font-bold uppercase tracking-widest ${
                    cartItems.length > 0
                      ? "bg-[#E5C07B] text-black"
                      : "cursor-not-allowed bg-white/10 text-zinc-500"
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </ModalBackdrop>
      )}
    </>
  );
};

export default MobileCartDrawer;


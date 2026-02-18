import CartPanel from "@/features/cart/CartPanel";
import MobileCartDrawer from "@/features/cart/MobileCartDrawer";
import { useCartTotals } from "@/shared/hooks/useCartTotals";
import {
  useRestaurantAction,
  useRestaurantShallowSelector,
} from "@/store/hooks";

interface SystemCartLayerProps {
  enabled: boolean;
}

const SystemCartLayer = ({ enabled }: SystemCartLayerProps) => {
  const { cart, currencyCode, serviceContext, tables } = useRestaurantShallowSelector(
    (state) => ({
      cart: state.cart,
      currencyCode: state.currencyCode,
      serviceContext: state.serviceContext,
      tables: state.tables,
    })
  );

  const clearCart = useRestaurantAction("clearCart");
  const updateCartQty = useRestaurantAction("updateCartQty");
  const openCheckout = useRestaurantAction("openCheckout");
  const setServiceTable = useRestaurantAction("setServiceTable");
  const cartTotals = useCartTotals(cart);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <CartPanel
        cartItems={cart}
        currencyCode={currencyCode}
        subtotal={cartTotals.subtotal}
        serviceFee={cartTotals.serviceFee}
        total={cartTotals.total}
        serviceContext={serviceContext}
        tables={tables}
        onClearCart={clearCart}
        onUpdateQty={updateCartQty}
        onOpenCheckout={openCheckout}
        onSelectTable={setServiceTable}
      />

      <MobileCartDrawer
        cartItems={cart}
        currencyCode={currencyCode}
        itemCount={cartTotals.itemCount}
        subtotal={cartTotals.subtotal}
        serviceFee={cartTotals.serviceFee}
        total={cartTotals.total}
        onClearCart={clearCart}
        onUpdateQty={updateCartQty}
        onOpenCheckout={openCheckout}
      />
    </>
  );
};

export default SystemCartLayer;

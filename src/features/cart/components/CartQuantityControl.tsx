import { Minus, Plus } from "lucide-react";

interface CartQuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  variant?: "vertical" | "horizontal";
}

const CartQuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  variant = "horizontal",
}: CartQuantityControlProps) => {
  if (variant === "vertical") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-black/40 p-1.5">
        <button onClick={onIncrease} className="p-1 transition-colors hover:text-[#E5C07B]" aria-label="Aumentar cantidad">
          <Plus size={12} />
        </button>
        <span className="w-5 text-center font-mono text-xs text-white">{quantity}</span>
        <button onClick={onDecrease} className="p-1 transition-colors hover:text-[#E5C07B]" aria-label="Disminuir cantidad">
          <Minus size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={onDecrease} className="rounded-lg bg-white/10 p-1.5 text-zinc-300" aria-label="Disminuir cantidad">
        <Minus size={14} />
      </button>
      <span className="w-5 text-center text-sm text-white">{quantity}</span>
      <button onClick={onIncrease} className="rounded-lg bg-white/10 p-1.5 text-zinc-300" aria-label="Aumentar cantidad">
        <Plus size={14} />
      </button>
    </div>
  );
};

export default CartQuantityControl;

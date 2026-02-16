import { ChefHat } from "lucide-react";
import KitchenOrderCard from "@/features/kitchen/KitchenOrderCard";

interface KitchenViewProps {
  orderIds: string[];
}

const KitchenView = ({ orderIds }: KitchenViewProps) => (
  <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-500 md:grid-cols-2 lg:grid-cols-3">
    {orderIds.map((orderId) => (
      <KitchenOrderCard key={orderId} orderId={orderId} />
    ))}

    {orderIds.length === 0 && (
      <div className="glass-panel col-span-full flex h-64 flex-col items-center justify-center rounded-[2rem] opacity-50">
        <ChefHat size={48} className="mb-4 text-zinc-500" />
        <p className="font-serif text-xl text-zinc-400">Todo el servicio completado</p>
      </div>
    )}
  </div>
);

export default KitchenView;


import { ArrowRightLeft, Minus, Plus } from "lucide-react";

const InventoryView = ({ items, onAdjustStock }) => (
  <div className="glass-panel animate-in fade-in rounded-[2.5rem] p-8 duration-500">
    <div className="mb-8 flex items-center justify-between">
      <h3 className="font-serif text-2xl text-white">Bodega y Stock</h3>
      <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-300 transition-colors hover:bg-white/10 hover:text-white">
        <ArrowRightLeft size={16} /> Movimientos
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5 text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            <th className="pb-4 pl-4 font-black">Producto</th>
            <th className="pb-4 font-black">Categoria</th>
            <th className="pb-4 font-black">Stock</th>
            <th className="pb-4 font-black">Estado</th>
            <th className="pb-4 pr-4 text-right font-black">Ajuste</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((item) => (
            <tr key={item.id} className="group transition-colors hover:bg-white/5">
              <td className="py-4 pl-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    className="h-10 w-10 rounded-lg object-cover grayscale transition-all group-hover:grayscale-0"
                    alt={item.name}
                  />
                  <span className="text-sm font-medium text-zinc-200">{item.name}</span>
                </div>
              </td>
              <td className="py-4 text-xs uppercase tracking-wider text-zinc-500">
                {item.category}
              </td>
              <td className="py-4 font-mono text-zinc-300">
                {item.stock} <span className="ml-1 text-[10px] text-zinc-600">{item.unit}</span>
              </td>
              <td className="py-4">
                <div
                  className={`inline-flex items-center gap-2 rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                    item.stock < 10
                      ? "bg-red-500/10 text-red-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {item.stock < 10 ? "Bajo" : "OK"}
                </div>
              </td>
              <td className="py-4 pr-4 text-right">
                <div className="flex justify-end gap-2 opacity-40 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onAdjustStock(item.id, -1)}
                    className="rounded bg-white/5 p-1 transition-colors hover:text-red-400"
                  >
                    <Minus size={12} />
                  </button>
                  <button
                    onClick={() => onAdjustStock(item.id, 1)}
                    className="rounded bg-white/5 p-1 transition-colors hover:text-emerald-400"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default InventoryView;

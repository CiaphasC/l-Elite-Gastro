import { useMemo, useState } from "react";
import { BoxSelect, Carrot, ChefHat, Package, Plus, Soup, Wine } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { InventoryItemPayload, InventoryMainTab, KitchenInventoryTab, MenuCategory } from "@/types";

interface AddInventoryModalProps {
  isOpen: boolean;
  inventoryMainTab: InventoryMainTab;
  kitchenInventoryTab: KitchenInventoryTab;
  onClose: () => void;
  onSubmit: (payload: InventoryItemPayload) => void;
}

const dishKitchenCategories: MenuCategory[] = ["Entrantes", "Principales", "Postres", "Guarniciones"];
const ingredientCategories: MenuCategory[] = [
  "Carnes",
  "Pescados",
  "Verduras",
  "Frutas",
  "Lácteos",
  "Secos",
  "Aceites",
  "Especias",
];
const barCategories: MenuCategory[] = ["Vinos", "Coctelería", "Cervezas", "Licores", "Refrescos"];

const AddInventoryModal = ({
  isOpen,
  inventoryMainTab,
  kitchenInventoryTab,
  onClose,
  onSubmit,
}: AddInventoryModalProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<MenuCategory>("Entrantes");
  const [stock, setStock] = useState("0");
  const [unit, setUnit] = useState("unid");
  const [price, setPrice] = useState("0");
  const [img, setImg] = useState("");

  const context = useMemo(() => {
    if (inventoryMainTab === "bar") {
      return {
        icon: <Wine size={22} />,
        title: "Ingreso Cantina",
        subtitle: "Barra y Cantina",
        categories: barCategories,
        type: "dish" as const,
      };
    }

    if (kitchenInventoryTab === "ingredients") {
      return {
        icon: <Carrot size={22} />,
        title: "Ingreso Insumo",
        subtitle: "Cocina · Insumos",
        categories: ingredientCategories,
        type: "ingredient" as const,
      };
    }

    return {
      icon: <Soup size={22} />,
      title: "Nuevo Plato",
      subtitle: "Cocina · Platos",
      categories: dishKitchenCategories,
      type: "dish" as const,
    };
  }, [inventoryMainTab, kitchenInventoryTab]);

  const resetForm = () => {
    setName("");
    setCategory(context.categories[0]);
    setStock("0");
    setUnit("unid");
    setPrice("0");
    setImg("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      category,
      stock: Number(stock),
      unit: unit.trim(),
      price: Number(price),
      type: context.type,
      img:
        img.trim() ||
        "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=800",
    });
    resetForm();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onRequestClose={onClose}>
      <div className="glass-panel relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 shadow-[0_0_50px_rgba(229,192,123,0.12)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5C07B]/10 blur-[80px]" />
        </div>

        <div className="relative z-10">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] shadow-[0_0_20px_rgba(229,192,123,0.2)]">
              {context.icon}
            </div>
            <h3 className="text-2xl font-serif text-white">{context.title}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">
              {context.subtitle}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Nombre Producto
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                placeholder="Ej. Lomo fino"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value as MenuCategory)}
                  className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                >
                  {context.categories.map((value) => (
                    <option key={value} value={value} className="bg-[#111] text-white">
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Precio o Costo
                </label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Stock Inicial
                </label>
                <input
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  required
                  type="number"
                  min={0}
                  step="0.1"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                />
              </div>
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Unidad
                </label>
                <select
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                >
                  <option value="unid">Unidades</option>
                  <option value="kg">Kilogramos</option>
                  <option value="lt">Litros</option>
                  <option value="oz">Onzas</option>
                  <option value="gr">Gramos</option>
                  <option value="botellas">Botellas</option>
                  <option value="raciones">Raciones</option>
                </select>
              </div>
            </div>

            <div>
              <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Imagen URL (Opcional)
              </label>
              <input
                value={img}
                onChange={(event) => setImg(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/10 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#E5C07B] py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-[#c4a162]"
              >
                <Plus size={14} />
                Registrar
              </button>
            </div>
          </form>

          <div className="pointer-events-none absolute right-8 top-8 text-zinc-700">
            <BoxSelect size={70} />
          </div>
          <div className="pointer-events-none absolute right-6 top-6 text-zinc-800">
            <Package size={90} />
          </div>
          <div className="pointer-events-none absolute right-7 top-7 text-zinc-700">
            <ChefHat size={70} />
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default AddInventoryModal;

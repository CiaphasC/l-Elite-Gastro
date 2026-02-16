import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Carrot, ChevronDown, Edit, Plus, Soup, Upload, Wine, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import PremiumParticleBackground from "@/shared/components/PremiumParticleBackground";
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<MenuCategory>("Entrantes");
  const [stock, setStock] = useState("0");
  const [unit, setUnit] = useState("unid");
  const [price, setPrice] = useState("0");
  const [preview, setPreview] = useState<string | null>(null);

  const context = useMemo(() => {
    if (inventoryMainTab === "bar") {
      return {
        icon: <Wine size={24} />,
        title: "Ingreso Cantina",
        subtitle: "Barra & Cantina",
        categories: barCategories,
        type: "dish" as const,
      };
    }

    if (kitchenInventoryTab === "ingredients") {
      return {
        icon: <Carrot size={24} />,
        title: "Ingreso Insumo",
        subtitle: "Cocina • Insumos",
        categories: ingredientCategories,
        type: "ingredient" as const,
      };
    }

    return {
      icon: <Soup size={24} />,
      title: "Nuevo Plato",
      subtitle: "Cocina • Platos",
      categories: dishKitchenCategories,
      type: "dish" as const,
    };
  }, [inventoryMainTab, kitchenInventoryTab]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      return;
    }

    isClosingRef.current = false;
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (overlayRef.current) {
      timeline.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }

    timeline.fromTo(
      modalRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4 },
      overlayRef.current ? "-=0.2" : 0
    );

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  const effectiveCategory = context.categories.includes(category)
    ? category
    : context.categories[0];

  const resetForm = () => {
    setName("");
    setCategory(context.categories[0]);
    setStock("0");
    setUnit("unid");
    setPrice("0");
    setPreview(null);
  };

  const closeWithAnimation = (onComplete: () => void) => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;

    if (!modalRef.current) {
      onComplete();
      isClosingRef.current = false;
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        isClosingRef.current = false;
        onComplete();
      },
    });

    timeline.to(modalRef.current, { y: -20, opacity: 0, duration: 0.3, ease: "power2.in" });
    if (overlayRef.current) {
      timeline.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.2");
    }
  };

  const handleClose = () => {
    closeWithAnimation(() => {
      resetForm();
      onClose();
    });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: InventoryItemPayload = {
      name: name.trim(),
      category: effectiveCategory,
      stock: Number(stock),
      unit: unit.trim(),
      price: Number(price),
      type: context.type,
      img:
        preview ??
        "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=800",
    };

    closeWithAnimation(() => {
      onSubmit(payload);
      resetForm();
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop
      onRequestClose={handleClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      dialogClassName="w-full max-w-md"
    >
      <div
        ref={modalRef}
        className="glass-panel relative w-full overflow-hidden rounded-[2.5rem] border border-[#E5C07B]/30 p-8 shadow-[0_0_50px_rgba(229,192,123,0.1)]"
      >
        <PremiumParticleBackground intensity={0.3} />

        <button onClick={handleClose} className="absolute right-6 top-6 z-20 text-zinc-500 transition-colors hover:text-white">
          <X size={24} />
        </button>

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
            <div className="mb-2 flex justify-center">
              <label className="group relative cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div
                  className={`flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed shadow-xl transition-all duration-300 ${
                    preview
                      ? "border-[#E5C07B] bg-black"
                      : "border-zinc-700 bg-black/20 hover:border-[#E5C07B] hover:bg-[#E5C07B]/5"
                  }`}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-zinc-500 transition-colors group-hover:text-[#E5C07B]">
                      <Upload size={20} className="mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Foto</span>
                    </div>
                  )}
                </div>
                {preview && (
                  <div className="absolute -bottom-2 -right-2 scale-90 rounded-full bg-[#E5C07B] p-1.5 text-black opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
                    <Edit size={12} />
                  </div>
                )}
              </label>
            </div>

            <div>
              <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Nombre Producto
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                placeholder="Ej. Lomo Fino"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    value={effectiveCategory}
                    onChange={(event) => setCategory(event.target.value as MenuCategory)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                  >
                    {context.categories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Precio / Costo
                </label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all placeholder:text-zinc-700 focus:border-[#E5C07B]"
                  placeholder="0.00"
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
                <div className="relative">
                  <select
                    value={unit}
                    onChange={(event) => setUnit(event.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-[#E5C07B]"
                  >
                    <option value="unid">Unidades</option>
                    <option value="kg">Kilogramos</option>
                    <option value="lt">Litros</option>
                    <option value="oz">Onzas</option>
                    <option value="gr">Gramos</option>
                    <option value="botellas">Botellas</option>
                    <option value="raciones">Raciones</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5C07B] py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(229,192,123,0.2)] transition-colors hover:bg-[#c4a162]"
            >
              <Plus size={16} />
              Registrar Ingreso
            </button>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default AddInventoryModal;

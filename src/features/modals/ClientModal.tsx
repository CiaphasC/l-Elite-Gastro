import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Crown,
  Phone,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { Client, ClientDocumentType, ClientFilter, ClientPayload } from "@/types";

interface ClientModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  segment: ClientFilter;
  initialClient: Client | null;
  onClose: () => void;
  onSubmit: (payload: ClientPayload) => void;
}

const documentTypes: ClientDocumentType[] = ["DNI", "CEDULA", "PASAPORTE", "CE", "RUC"];

const ClientModal = ({
  isOpen,
  mode,
  segment,
  initialClient,
  onClose,
  onSubmit,
}: ClientModalProps) => {
  const isVipSegment = segment === "vip";
  const [name, setName] = useState(initialClient?.name ?? "");
  const [docType, setDocType] = useState<ClientDocumentType>(initialClient?.docType ?? "DNI");
  const [docNumber, setDocNumber] = useState(initialClient?.docNumber ?? "");
  const [phone, setPhone] = useState(initialClient?.phone ?? "");
  const [preferences, setPreferences] = useState(initialClient?.preferences ?? "");
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const badgeText = useMemo(
    () => (isVipSegment ? "VIP Management" : "Gestión Clientes"),
    [isVipSegment]
  );
  const title = mode === "edit" ? "Editar Cliente" : "Nuevo Cliente";
  const subtitle = mode === "edit" ? "Actualizar Ficha" : "Añadir a Cartera";

  useEffect(() => {
    if (!isOpen || !overlayRef.current || !panelRef.current) {
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.fromTo(
      overlayRef.current,
      { opacity: 0, backdropFilter: "blur(0px)" },
      { opacity: 1, backdropFilter: "blur(8px)", duration: 0.45 }
    );
    timeline.fromTo(
      panelRef.current,
      { y: 40, opacity: 0, scale: 0.96, rotationX: 5 },
      { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.5, ease: "expo.out" },
      "-=0.3"
    );

    return () => {
      timeline.kill();
    };
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      name: name.trim(),
      tier: isVipSegment ? "Gold" : initialClient?.tier ?? "Normal",
      preferences: preferences.trim(),
      docType,
      docNumber: docNumber.trim(),
      phone: phone.trim(),
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop
      onRequestClose={onClose}
      backdropRef={overlayRef}
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/40 p-4 backdrop-blur-sm animate-in fade-in duration-300 sm:p-6"
      dialogClassName="w-full max-w-[42rem]"
    >
      <div
        ref={panelRef}
        className="glass-panel custom-scroll relative flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-[2.5rem] border border-white/10 p-0 shadow-[0_20px_80px_rgba(0,0,0,0.6)] md:max-h-[90vh]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5C07B]/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-black/20 text-zinc-500 backdrop-blur-sm transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 p-8 md:p-10">
          <div className="mb-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.1)]">
              <Star size={10} fill="currentColor" /> {badgeText}
            </div>
            <h3 className="mb-2 font-serif text-4xl tracking-tight text-white">{title}</h3>
            <p className="mb-8 flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
              <span className="h-[1px] w-8 bg-gradient-to-r from-zinc-700 to-transparent" />
              {subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <UserCheck size={12} className="text-[#E5C07B]" /> Nombre Cliente
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a] focus:shadow-[0_0_20px_rgba(229,192,123,0.1)]"
                placeholder="Ej. Familia Grimaldi"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <CreditCard size={12} className="text-[#E5C07B]" /> Tipo Doc.
                </label>
                <div className="relative">
                  <select
                    value={docType}
                    onChange={(event) => setDocType(event.target.value as ClientDocumentType)}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                  >
                    {documentTypes.map((value) => (
                      <option key={value} value={value} className="bg-[#111] text-white">
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
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  N° Documento
                </label>
                <input
                  value={docNumber}
                  onChange={(event) => setDocNumber(event.target.value)}
                  type="text"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                  placeholder="00000000"
                />
              </div>
            </div>

            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Phone size={12} className="text-[#E5C07B]" /> Celular{" "}
                <span className="ml-1 normal-case font-normal tracking-normal text-zinc-600">
                  (Opcional)
                </span>
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                type="tel"
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a] focus:shadow-[0_0_20px_rgba(229,192,123,0.1)]"
                placeholder="+51 999 999 999"
              />
            </div>

            {isVipSegment && (
              <div>
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Nivel de Membresía
                </label>
                <div className="flex items-center justify-center gap-3 rounded-xl border border-[#E5C07B] bg-[#E5C07B]/10 py-4 text-xs font-bold text-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.1)]">
                  <Crown size={14} /> Gold Member
                </div>
              </div>
            )}

            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Star size={12} className="text-[#E5C07B]" /> Preferencias & Alergias
              </label>
              <textarea
                value={preferences}
                onChange={(event) => setPreferences(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a] focus:shadow-[0_0_20px_rgba(229,192,123,0.1)]"
                placeholder="Ej. Alérgico a mariscos, prefiere mesa tranquila..."
              />
            </div>

            <div className="relative z-10 pt-2">
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0" />
                <span className="relative flex items-center justify-center gap-2">
                  {mode === "edit" ? "Guardar Cambios" : "Guardar Perfil"}{" "}
                  <CheckCircle2 size={16} />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default ClientModal;

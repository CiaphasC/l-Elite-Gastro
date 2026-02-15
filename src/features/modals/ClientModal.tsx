import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Crown, Phone, Star, UserCheck, X } from "lucide-react";
import ModalBackdrop from "@/shared/components/ModalBackdrop";
import type { Client, ClientDocumentType, ClientFilter, ClientPayload, ClientTier } from "@/types";

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
  const title = mode === "edit" ? "Editar Cliente" : "Nuevo Cliente";

  const [name, setName] = useState(initialClient?.name ?? "");
  const [docType, setDocType] = useState<ClientDocumentType>(initialClient?.docType ?? "DNI");
  const [docNumber, setDocNumber] = useState(initialClient?.docNumber ?? "");
  const [phone, setPhone] = useState(initialClient?.phone ?? "");
  const [preferences, setPreferences] = useState(initialClient?.preferences ?? "");
  const [tier, setTier] = useState<ClientTier>(
    initialClient?.tier ?? (isVipSegment ? "Gold" : "Normal")
  );

  const badgeText = useMemo(() => {
    if (isVipSegment) {
      return "VIP Management";
    }

    return "Gestion Clientes";
  }, [isVipSegment]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      name: name.trim(),
      tier: isVipSegment ? "Gold" : tier,
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
    <ModalBackdrop onRequestClose={onClose}>
      <div className="glass-panel custom-scroll relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2.5rem] border border-white/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.6)] md:p-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#E5C07B] to-transparent opacity-60" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#E5C07B]/10 blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#E5C07B]/5 blur-[80px]" />
        </div>

        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 rounded-full border border-white/5 bg-black/20 p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5C07B]/20 bg-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.1)]">
              <Star size={10} fill="currentColor" />
              {badgeText}
            </div>
            <h3 className="mb-2 font-serif text-4xl tracking-tight text-white">{title}</h3>
            <p className="flex items-center gap-3 text-xs uppercase tracking-widest text-zinc-500">
              <span className="h-[1px] w-8 bg-gradient-to-r from-zinc-700 to-transparent" />
              {mode === "edit" ? "Actualizar Ficha" : "Anadir a Cartera"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <UserCheck size={12} className="text-[#E5C07B]" />
                Nombre Cliente
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                placeholder="Ej. Familia Grimaldi"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Tipo Doc.
                </label>
                <div className="relative">
                  <select
                    value={docType}
                    onChange={(event) => setDocType(event.target.value as ClientDocumentType)}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white outline-none transition-all focus:border-[#E5C07B]"
                  >
                    {documentTypes.map((value) => (
                      <option key={value} value={value} className="bg-[#111] text-white">
                        {value}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
              <div>
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  N Documento
                </label>
                <input
                  value={docNumber}
                  onChange={(event) => setDocNumber(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                  placeholder="00000000"
                />
              </div>
            </div>

            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Phone size={12} className="text-[#E5C07B]" />
                Celular
              </label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                placeholder="+51 999 999 999"
              />
            </div>

            {isVipSegment ? (
              <div>
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Membresia
                </label>
                <div className="flex items-center justify-center gap-3 rounded-xl border border-[#E5C07B] bg-[#E5C07B]/10 py-4 text-xs font-bold text-[#E5C07B] shadow-[0_0_15px_rgba(229,192,123,0.1)]">
                  <Crown size={14} />
                  Gold Member
                </div>
              </div>
            ) : (
              <div>
                <label className="ml-2 mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Segmento
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1.5">
                  {(["Normal", "Gold"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTier(value)}
                      className={`rounded-lg py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-all ${
                        tier === value
                          ? "bg-[#E5C07B] text-black shadow-[0_0_15px_rgba(229,192,123,0.25)]"
                          : "text-zinc-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="ml-2 mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Star size={12} className="text-[#E5C07B]" />
                Preferencias y Alergias
              </label>
              <textarea
                value={preferences}
                onChange={(event) => setPreferences(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#1a1a1a]/50 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition-all focus:border-[#E5C07B] focus:bg-[#1a1a1a]"
                placeholder="Ej. Alergico a mariscos, prefiere mesa tranquila..."
              />
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#E5C07B] to-[#C69C54] py-5 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(229,192,123,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0" />
              <span className="relative flex items-center justify-center gap-2">
                {mode === "edit" ? "Guardar Cambios" : "Guardar Perfil"}
                <CheckCircle2 size={16} />
              </span>
            </button>
          </form>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default ClientModal;

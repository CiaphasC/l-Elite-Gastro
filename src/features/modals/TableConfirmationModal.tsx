import ActionConfirmModal from "@/shared/components/ActionConfirmModal";
import { CheckCircle2, Droplets, Users } from "lucide-react";
import type { ConfirmationModalState } from "@/types";

interface TableConfirmationModalProps {
  modalState: ConfirmationModalState;
  onClose: () => void;
  onConfirm: () => void;
}

const TableConfirmationModal = ({
  modalState,
  onClose,
  onConfirm,
}: TableConfirmationModalProps) => {
  if (!modalState.isOpen || !modalState.type) {
    return null;
  }

  const tableId = modalState.tableId ?? 0;
  const content =
    modalState.type === "cleaning"
      ? {
          title: "Habilitar Mesa",
          subtitle: `¿Confirma que la Mesa ${tableId} está limpia y lista?`,
          actionLabel: "Confirmar Disponibilidad",
          icon: <CheckCircle2 size={20} />,
        }
      : modalState.type === "reservation"
        ? {
            title: "Ocupar Mesa",
            subtitle: `¿Confirma que los clientes de la Mesa ${tableId} han llegado? Se abrirá la toma de orden.`,
            actionLabel: "Iniciar Servicio & Orden",
            icon: <Users size={20} />,
          }
        : {
            title: "Fin de Servicio",
            subtitle: "¿Dar limpieza y mantenimiento a la mesa?",
            actionLabel: "Iniciar Limpieza",
            icon: <Droplets size={20} />,
          };

  return (
    <ActionConfirmModal
      isOpen
      title={content.title}
      subtitle={content.subtitle}
      actionLabel={content.actionLabel}
      icon={content.icon}
      onClose={onClose}
      onConfirm={onConfirm}
      backdropClassName="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    />
  );
};

export default TableConfirmationModal;

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalPanelProps {
  children: ReactNode;
  className: string;
  onClose?: () => void;
  closeButtonClassName?: string;
  closeIconSize?: number;
  closeAriaLabel?: string;
}

const defaultCloseButtonClassName =
  "absolute right-5 top-5 text-zinc-500 transition-colors hover:text-white";

const ModalPanel = ({
  children,
  className,
  onClose,
  closeButtonClassName = defaultCloseButtonClassName,
  closeIconSize = 24,
  closeAriaLabel = "Cerrar modal",
}: ModalPanelProps) => (
  <div className={className}>
    {onClose && (
      <button
        onClick={onClose}
        className={closeButtonClassName}
        aria-label={closeAriaLabel}
      >
        <X size={closeIconSize} />
      </button>
    )}
    {children}
  </div>
);

export default ModalPanel;

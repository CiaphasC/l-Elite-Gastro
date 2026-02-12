import { useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent, ReactNode } from "react";

interface ModalBackdropProps {
  children: ReactNode;
  onRequestClose?: () => void;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ModalBackdrop = ({
  children,
  onRequestClose,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalBackdropProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const firstFocusableElement = dialogElement.querySelector<HTMLElement>(focusableSelector);

    (firstFocusableElement ?? dialogElement).focus();

    return () => {
      previousActiveElement?.focus();
    };
  }, []);

  useEffect(() => {
    if (!onRequestClose || !closeOnEscape) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      onRequestClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, onRequestClose]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick || !onRequestClose) {
      return;
    }

    if (event.target === event.currentTarget) {
      onRequestClose();
    }
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const dialogElement = dialogRef.current;
    if (!dialogElement) {
      return;
    }

    const focusableElements = Array.from(
      dialogElement.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement | null;

    if (event.shiftKey && activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md animate-in fade-in duration-300 sm:p-4"
      onMouseDown={handleBackdropMouseDown}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={handleDialogKeyDown}>
        {children}
      </div>
    </div>
  );
};

export default ModalBackdrop;


import type { ReactNode } from "react";

interface ModalBackdropProps {
  children: ReactNode;
}

const ModalBackdrop = ({ children }: ModalBackdropProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-md animate-in fade-in duration-300 sm:p-4">
    {children}
  </div>
);

export default ModalBackdrop;


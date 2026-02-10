const ModalBackdrop = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-300">
    {children}
  </div>
);

export default ModalBackdrop;

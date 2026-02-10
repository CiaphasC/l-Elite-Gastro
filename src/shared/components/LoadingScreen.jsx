import { APP_BRAND_NAME } from "../../domain/constants";

const LoadingScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050505] text-[#E5C07B]">
    <div className="mb-8 h-24 w-24 animate-spin rounded-full border-[1px] border-[#E5C07B]/10 border-t-[#E5C07B]" />
    <h1 className="mb-3 text-center font-serif text-4xl tracking-[0.08em] text-white animate-pulse">
      {APP_BRAND_NAME}
    </h1>
    <span className="text-xs uppercase tracking-[0.5em] text-[#E5C07B] opacity-60">
      Restaurant Operations
    </span>
  </div>
);

export default LoadingScreen;

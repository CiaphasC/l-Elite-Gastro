import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "@/app/App";
import { appQueryClient } from "@/app/queryClient";
import "@/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontro el nodo root para montar la aplicacion.");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={appQueryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);


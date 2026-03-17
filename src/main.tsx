import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./i18n";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </QueryClientProvider>
);
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InternetServices from "./pages/InternetServices";
import WebDevelopment from "./pages/WebDevelopment";
import ChatbotsAI from "./pages/ChatbotsAI";
import SocialMediaBoosting from "./pages/SocialMediaBoosting";
import PaymentCallback from "./pages/PaymentCallback";
import ScrollToTop from "./components/ScrollToTop";
import ChatTrigger from "./components/ChatTrigger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ChatTrigger />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/internet-services" element={<InternetServices />} />
          <Route path="/web-development" element={<WebDevelopment />} />
          <Route path="/chatbots-ai" element={<ChatbotsAI />} />
          <Route
            path="/social-media-boosting"
            element={<SocialMediaBoosting />}
          />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Create root only once to avoid React 18 warning
const container = document.getElementById("root")!;
let root = (globalThis as any).__reactRoot;

if (!root) {
  root = createRoot(container);
  (globalThis as any).__reactRoot = root;
}

root.render(<App />);

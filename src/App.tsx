import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const sectionHashIds = new Set(["home", "initiatives", "people", "events", "communities", "faq", "contact"]);

const getHashPath = () => {
  const hashPath = window.location.hash.replace(/^#/, "");

  if (sectionHashIds.has(hashPath)) {
    return "/";
  }

  return hashPath || "/";
};

const AppContent = () => {
  const [path, setPath] = useState(getHashPath);

  useEffect(() => {
    const handleHashChange = () => setPath(getHashPath());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (path === "/" || path === "") {
    return <Index />;
  }

  if (path === "/links") {
    return <Links />;
  }

  return <NotFound path={path} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

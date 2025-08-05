import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import Index from "./pages/Index";
import Planejamento from "./pages/Planejamento";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              {/* Header global sempre visível */}
              <header className="h-16 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4">
                <SidebarTrigger className="mr-4" />
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">VS</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-primary">VIA SOLAR</h1>
                    <p className="text-xs text-muted-foreground">Controle Comercial</p>
                  </div>
                </div>
              </header>
              
              {/* Conteúdo das páginas */}
              <div className="flex-1 p-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/planejamento" element={<Planejamento />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import FarmerDashboard from "./pages/farmer/Dashboard";
import BuyerDashboard from "./pages/buyer/Dashboard";
import LogisticsDashboard from "./pages/logistics/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/farmer" element={<Layout><FarmerDashboard /></Layout>} />
          <Route path="/farmer/*" element={<Layout><FarmerDashboard /></Layout>} />
          <Route path="/buyer" element={<Layout><BuyerDashboard /></Layout>} />
          <Route path="/buyer/*" element={<Layout><BuyerDashboard /></Layout>} />
          <Route path="/logistics" element={<Layout><LogisticsDashboard /></Layout>} />
          <Route path="/logistics/*" element={<Layout><LogisticsDashboard /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

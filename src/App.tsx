import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FarmerDashboard from "./pages/farmer/Dashboard";
import BuyerDashboard from "./pages/buyer/Dashboard";
import LogisticsDashboard from "./pages/logistics/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/farmer" element={<ProtectedRoute requiredPortal="farmer"><Layout><FarmerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/farmer/*" element={<ProtectedRoute requiredPortal="farmer"><Layout><FarmerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/buyer" element={<ProtectedRoute requiredPortal="buyer"><Layout><BuyerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/buyer/*" element={<ProtectedRoute requiredPortal="buyer"><Layout><BuyerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/logistics" element={<ProtectedRoute requiredPortal="logistics"><Layout><LogisticsDashboard /></Layout></ProtectedRoute>} />
            <Route path="/logistics/*" element={<ProtectedRoute requiredPortal="logistics"><Layout><LogisticsDashboard /></Layout></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

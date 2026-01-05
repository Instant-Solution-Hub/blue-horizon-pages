import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import SlotPlanning from "./pages/SlotPlanning";
import TrackVisits from "./pages/TrackVisits";
import ManagerJoining from "./pages/ManagerJoining";
import POB from "./pages/POB";
import CompetitiveBrands from "./pages/CompetitiveBrands";
import Promotions from "./pages/Promotions";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/doctors" element={<Doctors />} />
          <Route path="/dashboard/slot-planning" element={<SlotPlanning />} />
          <Route path="/dashboard/track-visits" element={<TrackVisits />} />
          <Route path="/dashboard/manager-joining" element={<ManagerJoining />} />
          <Route path="/dashboard/pob" element={<POB />} />
          <Route path="/dashboard/competitive-brands" element={<CompetitiveBrands />} />
          <Route path="/dashboard/promotions" element={<Promotions />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

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
import StockLiquidation from "./pages/StockLiquidation";



import SalesProgress from "./pages/SalesProgress";
import VisitCompliance from "./pages/VisitCompliance";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerTeamManagement from "./pages/ManagerTeamManagement";
import ManagerSlotPlanning from "./pages/ManagerSlotPlanning";
import ManagerTargetPlan from "./pages/ManagerTargetPlan";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerLeaveRequests from "./pages/ManagerLeaveRequests";
import ManagerJoiningViewPage from "./pages/ManagerJoiningView";


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
          <Route path="/dashboard/stock-liquidation" element={<StockLiquidation />} />

           <Route path="/dashboard/sales-progress" element={<SalesProgress />} />
          <Route path="/dashboard/visit-compliance" element={<VisitCompliance />} />
           {/* Manager Dashboard Routes */}
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/manager-dashboard/team" element={<ManagerTeamManagement />} />
          <Route path="/manager-dashboard/slot-planning" element={<ManagerSlotPlanning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          {/* Manager Dashboard Routes */}
           <Route path="/manager-dashboard/target-plan" element={<ManagerTargetPlan />} />
            <Route path="/manager-dashboard/profile" element={<ManagerProfile />} />
            <Route path="/manager-dashboard/leave-requests" element={<ManagerLeaveRequests />} />
            <Route path="/manager-dashboard/manager-joining" element={<ManagerJoiningViewPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

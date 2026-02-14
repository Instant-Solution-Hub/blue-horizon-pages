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
import { StockLiquidation } from "./pages/StockLiquidation";



import { SalesProgress } from "./pages/SalesProgress";
import VisitCompliance from "./pages/VisitCompliance";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerTeamManagement from "./pages/ManagerTeamManagement";
import ManagerSlotPlanning from "./pages/ManagerSlotPlanning";
import ManagerTargetPlan from "./pages/ManagerTargetPlan";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerLeaveRequests from "./pages/ManagerLeaveRequests";
import ManagerJoiningViewPage from "./pages/ManagerJoiningView";
import TrackVisitsManager from "./pages/TrackVisitsManager";
import ManagerStockUpdate from "./pages/ManagerStockUpdate";
import AdminProfile from "./pages/AdminProfile";
import AdminPromotions from "./pages/AdminPromotions";
import AdminCompetetiveBrands from "./pages/AdminCompetetiveBrands";
import AdminManagerJoining from "./pages/AdminManagerJoining";
import ManagerVisitCompliance from "./pages/ManagerVisitCompliance";
import AdminProducts from "./pages/AdminProducts";
import AdminDoctorConversions from "./pages/AdminDoctorConversions";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminSalesProgress from "./pages/AdminSalesprogress";
import AdminSlots from "./pages/AdminSlots";
import AdminLeaveRequests from "./pages/AdminLeaveRequests";
import AppInitializer from "./pages/AppInitializer";
import AdminPortalRequests from "./pages/AdminPortalRequests";
import PortalLockedPage from "./pages/PortalLockedPage";
import AdminMissedVisits from "./pages/AdminMissedVisits";
import SuperAdminSalesProgress from "./pages/SuperAdminSalesProgress";
import SuperAdminProducts from "./pages/SuperAdminProducts";
import SuperAdminWorkApprovals from "./pages/SuperAdminWorkApprovals";
import WorkApprovalRequests from "./pages/WorkApprovalRequests";
import ManagerWorkApprovalRequests from "./pages/ManagerWorkApprovalModal";
import { VisualAidsPage } from "./pages/VisualAidsPage";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AppInitializer>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/portal-locked" element={<PortalLockedPage />} />
          <Route path="/visual-aids" element={<VisualAidsPage />} />
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
          <Route path="/dashboard/work-approvals" element={<WorkApprovalRequests />} />

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
            <Route path="/manager-dashboard/track-visits" element={<TrackVisitsManager />} />
            <Route path="/manager-dashboard/stock-update" element={<ManagerStockUpdate />} />
              <Route path="/manager-dashboard/work-approvals" element={<ManagerWorkApprovalRequests />} />
            <Route path="/manager-dashboard/visit-compliance" element={<ManagerVisitCompliance />} />
             

     {/* Admin Dashboard Routes */}
              <Route path="/admin-dashboard/profile" element={<AdminProfile />} />
              <Route path="/admin-dashboard/promotions" element={<AdminPromotions />} />
              <Route path="/admin-dashboard/competitive-brands" element={<AdminCompetetiveBrands />} />
                <Route path="/admin-dashboard/doctor-conversions" element={<AdminDoctorConversions />} />
              <Route path="/admin-dashboard/manager-joining" element={<AdminManagerJoining />} />
               <Route path="/admin-dashboard/user-management" element={<AdminUserManagement />} />
               <Route path="/admin-dashboard/products" element={<AdminProducts />} />
               <Route path="/admin-dashboard/leave-requests" element={<AdminLeaveRequests />} />
               <Route path="/admin-dashboard/sales-progress" element={<AdminSalesProgress />} />
               <Route path="/admin-dashboard/slots" element={<AdminSlots />} />
               <Route path="/admin-portal-requests" element={<AdminPortalRequests />} />
               <Route path="/admin-dashboard/missed-visits" element={<AdminMissedVisits />} />
             {/* Super Admin Dashboard Routes */}
          <Route path="/super-admin-dashboard/sales-progress" element={<SuperAdminSalesProgress />} />
          <Route path="/super-admin-dashboard/products" element={<SuperAdminProducts />} />
          <Route path="/super-admin-dashboard/work-approvals" element={<SuperAdminWorkApprovals />} />
               
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AppInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

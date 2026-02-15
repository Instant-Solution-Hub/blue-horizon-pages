import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Users, UserCheck, Briefcase } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import AdminDailyVisitChart from "@/components/admin-dashboard/AdminDailyVisitChart";
import AdminWeeklyVisitChart from "@/components/admin-dashboard/AdminWeeklyVisitChart";
import { fetchUserCounts } from "@/services/AdminProfileService";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
const [userCounts, setUserCounts] = useState({totalUsers:0, totalFieldExecutives:0, totalManagers:0});

useEffect(() =>{
    getUserCounts();
}, [])
    const getUserCounts = async () => {
        const response = await fetchUserCounts();
        setUserCounts(response);
    }
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm opacity-80">Organization Overview</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Total Users"
              value={userCounts.totalUsers}
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            <StatsCard
              title="Field Executives"
              value={userCounts.totalFieldExecutives}
              icon={UserCheck}
              iconColor="text-green-600"
              iconBgColor="bg-green-500/10"
            />
            <StatsCard
              title="Managers"
              value={userCounts.totalManagers}
              icon={Briefcase}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-500/10"
            />
          </div>

          {/* Daily Visit Report Chart */}
          <AdminWeeklyVisitChart />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

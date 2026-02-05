import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import ManagerStatsCard from "@/components/manager-dashboard/ManagerStatsCard";
import ManagerScheduleItem from "@/components/manager-dashboard/ManagerScheduleItem";
import TeamPerformanceTable from "@/components/manager-dashboard/TeamPerformanceTable";
import { Stethoscope, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchManagerDashboardStats, fetchManagerTeamPerformance, fetchManagerTodaysSchedule } from "@/services/ManagerService";

const scheduleData = [
  {
    name: "Dr. Sarah Johnson - Product Presentation",
    time: "09:00 AM",
    type: "doctor" as const,
    feName: "John Doe",
  },
  {
    name: "MediCare Pharmacy - Offer Discussion",
    time: "11:00 AM",
    type: "pharmacy" as const,
    feName: "Jane Smith",
  },
  {
    name: "ABC Stockist - Sales Order",
    time: "02:00 PM",
    type: "stockist" as const,
    feName: "Mike Wilson",
  },
  {
    name: "Dr. Michael Brown - Camp Planning",
    time: "04:00 PM",
    type: "doctor" as const,
    feName: "John Doe",
  },
];

const teamMembers = [
  { id: "1", name: "John Doe", totalVisitsToday: 8, targetAchieved: 85 },
  { id: "2", name: "Jane Smith", totalVisitsToday: 6, targetAchieved: 72 },
  { id: "3", name: "Mike Wilson", totalVisitsToday: 10, targetAchieved: 95 },
  { id: "4", name: "Emily Davis", totalVisitsToday: 4, targetAchieved: 45 },
  { id: "5", name: "Robert Brown", totalVisitsToday: 7, targetAchieved: 68 },
];

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [todaysSchedule, setTodaysSchedule] = useState<any[]>([]);
  const [teamMembersData, setTeamMembersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userId = Number(sessionStorage.getItem("userID"));
  const totalVisits = teamMembers.reduce((sum, member) => sum + member.totalVisitsToday, 0);
  const avgTargetProgress = Math.round(
    teamMembers.reduce((sum, member) => sum + member.targetAchieved, 0) / teamMembers.length
  );

  useEffect(() => {
    getDashboardData(); 
    getTodaysSchedule();
    getTeamMembersData();
  }, []);

  const getDashboardData = async () => {
    setIsLoading(true);
    let response = await fetchManagerDashboardStats(userId);
    console.log("Dashboard Data:", response); 
    setDashboardData(response.data);
    setIsLoading(false);
  }

  const getTodaysSchedule =async () => {
    setIsLoading(true);
    let response = await fetchManagerTodaysSchedule(userId);
    setTodaysSchedule(response.data);
    setIsLoading(false);
  }

  const getTeamMembersData = async () => {
    setIsLoading(true);
    let response = await fetchManagerTeamPerformance(userId);
    setTeamMembersData(response.data);
    setIsLoading(false);
  }

  return (
    <div className="h-screen bg-muted/30 flex overflow-hidden">
      <ManagerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ManagerStatsCard
                title="Total Visits"
                value={dashboardData?.totalVisits || 0}
                icon={Stethoscope}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
                className="animate-fade-in"
                style={{ animationDelay: "0.1s" } as React.CSSProperties}
              />
              <ManagerStatsCard
                title="Team Target Progress"
                value={`${dashboardData?.targetProgress || 0}%`}
                icon={TrendingUp}
                iconColor="text-success"
                iconBgColor="bg-success/10"
                trend={`${dashboardData?.trend || "0%"} from last week`}
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" } as React.CSSProperties}
              />
              <ManagerStatsCard
                title="Total Members"
                value={dashboardData?.totalMembers || 0}
                icon={Users}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
                className="animate-fade-in"
                style={{ animationDelay: "0.3s" } as React.CSSProperties}
              />
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-card rounded-xl border border-border card-shadow">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Today's Schedule
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your planned visits for today with team members
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                {todaysSchedule.map((item, index) => (
                  <ManagerScheduleItem
                    key={index}
                    name={item.name}
                    time={item.time}
                    type={item.type.toLowerCase() as "doctor" | "pharmacy" | "stockist"}
                    feName={item.feName}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Team Performance Overview */}
          <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <TeamPerformanceTable teamMembers={teamMembersData} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;

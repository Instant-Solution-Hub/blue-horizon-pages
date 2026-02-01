import { useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerJoiningView, { ManagerJoiningRecord } from "@/components/manager-joining/ManagerJoiningView";
import ManagerJoiningStats from "@/components/manager-joining/ManagerJoiningStats";
import { format } from "date-fns";

const ManagerJoiningViewPage = () => {
  // Mock data - joinings from all FEs under this manager
  const [joinings] = useState<ManagerJoiningRecord[]>([
    {
      id: "1",
      feName: "Rahul Verma",
      feId: "FE001",
      doctorName: "Dr. Sharma",
      hospital: "City Hospital",
      date: new Date(),
      scheduledTime: "10:00",
      joiningTime: "10:05",
      notes: "Discussed new product launch",
      status: "on-time",
    },
    {
      id: "2",
      feName: "Rahul Verma",
      feId: "FE001",
      doctorName: "Dr. Patel",
      hospital: "Metro Clinic",
      date: new Date(),
      scheduledTime: "14:00",
      joiningTime: "13:45",
      notes: "",
      status: "early",
    },
    {
      id: "3",
      feName: "Priya Singh",
      feId: "FE002",
      doctorName: "Dr. Gupta",
      hospital: "Care Hospital",
      date: new Date(),
      scheduledTime: "16:00",
      joiningTime: "16:20",
      notes: "Traffic delay",
      status: "late",
    },
    {
      id: "4",
      feName: "Priya Singh",
      feId: "FE002",
      doctorName: "Dr. Kumar",
      hospital: "Max Hospital",
      date: new Date(),
      scheduledTime: "11:00",
      joiningTime: "11:00",
      notes: "Smooth visit",
      status: "on-time",
    },
    {
      id: "5",
      feName: "Amit Kumar",
      feId: "FE003",
      doctorName: "Dr. Reddy",
      hospital: "Apollo Hospital",
      date: new Date(),
      scheduledTime: "09:00",
      joiningTime: "09:15",
      notes: "",
      status: "late",
    },
  ]);

  // Calculate stats
  const uniqueFEs = new Set(joinings.map(j => j.feId)).size;
  const stats = {
    totalJoinings: joinings.length,
    totalFEs: uniqueFEs,
    onTime: joinings.filter((j) => j.status === "on-time" || j.status === "early").length,
    late: joinings.filter((j) => j.status === "late").length,
  };

  const currentMonth = format(new Date(), "MMMM yyyy");

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Manager Joinings</h1>
            <p className="text-muted-foreground">
              View all manager joinings recorded by Field Executives for {currentMonth}
            </p>
          </div>

          <ManagerJoiningStats {...stats} />

          <div>
            <h2 className="text-lg font-semibold mb-4">Joinings by Field Executive</h2>
            <ManagerJoiningView joinings={joinings} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerJoiningViewPage;

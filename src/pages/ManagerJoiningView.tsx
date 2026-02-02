import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerJoiningView, { ManagerJoiningRecord } from "@/components/manager-joining/ManagerJoiningView";
import ManagerJoiningStats from "@/components/manager-joining/ManagerJoiningStats";
import { format } from "date-fns";
import { fetchCurrentMonthManagerJoinings } from "@/services/ManagerJoiningService";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const ManagerJoiningViewPage = () => {
  // Mock data - joinings from all FEs under this manager
  const [joinings , setJoinings] = useState<ManagerJoiningRecord[]>([]);

  // Calculate stats
  const uniqueFEs = new Set(joinings.map(j => j.feId)).size;
  const managerId = Number(localStorage.getItem("managerId")) || 1;
  const [loading , setLoading] = useState(true);
  const stats = {
    totalJoinings: joinings.length,
    totalFEs: uniqueFEs,
    onTime: joinings.filter((j) => j.status === "ON_TIME" || j.status === "EARLY").length,
    late: joinings.filter((j) => j.status === "LATE").length,
  };

  const currentMonth = format(new Date(), "MMMM yyyy");

  useEffect(() => {
    const loadJoinings = async () => {
      try {
        const data = await fetchCurrentMonthManagerJoinings(managerId);
        setJoinings(data);
      } catch (err) {
        toast.error("Failed to load manager joinings");
      } finally {
        setLoading(false);
      }
    };

    loadJoinings();
  }, [managerId]);

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
           {loading ? (
  <Card>
    <CardContent className="p-8 text-center text-muted-foreground">
      Loading joinings...
    </CardContent>
  </Card>
) : (
  <ManagerJoiningView joinings={joinings} />
)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerJoiningViewPage;

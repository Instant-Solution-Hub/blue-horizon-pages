import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCards from "@/components/manager-joining/StatsCards";
import RecordJoiningModal, {
  JoiningFormData,
} from "@/components/manager-joining/RecordJoiningModal";
import JoiningList, {
  JoiningRecord,
} from "@/components/manager-joining/JoiningList";

// 🔹 Replace with your axios instance if you have one
import axios from "axios";
import { fetchManagerJoinings } from "@/services/ManagerJoiningService";

const ManagerJoining = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinings, setJoinings] = useState<JoiningRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Example: FE id from auth / localStorage
  const feId = Number(localStorage.getItem("feId")) || 5;

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // ===============================
  // Fetch joinings on page load
  // ===============================
  useEffect(() => {
    fetchJoinings();
  }, []);

  const fetchJoinings = async () => {
    try {
      setLoading(true);

   const response = await fetchManagerJoinings(feId , month , year);
   console.log(response);

      const mapped: JoiningRecord[] = response.map((item: any) => {
        const scheduled = new Date(item.scheduledTime);
        const joined = item.actualJoiningTime
          ? new Date(item.actualJoiningTime)
          : null;
        const statusMap: Record<string, JoiningRecord["status"]> = {
          ON_TIME: "on-time",
          EARLY: "early",
          LATE: "late",
        };

        return {
          id: String(item.id),
          doctorName: item.doctorName,
          hospital: item.hospitalName,
          date: scheduled,
          scheduledTime: scheduled.toTimeString().slice(0, 5),
          joiningTime: joined
            ? joined.toTimeString().slice(0, 5)
            : "--",
          notes: item.notes || "",
          status: statusMap[item.status] ?? "on-time",
        };
      });

      setJoinings(mapped);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load manager joinings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Submit new joining
  // ===============================
  const handleRecordJoining = async (data: JoiningFormData) => {
    try {
      await axios.post("/api/manager-joinings", {
        fieldExecutiveId: feId,
        doctorName: data.doctorName,
        hospitalName: data.hospital,
        scheduledTime: combineDateTime(data.date, data.scheduledTime),
        actualJoiningTime: combineDateTime(data.date, data.joiningTime),
        notes: data.notes,
      });

      toast({
        title: "Joining Recorded",
        description: `Manager joining with ${data.doctorName} recorded successfully.`,
      });

      setIsModalOpen(false);
      fetchJoinings(); // 🔄 refresh list
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to record joining",
        variant: "destructive",
      });
    }
  };

  // ===============================
  // Stats
  // ===============================
  const stats = {
    totalJoinings: joinings.length,
    onTime: joinings.filter((j) => j.status === "on-time").length,
    early: joinings.filter((j) => j.status === "early").length,
    late: joinings.filter((j) => j.status === "late").length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Manager Joining</h1>
            <p className="text-muted-foreground">
              Track and record manager joinings with doctors.
            </p>
          </div>

          <StatsCards {...stats} />

          <div className="flex justify-end">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Manager Joining
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">
              Recent Joinings
            </h2>

            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <JoiningList joinings={joinings} />
            )}
          </div>
        </div>
      </main>

      <RecordJoiningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRecordJoining}
      />
    </div>
  );
};

export default ManagerJoining;

// ===============================
// Helpers
// ===============================
function combineDateTime(date: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

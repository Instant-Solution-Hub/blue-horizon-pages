import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCards from "@/components/manager-joining/StatsCards";
import RecordJoiningModal, { JoiningFormData } from "@/components/manager-joining/RecordJoiningModal";
import JoiningList, { JoiningRecord } from "@/components/manager-joining/JoiningList";

const ManagerJoining = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinings, setJoinings] = useState<JoiningRecord[]>([
    {
      id: "1",
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
      doctorName: "Dr. Gupta",
      hospital: "Care Hospital",
      date: new Date(),
      scheduledTime: "16:00",
      joiningTime: "16:20",
      notes: "Traffic delay",
      status: "late",
    },
  ]);

  const calculateStatus = (scheduledTime: string, joiningTime: string): JoiningRecord["status"] => {
    const [schedHour, schedMin] = scheduledTime.split(":").map(Number);
    const [joinHour, joinMin] = joiningTime.split(":").map(Number);
    
    const schedMinutes = schedHour * 60 + schedMin;
    const joinMinutes = joinHour * 60 + joinMin;
    const diff = joinMinutes - schedMinutes;

    if (diff < -5) return "early";
    if (diff > 5) return "late";
    return "on-time";
  };

  const handleRecordJoining = (data: JoiningFormData) => {
    const status = calculateStatus(data.scheduledTime, data.joiningTime);
    
    const newJoining: JoiningRecord = {
      id: Date.now().toString(),
      doctorName: data.doctorName,
      hospital: data.hospital,
      date: data.date,
      scheduledTime: data.scheduledTime,
      joiningTime: data.joiningTime,
      notes: data.notes,
      status,
    };

    setJoinings([newJoining, ...joinings]);
    toast({
      title: "Joining Recorded",
      description: `Manager joining with ${data.doctorName} has been recorded.`,
    });
  };

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
            <p className="text-muted-foreground">Track and record manager joinings with doctors , managers typically join 2-3 times per week.</p>
          </div>

          <StatsCards {...stats} />

          <div className="flex justify-end">
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Manager Joining
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Joinings</h2>
            <JoiningList joinings={joinings} />
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

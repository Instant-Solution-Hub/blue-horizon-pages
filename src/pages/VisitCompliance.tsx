import { useState, useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatsCards } from "@/components/visit-compliance/StatsCards";
import { WeekFilter } from "@/components/visit-compliance/WeekFilter";
import { ComplianceTable, ComplianceRecord } from "@/components/visit-compliance/ComplianceTable";

// Mock data for compliance records
const mockRecords: ComplianceRecord[] = [
  // Week 1
  { id: "1", doctorName: "Dr. Sharma", category: "A+", scheduledDate: new Date(2026, 0, 6), status: "completed", week: 1 },
  { id: "2", doctorName: "Dr. Patel", category: "A", scheduledDate: new Date(2026, 0, 7), status: "completed", week: 1 },
  { id: "3", doctorName: "Dr. Mehta", category: "B", scheduledDate: new Date(2026, 0, 8), status: "missed", reason: "Doctor unavailable", week: 1 },
  { id: "4", doctorName: "Dr. Gupta", category: "A+", scheduledDate: new Date(2026, 0, 9), status: "completed", week: 1 },
  { id: "5", doctorName: "Dr. Singh", category: "A", scheduledDate: new Date(2026, 0, 10), status: "completed", week: 1 },
  // Week 2
  { id: "6", doctorName: "Dr. Kumar", category: "A+", scheduledDate: new Date(2026, 0, 13), status: "completed", week: 2 },
  { id: "7", doctorName: "Dr. Reddy", category: "B", scheduledDate: new Date(2026, 0, 14), status: "missed", reason: "Personal emergency", week: 2 },
  { id: "8", doctorName: "Dr. Joshi", category: "A", scheduledDate: new Date(2026, 0, 15), status: "completed", week: 2 },
  { id: "9", doctorName: "Dr. Desai", category: "A+", scheduledDate: new Date(2026, 0, 16), status: "completed", week: 2 },
  { id: "10", doctorName: "Dr. Verma", category: "B", scheduledDate: new Date(2026, 0, 17), status: "completed", week: 2 },
  // Week 3
  { id: "11", doctorName: "Dr. Iyer", category: "A", scheduledDate: new Date(2026, 0, 20), status: "completed", week: 3 },
  { id: "12", doctorName: "Dr. Nair", category: "A+", scheduledDate: new Date(2026, 0, 21), status: "missed", reason: "Travel delay", week: 3 },
  { id: "13", doctorName: "Dr. Pillai", category: "B", scheduledDate: new Date(2026, 0, 22), status: "completed", week: 3 },
  { id: "14", doctorName: "Dr. Rao", category: "A", scheduledDate: new Date(2026, 0, 23), status: "completed", week: 3 },
  // Week 4
  { id: "15", doctorName: "Dr. Choudhury", category: "A+", scheduledDate: new Date(2026, 0, 27), status: "completed", week: 4 },
  { id: "16", doctorName: "Dr. Das", category: "A", scheduledDate: new Date(2026, 0, 28), status: "completed", week: 4 },
  { id: "17", doctorName: "Dr. Sen", category: "B", scheduledDate: new Date(2026, 0, 29), status: "missed", reason: "Clinic closed", week: 4 },
  { id: "18", doctorName: "Dr. Bose", category: "A+", scheduledDate: new Date(2026, 0, 30), status: "completed", week: 4 },
];

const VisitCompliance = () => {
  const [selectedWeek, setSelectedWeek] = useState("all");

  // Filter records based on selected week
  const filteredRecords = useMemo(() => {
    if (selectedWeek === "all") return mockRecords;
    const weekNumber = parseInt(selectedWeek.replace("week", ""));
    return mockRecords.filter((record) => record.week === weekNumber);
  }, [selectedWeek]);

  // Calculate stats
  const stats = useMemo(() => {
    const scheduled = filteredRecords.length;
    const completed = filteredRecords.filter((r) => r.status === "completed").length;
    const missed = filteredRecords.filter((r) => r.status === "missed").length;
    const complianceRate = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
    return { scheduled, completed, missed, complianceRate };
  }, [filteredRecords]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold">Visit Compliance</h1>
            <p className="text-muted-foreground">
              Track and compare your scheduled visits with actual activities.
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <span className="font-semibold">Slot vs Actual Activity Comparison</span> - Compare your scheduled slot with actual visits. Maintaining 80% compliance is mandatory to avoid deductions.
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <StatsCards
            scheduled={stats.scheduled}
            completed={stats.completed}
            missed={stats.missed}
            complianceRate={stats.complianceRate}
          />

          {/* Week Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Filter by Week</h3>
            <WeekFilter selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
          </div>

          {/* Compliance Table */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Detailed Comparison</h3>
            <ComplianceTable records={filteredRecords} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitCompliance;

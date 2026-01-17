import { useState, useMemo } from "react";
import { AlertTriangle, UserRound, Pill, CalendarCheck, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeekFilter } from "@/components/visit-compliance/WeekFilter";
import { ComplianceTable, ComplianceRecord } from "@/components/visit-compliance/ComplianceTable";
import { Card, CardContent } from "@/components/ui/card";

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

// Mock stats for doctor and pharmacist visits
const mockStats = {
  doctorVisits: 18,
  doctorCompleted: 14,
  pharmacistVisits: 12,
  pharmacistCompleted: 10,
};

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
    const scheduled = filteredRecords.length + mockStats.pharmacistVisits;
    const completed = filteredRecords.filter((r) => r.status === "completed").length + mockStats.pharmacistCompleted;
    const missed = filteredRecords.filter((r) => r.status === "missed").length + (mockStats.pharmacistVisits - mockStats.pharmacistCompleted);
    const complianceRate = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
    return { 
      scheduled, 
      completed, 
      missed, 
      complianceRate,
      doctorVisits: mockStats.doctorVisits,
      doctorCompleted: mockStats.doctorCompleted,
      pharmacistVisits: mockStats.pharmacistVisits,
      pharmacistCompleted: mockStats.pharmacistCompleted,
    };
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
              Track and compare your scheduled visits (Doctors & Pharmacists) with actual activities.
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <span className="font-semibold">Slot vs Actual Activity Comparison</span> - Compare your scheduled slot with actual visits. Maintaining 80% compliance is mandatory to avoid deductions.
            </AlertDescription>
          </Alert>

          {/* Stats Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Overall Compliance</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                  Doctor Visits
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Pill className="h-4 w-4" />
                  Pharmacist Visits
                </div>
              </div>
            </div>

            {/* Combined Stats Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Total Scheduled */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50">
                      <CalendarCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Scheduled</p>
                      <p className="text-xl font-bold">{stats.scheduled}</p>
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-50">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-xl font-bold">{stats.completed}</p>
                    </div>
                  </div>

                  {/* Missed */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Missed</p>
                      <p className="text-xl font-bold">{stats.missed}</p>
                    </div>
                  </div>

                  {/* Compliance Rate */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stats.complianceRate >= 80 ? 'bg-green-50' : 'bg-amber-50'}`}>
                        <TrendingUp className={`h-5 w-5 ${stats.complianceRate >= 80 ? 'text-green-500' : 'text-amber-500'}`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Compliance Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold">{stats.complianceRate}%</p>
                          <span className={`text-xs ${stats.complianceRate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.complianceRate >= 80 ? '✓ Meets requirement' : '✗ Below 80%'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${stats.complianceRate >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(stats.complianceRate, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">Target: 80%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Week Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Filter by Week</h3>
            <WeekFilter selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} />
          </div>

          {/* Compliance Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Visits</h3>
              <p className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} visit{filteredRecords.length !== 1 ? 's' : ''} across all professionals
              </p>
            </div>
            <ComplianceTable records={filteredRecords} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitCompliance;

// Update the VisitCompliance component to fetch data from API
import { useState, useMemo, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatsCards } from "@/components/visit-compliance/StatsCards";
import { WeekFilter } from "@/components/visit-compliance/WeekFilter";
import { ComplianceTable, ComplianceRecord } from "@/components/visit-compliance/ComplianceTable";
import { fetchVisitComplianceData } from "@/services/VisitService";

// API response types
interface ComplianceStats {
  scheduled: number;
  completed: number;
  missed: number;
  complianceRate: number;
  doctorVisits: number;
  doctorCompleted: number;
  pharmacistVisits: number;
  pharmacistCompleted: number;
}

interface VisitComplianceResponse {
  stats: ComplianceStats;
  records: ComplianceRecord[];
  totalWeeks: number;
}

const VisitCompliance = () => {
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitComplianceResponse | null>(null);

  useEffect(() => {
    getVisitComplianceData();
  }, [selectedWeek]);

  const getVisitComplianceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const fieldExecutiveId = sessionStorage.getItem("feID"); // Replace with actual ID from auth/session
     const result = await fetchVisitComplianceData(Number(fieldExecutiveId), selectedWeek);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching compliance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use data from API instead of mock data
  const filteredRecords = data?.records || [];
  const stats = data?.stats || {
    scheduled: 0,
    completed: 0,
    missed: 0,
    complianceRate: 0,
    doctorVisits: 0,
    doctorCompleted: 0,
    pharmacistVisits: 0,
    pharmacistCompleted: 0
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <div className="text-center">Loading visit compliance data...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error loading data: {error}
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

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
              <h3 className="text-lg font-semibold">Overall Compliance</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Doctor Visits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Pharmacist Visits</span>
                </div>
              </div>
            </div>
            
            {/* Combined Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Scheduled</p>
                    <p className="text-2xl font-bold">{stats.scheduled}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold">{stats.missed}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{stats.complianceRate}%</p>
                  <div className="text-sm mb-1">
                    {stats.complianceRate >= 80 ? (
                      <span className="text-green-600">✓ Meets requirement</span>
                    ) : (
                      <span className="text-red-600">✗ Below 80%</span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${stats.complianceRate >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(stats.complianceRate, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Target: 80%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Week Filter */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Filter by Week</h3>
            <WeekFilter 
              selectedWeek={selectedWeek} 
              onWeekChange={setSelectedWeek}
              totalWeeks={data?.totalWeeks || 4} // Get total weeks from API
            />
          </div>

          {/* Compliance Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">All Visits</h3>
              <span className="text-sm text-muted-foreground">
                Showing {filteredRecords.length} visit{filteredRecords.length !== 1 ? 's' : ''} across all professionals
              </span>
            </div>
            <ComplianceTable records={filteredRecords} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitCompliance;
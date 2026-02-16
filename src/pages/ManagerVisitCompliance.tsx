// ManagerVisitCompliance.tsx - Shows manager's own doctor visits only
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WeekFilter } from "@/components/visit-compliance/WeekFilter";
import { ComplianceTable, ComplianceRecord } from "@/components/visit-compliance/ComplianceTable";
import { fetchManagerVisitComplianceData } from "@/services/ManagerVisitService";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";

// API response types - Same structure as field executive but only doctor visits
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

interface ManagerVisitComplianceResponse {
  stats: ComplianceStats;
  records: ComplianceRecord[];
  totalWeeks: number;
}

const ManagerVisitCompliance = () => {
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ManagerVisitComplianceResponse | null>(null);

  useEffect(() => {
    getVisitComplianceData();
  }, [selectedWeek]);

  const getVisitComplianceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const managerId = sessionStorage.getItem("userID");
      const result = await fetchManagerVisitComplianceData(Number(managerId), selectedWeek);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching manager compliance data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use data from API
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
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <div className="text-center">Loading your doctor visit compliance data...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
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
    <div className="h-screen bg-background flex overflow-hidden">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold">My Doctor Visit Compliance</h1>
            <p className="text-muted-foreground">
              Track and manage your scheduled doctor visits. Maintaining 80% compliance is required.
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <span className="font-semibold">Doctor Visits Only</span> - As a manager, you are only required to complete doctor visits. Pharmacist visits are handled by field executives.
            </AlertDescription>
          </Alert>

          {/* Stats Overview - Doctor Only */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Doctor Visit Compliance</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Doctor Visits</span>
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
                  <div className="text-sm text-muted-foreground">
                    {stats.doctorVisits} doctor visits
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.doctorCompleted} doctors visited
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Missed</p>
                <p className="text-2xl font-bold">{stats.missed}</p>
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.doctorVisits - stats.doctorCompleted} doctors missed
                </div>
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

            {/* Doctor Visit Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Doctor Visit Completion</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed: {stats.doctorCompleted} / {stats.doctorVisits}</span>
                    <span>{stats.doctorVisits > 0 ? Math.round((stats.doctorCompleted * 100) / stats.doctorVisits) : 0}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${stats.doctorVisits > 0 ? (stats.doctorCompleted * 100) / stats.doctorVisits : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground">Visit Status Summary</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Missed</span>
                    </div>
                    <span className="font-medium">{stats.missed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Scheduled</span>
                    </div>
                    <span className="font-medium">{stats.scheduled - stats.completed - stats.missed}</span>
                  </div>
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
              totalWeeks={data?.totalWeeks || 4}
            />
          </div>

          {/* Doctor Visits Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Doctor Visits</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing {filteredRecords.length} doctor visit{filteredRecords.length !== 1 ? 's' : ''}
                </span>
                <button 
                  onClick={getVisitComplianceData}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-card">
                <p className="text-muted-foreground">No doctor visits scheduled for the selected period.</p>
              </div>
            ) : (
              <ComplianceTable records={filteredRecords} />
            )}
          </div>

          {/* Quick Tips for Managers */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <span className="font-semibold">Manager Guidelines:</span>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Focus on high-value doctor relationships</li>
                <li>• Ensure all scheduled visits are completed or rescheduled in advance</li>
                <li>• Maintain detailed visit reports for each doctor interaction</li>
                <li>• Use insights from visits to guide your field executive team</li>
              </ul>
            </AlertDescription>
          </Alert>
        </main>
      </div>
    </div>
  );
};

export default ManagerVisitCompliance;
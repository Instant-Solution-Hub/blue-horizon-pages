import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import { MissedVisitList } from "@/components/admin-missed-visits/MissedVisitList";
import { AlertTriangle } from "lucide-react";

export default function SuperAdminMissedVisits() {
  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Missed Visits</h1>
              <p className="text-primary-foreground/80 text-sm">
                Review and manage missed visits by team members
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 animate-fade-in">
          <MissedVisitList />
        </div>
      </main>
    </div>
  );
}

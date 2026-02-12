import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import WorkApprovalList from "@/components/super-admin-work-approvals/WorkApprovalList";
import { ClipboardCheck } from "lucide-react";

const SuperAdminWorkApprovals = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Work Approval Requests</h1>
            </div>
            <p className="text-white/80 ml-14">
              Review and manage work requests from managers and field executives
            </p>
          </div>

          {/* Approval List */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <WorkApprovalList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminWorkApprovals;

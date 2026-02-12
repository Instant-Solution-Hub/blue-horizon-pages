import Sidebar from "@/components/dashboard/Sidebar";
import WorkApprovalRequestList from "@/components/work-approval/WorkApprovalRequestList";
import { ClipboardCheck } from "lucide-react";

const WorkApprovalRequests = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Work Approval Requests</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Apply for joint work with Super Admin and track your request status
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <WorkApprovalRequestList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkApprovalRequests;

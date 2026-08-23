import LeaveRequestsTab from "@/components/leave-requests/LeaveRequests";
import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";

const SuperAdminBDELeaveRequests = () => {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <SuperAdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-semibold text-foreground">BDE Leave Requests</h1>
          </div>
          <LeaveRequestsTab isViewOnly={true} />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminBDELeaveRequests;

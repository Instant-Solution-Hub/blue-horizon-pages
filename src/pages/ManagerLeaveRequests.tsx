import LeaveRequestsTab from "@/components/leave-requests/LeaveRequests";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";

const ManagerLeaveRequests = () => {
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Heading */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Leave Requests
            </h1>
          </div>

          {/* Leave Requests Content */}
          <LeaveRequestsTab />
        </main>
      </div>
    </div>
  );
};

export default ManagerLeaveRequests;

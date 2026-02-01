import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import LeaveRequestsTab from "@/components/manager-profile/LeaveRequestsTab";

const ManagerLeaveRequests = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
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

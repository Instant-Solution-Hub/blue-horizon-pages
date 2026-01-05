import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import ProfileStatsCards from "@/components/profile/ProfileStatsCards";
import ApplyLeaveModal from "@/components/profile/ApplyLeaveModal";
import LeaveList, { Leave } from "@/components/profile/LeaveList";
import ContactDetails from "@/components/profile/ContactDetails";
import CompanyPolicies from "@/components/profile/CompanyPolicies";
import LogoutConfirmation from "@/components/profile/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Profile = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: "1",
      leaveType: "SICK_LEAVE",
      status: "APPROVED",
      fromDate: new Date(2025, 0, 10),
      toDate: new Date(2025, 0, 11),
      reason: "Fever and cold",
    },
    {
      id: "2",
      leaveType: "CASUAL_LEAVE",
      status: "PENDING",
      fromDate: new Date(2025, 0, 20),
      toDate: new Date(2025, 0, 21),
      reason: "Family function",
    },
    {
      id: "3",
      leaveType: "EARNED_LEAVE",
      status: "REJECTED",
      fromDate: new Date(2024, 11, 25),
      toDate: new Date(2024, 11, 31),
      reason: "Vacation trip",
    },
  ]);

  const handleApplyLeave = (newLeave: {
    leaveType: string;
    status: string;
    fromDate: Date;
    toDate: Date;
    reason: string;
  }) => {
    const leave: Leave = {
      id: Date.now().toString(),
      ...newLeave,
    };
    setLeaves([leave, ...leaves]);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Heading */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Profile
            </h1>
            <LogoutConfirmation />
          </div>

          {/* Stats Cards */}
          <ProfileStatsCards />

          {/* Leave Application Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Leave Application
              </h2>
              <Button
                onClick={() => setIsLeaveModalOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Apply for Leave
              </Button>
            </div>
            <LeaveList leaves={leaves} />
          </div>

          {/* Contact Details Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Contact Details
            </h2>
            <ContactDetails />
          </div>

          {/* Company Policies Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Company Policies
            </h2>
            <CompanyPolicies />
          </div>
        </main>
      </div>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        open={isLeaveModalOpen}
        onOpenChange={setIsLeaveModalOpen}
        onApply={handleApplyLeave}
      />
    </div>
  );
};

export default Profile;

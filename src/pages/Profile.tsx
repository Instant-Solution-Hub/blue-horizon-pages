
import Sidebar from "@/components/dashboard/Sidebar";
import ProfileStatsCards from "@/components/profile/ProfileStatsCards";
import ApplyLeaveModal from "@/components/profile/ApplyLeaveModal";
import LeaveList, { Leave } from "@/components/profile/LeaveList";
import ContactDetails from "@/components/profile/ContactDetails";
import CompanyPolicies from "@/components/profile/CompanyPolicies";
import LogoutConfirmation from "@/components/profile/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { applyLeave, LeaveType } from "@/services/LeaveService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  fetchFEProfileStats,
  FEProfileStats,
} from "@/services/ProfileService";
import { fetchMonthlyConfirmedLeaves , fetchLeavesByFE } from "@/services/LeaveService";
import { fetchFEContactDetails, updateFEContactDetails } from "@/services/ContactService";


const Profile = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  const fieldExecutiveId = Number(localStorage.getItem("feId")) || 1;
  const [profileStats, setProfileStats] = useState<FEProfileStats | null>(null);
  const [monthlyLeaves, setMonthlyLeaves] = useState<number>(0);
  const [contactDetails, setContactDetails] = useState<{
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
} | null>(null);




useEffect(() => {
  const loadProfileData = async () => {
    try {
      const [stats, leavesUsed, leavesList, contact] = await Promise.all([
        fetchFEProfileStats(fieldExecutiveId),
        fetchMonthlyConfirmedLeaves(fieldExecutiveId),
        fetchLeavesByFE(fieldExecutiveId),
        fetchFEContactDetails(fieldExecutiveId),
      ]);

      setProfileStats(stats);
      setMonthlyLeaves(leavesUsed);
      setContactDetails(contact);

      setLeaves(
        leavesList.map((l: any) => ({
          id: String(l.id),
          leaveType: l.leaveType,
          status: l.status,
          fromDate: new Date(l.fromDate),
          toDate: new Date(l.toDate),
          reason: l.reason,
        }))
      );
    } catch {
      toast.error("Failed to load profile data");
    }
  };

  loadProfileData();
}, [fieldExecutiveId]);

const handleApplyLeave = async (leave: {
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}) => {
  try {
    const saved = await applyLeave({
      fieldExecutiveId,
      ...leave,
    });

  setLeaves((prev): Leave[] => [
  {
    id: String(saved.id),
    leaveType: saved.leaveType,
    status: saved.status,
    fromDate: new Date(saved.fromDate),
    toDate: new Date(saved.toDate),
    reason: saved.reason,
  },
  ...prev,
]);


    toast.success("Leave applied successfully");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Failed to apply leave. Please try again."
    );
  }
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
          <ProfileStatsCards stats={profileStats} monthlyLeavesTaken={monthlyLeaves}/>

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
            <ContactDetails 
             feId={fieldExecutiveId}
  contact={contactDetails}
  onUpdate={setContactDetails} />
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
        leaveBalance={{
    CASUAL_LEAVE: {
      used: profileStats?.approvedCasualLeaves ?? 0,
      total: profileStats?.casualLeaves ?? 0,
    },
    SICK_LEAVE: {
      used: profileStats?.approvedSickLeaves ?? 0,
      total: profileStats?.sickLeaves ?? 0,
    },
  }}
      />
    </div>
  );
};

export default Profile;

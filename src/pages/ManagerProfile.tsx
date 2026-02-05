import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerProfileStatsCards from "@/components/manager-profile/ManagerProfileStatsCard";
import ApplyLeaveModal from "@/components/profile/ApplyLeaveModal";
import LeaveList, { Leave } from "@/components/profile/LeaveList";
import ManagerContactDetails from "@/components/manager-profile/ManagerContactDetails";
import CompanyPolicies from "@/components/profile/CompanyPolicies";
import LogoutConfirmation from "@/components/profile/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getManagerLeaves, applyManagerLeave, LeaveType, fetchMonthlyConfirmedLeaves} from "@/services/ManagerLeaveService";
import { fetchManagerProfileStats, ManagerProfileStats } from "@/services/ManagerProfileService";
import { toast } from "sonner";
import { fetchManagerContactDetails , fetchAdminContact , fetchSuperAdminContact, fetchFEContactsUnderManager } from "@/services/ContactService";

const ManagerProfile = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
   const managerId = Number(localStorage.getItem("managerId")) || 1;
const [loading, setLoading] = useState(true);
const [profileStats, setProfileStats] = useState<ManagerProfileStats | null>(null);
const [monthlyLeaves, setMonthlyLeaves] = useState<number>(0);
const [leaveBalance, setLeaveBalance] = useState({
  CASUAL_LEAVE: { used: 0, total: 0 },
  SICK_LEAVE: { used: 0, total: 0 },
});
const [contactDetails, setContactDetails] = useState<{
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
} | null>(null);

const [adminInfo, setAdminInfo] = useState<{
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
  role:string;
} | null>(null);

const [superAdminInfo, setSuperAdminInfo] = useState<{
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
  role:string;
} | null>(null);

const [teamMembers, setTeamMembers] = useState<
  {
    name: string;
    phone: string;
    email: string;
    emergencyContact: string;
    role: string;
  }[]
>([]);




useEffect(() => {
  const loadManagerProfileData = async () => {
    try {
      setLoading(true);

      const [
        profile,
        monthlyConfirmedLeaves,
        leavesList,
        contact,
        admin,
        superAdmin,
        feContacts
      ] = await Promise.all([
        fetchManagerProfileStats(managerId),
        fetchMonthlyConfirmedLeaves(managerId),
        getManagerLeaves(managerId),
        fetchManagerContactDetails(managerId),
         fetchAdminContact(),
        fetchSuperAdminContact(),
        fetchFEContactsUnderManager(managerId)
      ]);

      // Profile stats
      setProfileStats(profile);
      setContactDetails(contact);
      setAdminInfo({
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        emergencyContact: admin.emergencyNumber,
       role:"Admin"
        
      });

      setSuperAdminInfo({
        name: superAdmin.name,
        phone: superAdmin.phone,
        email: superAdmin.email,
        emergencyContact: superAdmin.emergencyNumber,
        role:"Super Admin"
       
      });

      // Monthly leaves taken (for attendance)
      setMonthlyLeaves(monthlyConfirmedLeaves);

      // Leave balance (cards)
      setLeaveBalance({
        CASUAL_LEAVE: {
          used: profile.approvedCasualLeaves,
          total: profile.casualLeaves,
        },
        SICK_LEAVE: {
          used: profile.approvedSickLeaves,
          total: profile.sickLeaves,
        },
      });

      // Leave list (calendar / table)
      setLeaves(
        leavesList.map((l: any) => ({
          ...l,
          fromDate: new Date(l.fromDate),
          toDate: new Date(l.toDate),
        }))
      );

       setTeamMembers(
        feContacts.map((fe: any) => ({
          name: fe.name,
          phone: fe.phone,
          email: fe.email,
          emergencyContact: fe.emergencyNumber,
          role: "Field Executive",
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load manager profile data");
    } finally {
      setLoading(false);
    }
  };

  if (managerId) {
    loadManagerProfileData();
  }
}, [managerId]);




const handleApplyLeave = async (leave: {
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}) => {
  try {
    const saved = await applyManagerLeave({
      ...leave,
      managerId,
    });

    setLeaves((prev) => [
      {
        ...saved,
        fromDate: new Date(saved.fromDate),
        toDate: new Date(saved.toDate),
      },
      ...prev,
    ]);
  } catch (e) {
    console.error(e);
  }
};


  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Page Heading */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Profile
            </h1>
            <LogoutConfirmation />
          </div>

          {/* Stats Cards */}
          <ManagerProfileStatsCards stats={profileStats} monthlyLeavesTaken={monthlyLeaves}/>

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
            <ManagerContactDetails manager={contactDetails}
  onUpdateManager={setContactDetails} admin = {adminInfo} superAdmin = {superAdminInfo} teamMembers={teamMembers} />
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
  leaveBalance={leaveBalance}
/>
    </div>
  );
};

export default ManagerProfile;

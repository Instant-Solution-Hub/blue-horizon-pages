import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import AdminProfileStatsCards from "@/components/admin-profile/AdminProfileStatsCards";
import ApplyLeaveModal from "@/components/profile/ApplyLeaveModal";
import LeaveList, { Leave } from "@/components/profile/LeaveList";
import AdminContactDetails from "@/components/admin-profile/AdminContactDetails";
import CompanyPolicies from "@/components/profile/CompanyPolicies";
import LogoutConfirmation from "@/components/profile/LogoutConfirmation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { fetchAdminProfileStats } from "@/services/AdminProfileService";
import {
  applyAdminLeave,
  getAdminLeaves,
  fetchMonthlyConfirmedLeaves,
} from "@/services/AdminLeaveService";
import {
  fetchAdminContact,
  updateAdminContactDetails,
  fetchSuperAdminContact,
  fetchFEContacts,
} from "@/services/ContactService";
import { fetchManagerContacts } from "@/services/ContactService";
import { toast } from "sonner";

const AdminProfile = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [monthlyConfirmed, setMonthlyConfirmed] = useState<number | null>(null);
  const [adminContact, setAdminContact] = useState<any | null>(null);
  const [superAdminContact, setSuperAdminContact] = useState<any | null>(null);
  const [feContacts, setFEContacts] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);

  const adminId = Number(sessionStorage.getItem("userID"));

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, monthlyRes, leavesRes, adminContactRes, superRes, feRes, managersRes] =
          await Promise.all([
            fetchAdminProfileStats(adminId),
            fetchMonthlyConfirmedLeaves(adminId),
            getAdminLeaves(adminId),
            fetchAdminContact(),
            fetchSuperAdminContact(),
            fetchFEContacts(),
            fetchManagerContacts(),
          ]) as any;

        setStats(statsRes);
        setMonthlyConfirmed(typeof monthlyRes === "number" ? monthlyRes : (monthlyRes?.data ?? monthlyRes ?? 0));

        // normalize leavesRes to an array regardless of response shape
        let leavesArray: any[] = [];
        if (Array.isArray(leavesRes)) leavesArray = leavesRes;
        else if (leavesRes?.data && Array.isArray(leavesRes.data)) leavesArray = leavesRes.data;
        else if (leavesRes?.data?.data && Array.isArray(leavesRes.data.data)) leavesArray = leavesRes.data.data;
        else leavesArray = [];

        const mappedLeaves: Leave[] = leavesArray.map((l: any) => ({
          id: String(l.id),
          leaveType: l.leaveType as any,
          status: l.status,
          fromDate: new Date(l.fromDate),
          toDate: new Date(l.toDate),
          reason: l.reason,
        }));

        setLeaves(mappedLeaves);

        // normalize contacts
        const adminContactObj = adminContactRes?.data ?? adminContactRes ?? null;
        const superContactObj = superRes?.data ?? superRes ?? null;
        const feContactsArr = Array.isArray(feRes)
          ? feRes
          : (feRes?.data ?? feRes?.data?.data ?? feRes ?? []);

        const managersArr = Array.isArray(managersRes)
          ? managersRes
          : (managersRes?.data ?? managersRes?.data?.data ?? managersRes ?? []);

        setAdminContact(adminContactObj || null);
        setSuperAdminContact(superContactObj || null);
        setFEContacts(feContactsArr || []);
        setManagers(managersArr || []);
      } catch (err) {
        console.error("Failed loading admin profile:", err);
      }
    };

    load();
  }, [adminId]);

  const handleApplyLeave = async (payload: {
    leaveType: "CASUAL_LEAVE" | "SICK_LEAVE" | "EARNED_LEAVE";
    fromDate: string;
    toDate: string;
    reason: string;
  }) => {
    try {
      const res = await applyAdminLeave({ ...payload, adminId });
      
      // Debug: Log the response to see structure
      console.log("Apply leave response:", res);
      
      // Handle nested response structure
      const leaveData = res.data || res;
      
      // Safely parse dates from response
      const parseDate = (dateStr: any): Date => {
        if (dateStr instanceof Date) return dateStr;
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
      };

      const newLeave: Leave = {
        id: String(leaveData.id),
        leaveType: leaveData.leaveType as any,
        status: leaveData.status,
        fromDate: parseDate(leaveData.fromDate),
        toDate: parseDate(leaveData.toDate),
        reason: leaveData.reason || "",
      };
      console.log("New leave object:", newLeave);
      setLeaves(prev => [newLeave, ...prev]);
      toast.success("Leave applied successfully");
    } catch (err) {
        toast.error("Failed to apply for leave");
      console.error("Apply leave failed", err);
      throw err;
    }
  };

  const handleUpdateAdminContact = async (payload: any) => {
    try {
      const res = await updateAdminContactDetails(adminId, payload);
      setAdminContact(res);
      return res;
    } catch (err) {
      console.error("Failed updating admin contact", err);
      throw err;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />

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
          <AdminProfileStatsCards stats={stats} monthlyConfirmed={monthlyConfirmed} />

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
            <AdminContactDetails
              adminContact={adminContact}
              superAdminContact={superAdminContact}
              feContacts={feContacts}
              managers={managers}
              onUpdate={handleUpdateAdminContact}
            />
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
        leaveBalance={stats ? {
          CASUAL_LEAVE: { used: stats.approvedCasualLeaves || 0, total: stats.casualLeaves || 0 },
          SICK_LEAVE: { used: stats.approvedSickLeaves || 0, total: stats.sickLeaves || 0 },
        } : {
          CASUAL_LEAVE: { used: 0, total: 0 },
          SICK_LEAVE: { used: 0, total: 0 },
        }}
      />
    </div>
  );
};

export default AdminProfile;

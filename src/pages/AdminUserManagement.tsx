import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import ManagerList, { type Manager } from "@/components/admin-user-management/ManagerList";
import AddManagerModal from "@/components/admin-user-management/AddManagerModal";
import UpdateManagerModal from "@/components/admin-user-management/UpdateManagerModal";
import FieldExecutiveList, { type FieldExecutive } from "@/components/admin-user-management/FieldExecutiveList";
import AddFieldExecutiveModal from "@/components/admin-user-management/AddFieldExecutiveModal";
import UpdateFieldExecutiveModal from "@/components/admin-user-management/UpdateFieldExecutiveModal";

import { fetchManagerInfos, addManager, updateManager } from "@/services/ManagerService";
import { fetchFieldExecutiveInfos, addFieldExecutive, updateFieldExecutive } from "@/services/FEService";
import { boolean } from "zod";
import { useToast } from "@/hooks/use-toast";
import { manualLockPortal, manualUnlockPortal, processPortalUnlockRequest } from "@/services/PortalService";
import { formatToIST } from "@/lib/utils";

export interface ManagerInfo {
  password: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  department: string;
  designation: string;
  managedTerritories: string[];
}

export interface FEInfo {
  password: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  isPortalLocked: boolean;
  territory: string;
  region: string;
  markets: string[];
  managerId: number;
}

const AdminUserManagement = () => {
  const { toast } = useToast();
  const adminId = Number(sessionStorage.getItem("userID"));
  // Managers state
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [isUpdateManagerOpen, setIsUpdateManagerOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  // Field Executives state
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);


  // Fetch managers and field executives from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const managersData = await fetchManagerInfos();
      setManagers(managersData);
      const feData = await fetchFieldExecutiveInfos();
      setFieldExecutives(feData.map(fe => ({ ...fe, id: String(fe.id), managerId: String(fe.managerId), isPortalLocked: fe.isPortalLocked ?? false })));
    } catch (error) {
      // Handle error (show toast, etc.)
    }
  };
  const [isAddFEOpen, setIsAddFEOpen] = useState(false);
  const [isUpdateFEOpen, setIsUpdateFEOpen] = useState(false);
  const [selectedFE, setSelectedFE] = useState<FieldExecutive | null>(null);

  // Manager handlers
  const handleAddManager = async (manager: ManagerInfo) => {
    try {
      // Always include password from form data
      const newManager = await addManager(manager);
      setManagers((prev) => [...prev, newManager]);
    } catch (error) {
      // Handle error (show toast, etc.)
    }
  };

  const handleEditManager = (manager: Manager) => {
    setSelectedManager(manager);
    setIsUpdateManagerOpen(true);
  };

  const handleUpdateManager = async (updatedManager: Manager) => {
    try {
      await updateManager(Number(updatedManager.id), {
        name: updatedManager.name,
        employeeCode: updatedManager.employeeCode,
        phone: updatedManager.phone,
        department: updatedManager.department,
        designation: updatedManager.designation,
      });

      const managers = await fetchManagerInfos();

      setManagers(managers);
      // Optionally refetch field executives if manager name changes
      const feData = await fetchFieldExecutiveInfos();
      setFieldExecutives(feData.map(fe => ({ ...fe, id: String(fe.id), managerId: String(fe.managerId) })));
    } catch (error) {
      // Handle error (show toast, etc.)
    }
  };

  // Field Executive handlers
  const handleAddFE = async (fe: FEInfo) => {
    try {
      await addFieldExecutive(fe);
      const feData = await fetchFieldExecutiveInfos();
      setFieldExecutives(feData.map(fe => ({ ...fe, id: String(fe.id), managerId: String(fe.managerId) })));

      const managers = await fetchManagerInfos();

      setManagers(managers);
    } catch (error) {
      // Handle error (show toast, etc.)
    }
  };

  const handleEditFE = (fe: FieldExecutive) => {
    setSelectedFE(fe);
    setIsUpdateFEOpen(true);
  };

  const lockOrUnlockFePortal = async (fe: FieldExecutive) => {
    if (fe.isPortalLocked) {
      let obj = {
        "adminId": adminId,
        "userId": fe.id,
        "userType": "FIELD_EXECUTIVE",
       "lockDate": new Date(),
        "reason": ""
      }
      let response = await manualUnlockPortal(obj);
      toast({
        title: "Portal Unlocked",
        description: "Portal unlocked successfully.",
      });
    } else {

      let obj = {
        "adminId": adminId,
        "userId": fe.id,
        "userType": "FIELD_EXECUTIVE",
        "lockDate": new Date(),
        "reason": "Locked By admin"
      }
      let response = await manualLockPortal(obj);
      toast({
        title: "Portal locked",
        description: "Portal Locked successfully.",
      });

    }
    fetchData();

  }

  const lockOrUnlockManagerPortal = async (manager: Manager) => {
    if (manager.isPortalLocked) {
      let obj = {
        "adminId": adminId,
        "userId": manager.id,
        "userType": "MANAGER",
        "lockDate": new Date(),
        "reason": ""
      }
      let response = await manualUnlockPortal(obj);
      toast({
        title: "Portal Unlocked",
        description: "Portal unlocked successfully.",
      });
    } else {

      let obj = {
        "adminId": adminId,
        "userId": manager.id,
        "userType": "MANAGER",
       "lockDate": new Date(),
        "reason": "Locked By admin"
      }
      let response = await manualLockPortal(obj);
      toast({
        title: "Portal locked",
        description: "Portal Locked successfully.",
      });

    }
    fetchData();
  }

  const handleApproveRequest = async (requestId: number) => {
    try {
      let obj = {
        "adminId": adminId,
        "approve": true,
        "comments": "Approved by admin"
      }
      const response = await processPortalUnlockRequest(requestId, obj);

      toast({
        title: "Portal Unlocked",
        description: "Portal unlocked successfully.",
      });

    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Unlock Failed",
        description: "Failed to unlock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFE = async (updatedFE: FieldExecutive) => {
    try {
      await updateFieldExecutive(
        Number(updatedFE.id),
        {
          name: updatedFE.name,
          phone: updatedFE.phone,
          territory: updatedFE.territory,
          markets: updatedFE.markets,
          managerId: Number(updatedFE.managerId),
          region: updatedFE.region
        }
      );
      const feData = await fetchFieldExecutiveInfos();
      setFieldExecutives(feData.map(fe => ({ ...fe, id: String(fe.id), managerId: String(fe.managerId) })));

      const managers = await fetchManagerInfos();

      setManagers(managers);
    } catch (error) {
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Managers Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-display font-bold text-foreground">Managers</h1>
              <Button onClick={() => setIsAddManagerOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Manager
              </Button>
            </div>
            <ManagerList managers={managers} onEdit={handleEditManager}
              onLockPortal={(manager) => {
                lockOrUnlockManagerPortal(manager)
              }} />
          </section>

          {/* Field Executives Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-display font-bold text-foreground">Field Executives</h1>
              <Button onClick={() => setIsAddFEOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field Executive
              </Button>
            </div>
            <FieldExecutiveList fieldExecutives={fieldExecutives} onEdit={handleEditFE}
              onLockPortal={(fe) => {
                lockOrUnlockFePortal(fe);
              }}
            />
          </section>
        </div>
      </main>

      {/* Manager Modals */}
      <AddManagerModal
        open={isAddManagerOpen}
        onOpenChange={setIsAddManagerOpen}
        onAdd={handleAddManager}
      />
      <UpdateManagerModal
        open={isUpdateManagerOpen}
        onOpenChange={setIsUpdateManagerOpen}
        manager={selectedManager}
        onUpdate={handleUpdateManager}
      />

      {/* Field Executive Modals */}
      <AddFieldExecutiveModal
        open={isAddFEOpen}
        onOpenChange={setIsAddFEOpen}
        managers={managers}
        onAdd={handleAddFE}
      />
      <UpdateFieldExecutiveModal
        open={isUpdateFEOpen}
        onOpenChange={setIsUpdateFEOpen}
        fieldExecutive={selectedFE}
        managers={managers}
        onUpdate={handleUpdateFE}
      />
    </div>
  );
};

export default AdminUserManagement;

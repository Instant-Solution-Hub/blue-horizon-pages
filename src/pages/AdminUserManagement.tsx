import { useState } from "react";
import { Plus } from "lucide-react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import ManagerList, { type Manager } from "@/components/admin-user-management/ManagerList";
import AddManagerModal from "@/components/admin-user-management/AddManagerModal";
import UpdateManagerModal from "@/components/admin-user-management/UpdateManagerModal";
import FieldExecutiveTable, { type FieldExecutive } from "@/components/admin-user-management/FieldExecutiveTable";
import AddFieldExecutiveModal from "@/components/admin-user-management/AddFieldExecutiveModal";
import UpdateFieldExecutiveModal from "@/components/admin-user-management/UpdateFieldExecutiveModal";

const AdminUserManagement = () => {
  // Managers state
  const [managers, setManagers] = useState<Manager[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@larimarpharma.com",
      phone: "9876543210",
      employeeCode: "MGR001",
      department: "Sales",
      designation: "Regional Manager",
      managedTerritories: ["North", "East"],
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@larimarpharma.com",
      phone: "9876543211",
      employeeCode: "MGR002",
      department: "Sales",
      designation: "Area Manager",
      managedTerritories: ["South", "West"],
    },
  ]);
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [isUpdateManagerOpen, setIsUpdateManagerOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  // Field Executives state
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([
    {
      id: "1",
      name: "Amit Singh",
      email: "amit@larimarpharma.com",
      phone: "9123456780",
      employeeCode: "FE001",
      territory: "Delhi NCR",
      region: "North",
      markets: ["Connaught Place", "Karol Bagh", "Saket"],
      managerId: "1",
      managerName: "Rajesh Kumar",
    },
    {
      id: "2",
      name: "Sneha Patel",
      email: "sneha@larimarpharma.com",
      phone: "9123456781",
      employeeCode: "FE002",
      territory: "Mumbai Central",
      region: "West",
      markets: ["Andheri", "Bandra", "Dadar"],
      managerId: "2",
      managerName: "Priya Sharma",
    },
  ]);
  const [isAddFEOpen, setIsAddFEOpen] = useState(false);
  const [isUpdateFEOpen, setIsUpdateFEOpen] = useState(false);
  const [selectedFE, setSelectedFE] = useState<FieldExecutive | null>(null);

  // Manager handlers
  const handleAddManager = (manager: Omit<Manager, "id">) => {
    const newManager: Manager = {
      ...manager,
      id: Date.now().toString(),
    };
    setManagers([...managers, newManager]);
  };

  const handleEditManager = (manager: Manager) => {
    setSelectedManager(manager);
    setIsUpdateManagerOpen(true);
  };

  const handleUpdateManager = (updatedManager: Manager) => {
    setManagers(managers.map((m) => (m.id === updatedManager.id ? updatedManager : m)));
    // Update field executives with new manager name if needed
    setFieldExecutives(
      fieldExecutives.map((fe) =>
        fe.managerId === updatedManager.id
          ? { ...fe, managerName: updatedManager.name }
          : fe
      )
    );
  };

  // Field Executive handlers
  const handleAddFE = (fe: Omit<FieldExecutive, "id">) => {
    const newFE: FieldExecutive = {
      ...fe,
      id: Date.now().toString(),
    };
    setFieldExecutives([...fieldExecutives, newFE]);
  };

  const handleEditFE = (fe: FieldExecutive) => {
    setSelectedFE(fe);
    setIsUpdateFEOpen(true);
  };

  const handleUpdateFE = (updatedFE: FieldExecutive) => {
    setFieldExecutives(fieldExecutives.map((fe) => (fe.id === updatedFE.id ? updatedFE : fe)));
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
            <ManagerList managers={managers} onEdit={handleEditManager} />
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
            <FieldExecutiveTable fieldExecutives={fieldExecutives} onEdit={handleEditFE} />
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

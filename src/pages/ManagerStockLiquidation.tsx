import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { PackageOpen } from "lucide-react";
import ManagerLiquidationList from "@/components/manager-stock-liquidation/ManagerLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";
import { fetchEmployees , fetchLiquidationPlansForManager } from "@/services/ManagerService";
import { updateLiquidationPlanStatus } from "@/services/LiquidationService";


interface LiquidationPlanWithMeta {
  id: string;
  product: string;
  quantity: number;
  doctor: string;
  targetLiquidation: number;
  achievedUnits: number;
  marketName: string;
  medicalShopName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  employeeId: number;
}

const ManagerStockLiquidation = () => {
  const managerId =
    Number(localStorage.getItem("managerId")) || 1;

  const [plans, setPlans] = useState<LiquidationPlanWithMeta[]>([]);
  const [employees, setEmployees] = useState<Person[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] =
    useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Employees
  const fetchEmployeesData = async () => {
    const employeesData = await fetchEmployees(managerId);
    setEmployees(employeesData);
  };

  // 🔹 Fetch Current Month Liquidation Plans
  const fetchLiquidationPlans = async () => {
    const res = await fetchLiquidationPlansForManager(managerId);

    const mappedPlans = res.map((p: any) => ({
      ...p,
      id: String(p.id),
      createdAt: new Date(p.createdAt),
    }));

    setPlans(mappedPlans);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchEmployeesData(),
          fetchLiquidationPlans(),
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const filteredPlans = selectedEmployeeId
    ? plans.filter((p) => p.employeeId === selectedEmployeeId)
    : [];

  const handleUpdateStatus = async (
    id: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await updateLiquidationPlanStatus(id, status);

      setPlans((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status } : p
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Stock Liquidation
              </h1>
              <p className="text-muted-foreground mt-1">
                Select a team member to review their liquidation plans
              </p>
            </div>
          </div>

          {/* Employee Selector */}
          <PersonSelector
            persons={employees}
            selectedPersonId={selectedEmployeeId}
            onSelect={setSelectedEmployeeId}
            placeholder="Search team member by name or employee ID..."
          />

          {selectedEmployeeId && !loading && (
            <>
              <StatsCards plans={filteredPlans as any} />
              <ManagerLiquidationList
                plans={filteredPlans as any}
                onUpdateStatus={handleUpdateStatus}
              />
            </>
          )}

          {loading && (
            <p className="text-muted-foreground">
              Loading data...
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerStockLiquidation;

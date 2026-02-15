import { useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { PackageOpen } from "lucide-react";
import ManagerLiquidationList from "@/components/manager-stock-liquidation/ManagerLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { PersonSelector, Person } from "@/components/admin-slots/PersonSelector";

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
  submittedBy: string;
  employeeId: number;
}

const mockEmployees: Person[] = [
  { id: 1, name: "Rahul Verma", employeeCode: "FE001", territory: "North Zone" },
  { id: 2, name: "Amit Gupta", employeeCode: "FE002", territory: "East Zone" },
  { id: 3, name: "Suresh Nair", employeeCode: "FE003", territory: "West Zone" },
];

const mockPlans: LiquidationPlanWithMeta[] = [
  {
    id: "1", product: "Paracetamol 500mg", quantity: 1500, doctor: "Dr. Rajesh Kumar",
    targetLiquidation: 200, achievedUnits: 120, marketName: "Central Market",
    medicalShopName: "Apollo Pharmacy", status: "PENDING", createdAt: new Date("2024-01-15"),
    submittedBy: "Rahul Verma", employeeId: 1,
  },
  {
    id: "2", product: "Paracetamol 500mg", quantity: 1500, doctor: "Dr. Priya Sharma",
    targetLiquidation: 150, achievedUnits: 0, marketName: "East Zone",
    status: "PENDING", createdAt: new Date("2024-01-16"),
    submittedBy: "Amit Gupta", employeeId: 2,
  },
  {
    id: "3", product: "Amoxicillin 250mg", quantity: 800, doctor: "Dr. Amit Patel",
    targetLiquidation: 100, achievedUnits: 75, marketName: "West Market",
    medicalShopName: "MedPlus", status: "APPROVED", createdAt: new Date("2024-01-17"),
    submittedBy: "Suresh Nair", employeeId: 3,
  },
  {
    id: "4", product: "Omeprazole 20mg", quantity: 1200, doctor: "Dr. Sunita Reddy",
    targetLiquidation: 300, achievedUnits: 0, marketName: "North Market",
    status: "PENDING", createdAt: new Date("2024-01-18"),
    submittedBy: "Rahul Verma", employeeId: 1,
  },
];

const ManagerStockLiquidation = () => {
  const [plans, setPlans] = useState<LiquidationPlanWithMeta[]>(mockPlans);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const filteredPlans = selectedEmployeeId
    ? plans.filter((p) => p.employeeId === selectedEmployeeId)
    : [];

  const handleUpdateStatus = (id: string, status: "APPROVED" | "REJECTED") => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
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
            persons={mockEmployees}
            selectedPersonId={selectedEmployeeId}
            onSelect={setSelectedEmployeeId}
            placeholder="Search team member by name or employee ID..."
          />

          {selectedEmployeeId && (
            <>
              <StatsCards plans={filteredPlans as any} />
              <ManagerLiquidationList
                plans={filteredPlans as any}
                onUpdateStatus={handleUpdateStatus}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManagerStockLiquidation;

import { useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import { PackageOpen } from "lucide-react";
import ManagerLiquidationList from "@/components/manager-stock-liquidation/ManagerLiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";

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
}

const mockPlans: LiquidationPlanWithMeta[] = [
  {
    id: "1",
    product: "Paracetamol 500mg",
    quantity: 1500,
    doctor: "Dr. Rajesh Kumar",
    targetLiquidation: 200,
    achievedUnits: 120,
    marketName: "Central Market",
    medicalShopName: "Apollo Pharmacy",
    status: "PENDING",
    createdAt: new Date("2024-01-15"),
    submittedBy: "Rahul Verma",
  },
  {
    id: "2",
    product: "Paracetamol 500mg",
    quantity: 1500,
    doctor: "Dr. Priya Sharma",
    targetLiquidation: 150,
    achievedUnits: 0,
    marketName: "East Zone",
    status: "PENDING",
    createdAt: new Date("2024-01-16"),
    submittedBy: "Amit Gupta",
  },
  {
    id: "3",
    product: "Amoxicillin 250mg",
    quantity: 800,
    doctor: "Dr. Amit Patel",
    targetLiquidation: 100,
    achievedUnits: 75,
    marketName: "West Market",
    medicalShopName: "MedPlus",
    status: "APPROVED",
    createdAt: new Date("2024-01-17"),
    submittedBy: "Suresh Nair",
  },
  {
    id: "4",
    product: "Omeprazole 20mg",
    quantity: 1200,
    doctor: "Dr. Sunita Reddy",
    targetLiquidation: 300,
    achievedUnits: 0,
    marketName: "North Market",
    status: "PENDING",
    createdAt: new Date("2024-01-18"),
    submittedBy: "Rahul Verma",
  },
];

const ManagerStockLiquidation = () => {
  const [plans, setPlans] = useState<LiquidationPlanWithMeta[]>(mockPlans);

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
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Stock Liquidation
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and approve liquidation plans from your team
              </p>
            </div>
          </div>

          {/* Stats */}
          <StatsCards plans={plans as any} />

          {/* Plans List */}
          <ManagerLiquidationList
            plans={plans as any}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </main>
    </div>
  );
};

export default ManagerStockLiquidation;

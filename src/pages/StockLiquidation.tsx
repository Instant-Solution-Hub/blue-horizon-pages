import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddLiquidationModal, {
  LiquidationPlan,
} from "@/components/stock-liquidation/AddLiquidationModal";
import LiquidationList from "@/components/stock-liquidation/LiquidationList";
import { useToast } from "@/hooks/use-toast";

// Mock initial data
const mockPlans: LiquidationPlan[] = [
  {
    id: "1",
    product: "Paracetamol 500mg",
    quantity: 1500,
    doctor: "Dr. Rajesh Kumar",
    targetLiquidation: 200,
    marketName: "Central Market",
    medicalShopName: "Apollo Pharmacy",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    product: "Paracetamol 500mg",
    quantity: 1500,
    doctor: "Dr. Priya Sharma",
    targetLiquidation: 150,
    marketName: "East Zone",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    product: "Amoxicillin 250mg",
    quantity: 800,
    doctor: "Dr. Amit Patel",
    targetLiquidation: 100,
    marketName: "West Market",
    medicalShopName: "MedPlus",
    createdAt: new Date("2024-01-17"),
  },
];

const StockLiquidation = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<LiquidationPlan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<LiquidationPlan | null>(null);

  const handleAddPlan = (
    data: Omit<LiquidationPlan, "id" | "createdAt">
  ) => {
    if (editingPlan) {
      // Update existing plan
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? { ...p, ...data }
            : p
        )
      );
      setEditingPlan(null);
    } else {
      // Add new plan
      const newPlan: LiquidationPlan = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setPlans((prev) => [...prev, newPlan]);
    }
  };

  const handleUpdatePlan = (id: string, data: Partial<LiquidationPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    toast({
      title: "Success",
      description: "Liquidation plan updated successfully",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Stock Liquidation
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your product liquidation plans
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Liquidation Plan
            </Button>
          </div>

          {/* Liquidation Plans List */}
          <LiquidationList plans={plans} onUpdate={handleUpdatePlan} />
        </div>

        {/* Add/Edit Modal */}
        <AddLiquidationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddPlan}
          editData={editingPlan}
        />
      </main>
    </div>
  );
};

export default StockLiquidation;

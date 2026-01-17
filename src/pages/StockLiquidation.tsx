import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PackageOpen, RefreshCw } from "lucide-react";
import AddLiquidationModal, {
  LiquidationPlan,
} from "@/components/stock-liquidation/AddLiquidationModal";
import LiquidationList from "@/components/stock-liquidation/LiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import StockUpdateTab, { ProductStock } from "@/components/stock-liquidation/StockUpdateTab";
import { useToast } from "@/hooks/use-toast";

// Mock initial data for liquidation plans
const mockPlans: LiquidationPlan[] = [
  {
    id: "1",
    product: "Paracetamol 500mg",
    quantity: 1500,
    doctor: "Dr. Rajesh Kumar",
    targetLiquidation: 200,
    achievedUnits: 120,
    marketName: "Central Market",
    medicalShopName: "Apollo Pharmacy",
    status: "APPROVED",
    createdAt: new Date("2024-01-15"),
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
  },
];

// Initial stock data - shared with AddLiquidationModal
const initialStockData: ProductStock[] = [
  { id: 1, productName: "Paracetamol 500mg", availableQty: 1500 },
  { id: 2, productName: "Amoxicillin 250mg", availableQty: 800 },
  { id: 3, productName: "Omeprazole 20mg", availableQty: 1200 },
  { id: 4, productName: "Metformin 500mg", availableQty: 2000 },
  { id: 5, productName: "Atorvastatin 10mg", availableQty: 950 },
  { id: 6, productName: "Ciprofloxacin 500mg", availableQty: 600 },
];

const StockLiquidation = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<LiquidationPlan[]>(mockPlans);
  const [editingPlan, setEditingPlan] = useState<LiquidationPlan | null>(null);
  const [stockData, setStockData] = useState<ProductStock[]>(initialStockData);
  const [activeTab, setActiveTab] = useState("liquidation");

  const handleAddPlan = (
    data: Omit<LiquidationPlan, "id" | "createdAt">
  ) => {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? { ...p, ...data }
            : p
        )
      );
      setEditingPlan(null);
    } else {
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

  const handleUpdateStock = (id: number, newQty: number) => {
    setStockData((prev) =>
      prev.map((p) => (p.id === id ? { ...p, availableQty: newQty } : p))
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <PackageOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  Stock Liquidation
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage stock liquidation plans and update product inventory
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="liquidation" className="gap-2">
                <PackageOpen className="h-4 w-4" />
                Stock Liquidation
              </TabsTrigger>
              <TabsTrigger value="update" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Stock Update
              </TabsTrigger>
            </TabsList>

            <TabsContent value="liquidation" className="mt-6 space-y-6">
              {/* Add Button */}
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Add New Liquidation Plan
                </Button>
              </div>

              {/* Stats Cards */}
              <StatsCards plans={plans} />

              {/* Liquidation Plans List */}
              <LiquidationList plans={plans} onUpdate={handleUpdatePlan} stockData={stockData} />
            </TabsContent>

            <TabsContent value="update" className="mt-6">
              <StockUpdateTab products={stockData} onUpdateStock={handleUpdateStock} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Add/Edit Modal */}
        <AddLiquidationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddPlan}
          editData={editingPlan}
          stockData={stockData}
        />
      </main>
    </div>
  );
};

export default StockLiquidation;

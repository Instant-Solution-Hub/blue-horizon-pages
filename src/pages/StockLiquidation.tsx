import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddLiquidationModal, {
  LiquidationPlan,
} from "@/components/stock-liquidation/AddLiquidationModal";
import LiquidationList from "@/components/stock-liquidation/LiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { useToast } from "@/hooks/use-toast";
import { fetchLiquidationPlansForFE , updateLiquidationPlan , createLiquidationPlan } from "@/services/LiquidationService";


const StockLiquidation = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<LiquidationPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<LiquidationPlan | null>(null);
  const feId =  Number(localStorage.getItem("feId")) || 1;


  const mapApiToLiquidationPlan = (apiPlan: any): LiquidationPlan => ({
  id: apiPlan.id.toString(),
    productId: apiPlan.productId,
  doctorId: apiPlan.doctorId,
  product: apiPlan.productName,
  quantity: apiPlan.quantity, // or remaining if you add later
  doctor: apiPlan.doctorName,
  targetLiquidation: apiPlan.targetLiquidation,
  achievedUnits: apiPlan.achievedUnits,
  marketName: apiPlan.marketName,
  medicalShopName: apiPlan.medicalShopName,
  status: apiPlan.managerApprovalStatus, // backend status optional for now
  createdAt: new Date(apiPlan.createdAt),
});
  const[loading,setLoading] = useState(false);

 const handleAddPlan = async (payload: any , quantity:number) => {
  try {
    const response = await createLiquidationPlan(feId, payload);

    const newPlan: LiquidationPlan = {
        id: response.id, // backend id
        product: response.productName,
        quantity: quantity,
        doctor: response.doctorName,
        targetLiquidation: payload.targetLiquidation,
        achievedUnits: 0,
        marketName: payload.marketName,
        medicalShopName: payload.medicalShopName,
        status: "PENDING",
        createdAt: new Date(response.createdAt),
        productId: response.productId,
        doctorId: response.doctorId
    };
    

    setPlans((prev) => [newPlan, ...prev]);

    toast({
      title: "Success",
      description: "Liquidation plan added successfully",
    });

    setIsModalOpen(false);
  } catch (e) {
    console.log(e);
    toast({
      title: "Error",
      description: "Failed to add liquidation plan",
      variant: "destructive",
    });
  }
};


  const handleUpdatePlan = async (
  plan: LiquidationPlan,
  updates: Partial<LiquidationPlan>
) => {
  try {
    const payload = {
      productId: plan.productId,
      doctorId: plan.doctorId,
      marketName: updates.marketName ?? plan.marketName,
      medicalShopName: updates.medicalShopName ?? plan.medicalShopName,
      targetLiquidation: updates.targetLiquidation ?? plan.targetLiquidation,
      deadline: new Date().toISOString().replace("Z", ""),
      strategy: "",
    };

    const updated = await updateLiquidationPlan(
      plan.id,
      feId,
      payload
    );

    setPlans((prev) =>
      prev.map((p) =>
        p.id === plan.id ? mapApiToLiquidationPlan(updated) : p
      )
    );

    toast({
      title: "Success",
      description: "Liquidation plan updated successfully",
    });
  } catch (e) {
    toast({
      title: "Error",
      description: "Failed to update liquidation plan",
      variant: "destructive",
    });
  }
};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  useEffect(() => {
  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchLiquidationPlansForFE(feId);
      console.log(data);
      setPlans(data.map(mapApiToLiquidationPlan));
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load liquidation plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  loadPlans();
}, [feId]);

  

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
                Create and manage stock liquidation plans with your manager. Track progress towards clearing aging inventory.
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Add New Liquidation Plan
            </Button>
          </div>

          {/* Stats Cards */}
          <StatsCards plans={plans} />

          {/* Liquidation Plans List */}
          {loading ? (
  <p className="text-muted-foreground">Loading liquidation plans...</p>
) : (
  <LiquidationList plans={plans} onUpdate={handleUpdatePlan} />
)}
        </div>

        {/* Add/Edit Modal */}
   <AddLiquidationModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  onSubmit={handleAddPlan}
  editData={editingPlan}
  feId={feId}
/>
      </main>
    </div>
  );
};

export default StockLiquidation;

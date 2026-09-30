import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import AddLiquidationModal, {
  LiquidationPlan,
} from "@/components/stock-liquidation/AddLiquidationModal";
import LiquidationList from "@/components/stock-liquidation/LiquidationList";
import StatsCards from "@/components/stock-liquidation/StatsCards";
import { useToast } from "@/hooks/use-toast";
import {
  fetchLiquidationPlansForFE,
  updateLiquidationPlan,
  createLiquidationPlan,
} from "@/services/LiquidationService";
import axios from "axios";
import { Plus, PackageOpen } from "lucide-react";
import { ProductStock } from "@/components/stock-liquidation/StockUpdateTab";
import { getStockistStocksByFe } from "@/services/StockistService";



interface FEProductStockDto {
  productId: number;
  productName: string;
  allocatedQuantity: number;
  remainingQuantity: number;
}


export const StockLiquidation = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<LiquidationPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<LiquidationPlan | null>(null);
  const [stockData, setStockData] = useState<ProductStock[]>([]);
  const feId = parseInt(sessionStorage.getItem("feID") || "0");

  const fetchStock = async () => {
    try {
      const res = await getStockistStocksByFe(feId);

      const mapped = res.reduce<Record<number, ProductStock>>((acc, item) => {
        const productId = item.productId;
        const existing = acc[productId];

        if (existing) {
          existing.totalQty += item.quantity;
          existing.availableQty += item.quantity;
          return acc;
        }

        acc[productId] = {
          id: productId,
          name: item.productName,
          totalQty: item.quantity,
          availableQty: item.quantity,
        };

        return acc;
      }, {});

      setStockData(Object.values(mapped));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load product stock",
        variant: "destructive",
      });
    }
  };


  const mapApiToLiquidationPlan = (apiPlan: any): LiquidationPlan => ({
    id: apiPlan.id.toString(),
    productId: apiPlan.productId,
    doctorId: apiPlan.doctorId,
    product: apiPlan.productName,
    quantity: apiPlan.quantity, // or remaining if you add later
    doctor: apiPlan.doctorName,
    targetLiquidation: apiPlan.targetLiquidation,
    achievedUnits:
      apiPlan.achievedUnits ??
      ((apiPlan.liquidated1 || 0) +
        (apiPlan.liquidated2 || 0) +
        (apiPlan.liquidated3 || 0)),
    liquidated1: apiPlan.liquidated1 ?? 0,
    liquidated2: apiPlan.liquidated2 ?? 0,
    liquidated3: apiPlan.liquidated3 ?? 0,
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
        doctorId: response.doctorId,
        liquidated1: 0,
        liquidated2: 0,
        liquidated3: 0,
    };
    

    setPlans((prev) => [newPlan, ...prev]);

    toast({
      title: "Success",
      description: "Liquidation plan added successfully",
    });

    setIsModalOpen(false);
  } catch (e) {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const message =
      e.response?.data?.message || "Something went wrong";

    if (status === 409) {
      // Business rule violation
      toast({
        title: "Action not allowed",
        description: message,
        variant: "destructive",
      });
    } else {
      // Other backend errors
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  } else {
    // Non-Axios / unexpected error
    toast({
      title: "Unexpected Error",
      description: "Please try again later",
      variant: "destructive",
    });
  }

  console.error(e);
}
 }

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
        liquidated1: updates.liquidated1 ?? plan.liquidated1 ?? 0,
        liquidated2: updates.liquidated2 ?? plan.liquidated2 ?? 0,
        liquidated3: updates.liquidated3 ?? plan.liquidated3 ?? 0,
        deadline: new Date().toISOString().replace("Z", ""),
        strategy: "",
      };

      const updated = await updateLiquidationPlan(plan.id, feId, payload);

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
      console.log(e);
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


  useEffect(() => {
   loadPlans();
}, [feId]);

useEffect(() => {
  if (feId) fetchStock();
}, [feId]);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
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

            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Add New Liquidation Plan
                </Button>
              </div>

              <StatsCards plans={plans} />

              <LiquidationList plans={plans} onUpdate={handleUpdatePlan} stockData={stockData} />
            </div>
          </div>

          <AddLiquidationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleAddPlan}
            editData={editingPlan}
            stockData={stockData}
            feId={feId}
            plans={plans}
          />
        </main>
      </div>
    </div>
  );
};

export default StockLiquidation;

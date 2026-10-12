import { useEffect, useState } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import StockTable, { StockEntry } from "@/components/manager-stock/StockTable";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchFEsByManager, FieldExecutive } from "@/services/FEService";
import { getAllStockists, getStockistStocksByFe } from "@/services/StockistService";

interface ManagerStockEntry extends StockEntry {
  feId: number;
  feName: string;
  managerName: string;
}

const ManagerEmployeeStock = () => {
  const { toast } = useToast();
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [selectedFEId, setSelectedFEId] = useState<string>("");
  const [selectedFE, setSelectedFE] = useState<FieldExecutive | null>(null);
  const [stockEntries, setStockEntries] = useState<ManagerStockEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const managerId = Number(sessionStorage.getItem("userID"));

  useEffect(() => {
    const loadFieldExecutives = async () => {
      try {
        const fes = await fetchFEsByManager(managerId);
        const managerFEs = Array.isArray(fes) ? fes : [];
        setFieldExecutives(managerFEs);

        if (managerFEs.length > 0) {
          setSelectedFEId(managerFEs[0].id.toString());
        } else {
          setSelectedFEId("");
          setSelectedFE(null);
          setStockEntries([]);
        }
      } catch (error) {
        console.error("Failed to load manager field executives:", error);
        toast({
          title: "Error",
          description: "Failed to load field executives under your management.",
          variant: "destructive",
        });
      }
    };

    if (managerId) {
      loadFieldExecutives();
    }
  }, [managerId, toast]);

  const loadStockEntries = async () => {
    if (!selectedFEId) {
      setSelectedFE(null);
      setStockEntries([]);
      return;
    }

    const currentFE = fieldExecutives.find((fe) => fe.id.toString() === selectedFEId) || null;
    setSelectedFE(currentFE);

    if (!currentFE) {
      setStockEntries([]);
      return;
    }

    try {
      setLoading(true);
      const [stockData, stockists] = await Promise.all([
        getStockistStocksByFe(currentFE.id),
        getAllStockists(),
      ]);

      const stockistMap = new Map((stockists || []).map((stockist) => [stockist.id, stockist]));

      const mapped: ManagerStockEntry[] = (stockData || []).map((item) => {
        const stockist = stockistMap.get(item.stockistId);

        return {
          id: item.id.toString(),
          productName: item.productName,
          marketName: stockist?.location || stockist?.marketName || "N/A",
          stockistName: item.stockistName,
          quantity: item.quantity,
          feId: currentFE.id,
          feName: currentFE.name,
          managerName: currentFE.managerName,
        };
      });

      setStockEntries(mapped);
    } catch (error) {
      console.error("Failed to load selected FE stock entries:", error);
      toast({
        title: "Error",
        description: "Failed to load selected field executive stock data.",
        variant: "destructive",
      });
      setStockEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedFEId) {
      setSelectedFE(null);
      setStockEntries([]);
      return;
    }

    loadStockEntries();
  }, [selectedFEId, fieldExecutives, toast]);

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Stock Updates</h1>
              <p className="text-muted-foreground mt-1">
                Live stock data for the selected field executive
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="space-y-2 min-w-[280px]">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Field Executive
                    </Label>
                    <Select value={selectedFEId} onValueChange={setSelectedFEId}>
                      <SelectTrigger className="h-11 bg-background">
                        <SelectValue placeholder="Select a field executive" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldExecutives.map((fe) => (
                          <SelectItem key={fe.id} value={fe.id.toString()}>
                            {fe.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              {loading ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    Loading stock data for the selected field executive...
                  </CardContent>
                </Card>
              ) : (
                <StockTable
                  stockEntries={stockEntries}
                  hideActions
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerEmployeeStock;

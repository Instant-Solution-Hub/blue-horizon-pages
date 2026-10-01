import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import StockTable, { StockEntry } from "@/components/manager-stock/StockTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { fetchFEs, FieldExecutive } from "@/services/FEService";
import {
  getAllStockists,
  getStockByFeAndMonthRange,
  getStockistStocksByFe,
} from "@/services/StockistService";

interface AdminStockEntry extends StockEntry {
  feId: number;
  feName: string;
  managerName: string;
}

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AdminStockUpdate = () => {
  const { toast } = useToast();
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [selectedFEId, setSelectedFEId] = useState<string>("");
  const [selectedFE, setSelectedFE] = useState<FieldExecutive | null>(null);
  const [stockEntries, setStockEntries] = useState<AdminStockEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromMonth, setFromMonth] = useState<string>("");
  const [toMonth, setToMonth] = useState<string>("");

  useEffect(() => {
    const loadFieldExecutives = async () => {
      try {
        const fes = await fetchFEs();
        setFieldExecutives(Array.isArray(fes) ? fes : []);
      } catch (error) {
        console.error("Failed to load field executives:", error);
        toast({
          title: "Error",
          description: "Failed to load field executives.",
          variant: "destructive",
        });
      }
    };

    loadFieldExecutives();
  }, [toast]);

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
        fromMonth && toMonth
          ? getStockByFeAndMonthRange(currentFE.id, fromMonth, toMonth)
          : getStockistStocksByFe(currentFE.id),
        getAllStockists(),
      ]);

      const stockistMap = new Map((stockists || []).map((stockist) => [stockist.id, stockist]));

      const mapped: AdminStockEntry[] = (stockData || []).map((item) => {
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
      console.error("Failed to load FE stock entries:", error);
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
  }, [selectedFEId, fieldExecutives, fromMonth, toMonth, toast]);

  const handleClearFilters = () => {
    setFromMonth("");
    setToMonth("");
  };

  const handleExport = () => {
    if (!selectedFE) {
      toast({
        title: "Select a field executive",
        description: "Choose a field executive before exporting stock data.",
        variant: "destructive",
      });
      return;
    }

    if (stockEntries.length === 0) {
      toast({
        title: "Nothing to export",
        description: "No stock entries are available for the selected field executive.",
        variant: "destructive",
      });
      return;
    }

    const rows = stockEntries.map((entry) => ({
      FE_ID: entry.feId,
      FE_Name: entry.feName,
      Manager_Name: entry.managerName,
      Product: entry.productName,
      Market: entry.marketName,
      Stockist: entry.stockistName,
      Quantity: entry.quantity,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Updates");
    XLSX.writeFile(wb, `${selectedFE.name}-stock-updates.xlsx`);

    toast({
      title: "Exported",
      description: `${rows.length} stock entries exported to Excel for ${selectedFE.name}.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Stock Updates</h1>
                <p className="text-muted-foreground mt-1">
                  Live stock data for the selected field executive
                </p>
              </div>
              <Button onClick={handleExport} className="gap-2" disabled={!selectedFE || stockEntries.length === 0}>
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
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

                  <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="from-month">From Month</Label>
                    <Select value={fromMonth} onValueChange={setFromMonth}>
                      <SelectTrigger id="from-month" className="h-11 bg-background">
                        <SelectValue placeholder="Select from month" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 min-w-[180px]">
                    <Label htmlFor="to-month">To Month</Label>
                    <Select value={toMonth} onValueChange={setToMonth}>
                      <SelectTrigger id="to-month" className="h-11 bg-background">
                        <SelectValue placeholder="Select to month" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" onClick={handleClearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedFE && (
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Field Executive</p>
                      <p className="font-semibold text-foreground">{selectedFE.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Manager</p>
                      <p className="font-semibold text-foreground">{selectedFE.managerName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">FE ID</p>
                      <p className="font-semibold text-foreground">{selectedFE.id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
        </main>
      </div>
    </div>
  );
};

export default AdminStockUpdate;
